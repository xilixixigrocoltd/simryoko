// /api/stripe-webhook — Stripe Webhook 事件监听
// 监控：争议/拒付、支付失败、退款等风险事件
// ⚠️ 必须禁用 bodyParser 才能验证 Stripe 签名
const StripeLib = require('stripe');
const { notifyAdmin } = require('./_notify');

// Vercel：禁用自动 JSON 解析，保留原始 body 用于签名验证
module.exports.config = { api: { bodyParser: false } };

// 读取原始请求体
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// 金额格式化（Stripe 单位：分）
function formatAmount(amount, currency = 'usd') {
  return `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

// 争议原因中文说明
const DISPUTE_REASONS = {
  bank_cannot_process:       '银行无法处理',
  check_returned:            '支票退回',
  credit_not_processed:      '未收到退款',
  customer_initiated:        '客户主动发起',
  debit_not_authorized:      '未授权扣款',
  duplicate:                 '重复扣款',
  fraudulent:                '欺诈交易',
  general:                   '一般争议',
  incorrect_account_details: '账户信息错误',
  insufficient_funds:        '余额不足',
  most_recent_transaction:   '最近交易',
  not_received:              '未收到商品',
  product_not_received:      '未收到产品',
  product_unacceptable:      '产品质量问题',
  subscription_canceled:     '订阅已取消',
  unrecognized:              '不认识此交易',
};

// 争议状态中文
const DISPUTE_STATUS = {
  warning_needs_response:    '⚠️ 预警-待响应',
  warning_under_review:      '🔍 预警-审核中',
  warning_closed:            '✅ 预警-已关闭',
  needs_response:            '🔴 待响应（紧急）',
  under_review:              '🔍 审核中',
  charge_refunded:           '💸 已退款',
  won:                       '🏆 争议胜出',
  lost:                      '❌ 争议失败',
};

// ── 事件处理器 ────────────────────────────────────────────────────────────────

async function handleDisputeCreated(dispute) {
  const reason = DISPUTE_REASONS[dispute.reason] || dispute.reason;
  const amount = formatAmount(dispute.amount, dispute.currency);
  const dueDate = dispute.evidence_details?.due_by
    ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString('zh-CN')
    : '未知';
  const chargeId = dispute.charge;

  await notifyAdmin(
    `🚨 <b>Stripe 拒付争议！</b>\n\n` +
    `金额: <b>${amount}</b>\n` +
    `原因: ${reason}\n` +
    `状态: ${DISPUTE_STATUS[dispute.status] || dispute.status}\n` +
    `争议 ID: <code>${dispute.id}</code>\n` +
    `关联 Charge: <code>${chargeId}</code>\n` +
    `响应截止: <b>${dueDate}</b>\n\n` +
    `⚡ 请在截止日前到 Stripe Dashboard 提交证据：\n` +
    `https://dashboard.stripe.com/disputes/${dispute.id}`
  );
}

async function handleDisputeUpdated(dispute) {
  const status = DISPUTE_STATUS[dispute.status] || dispute.status;
  const amount = formatAmount(dispute.amount, dispute.currency);

  await notifyAdmin(
    `📋 <b>争议状态更新</b>\n\n` +
    `争议 ID: <code>${dispute.id}</code>\n` +
    `金额: ${amount}\n` +
    `新状态: ${status}\n\n` +
    `https://dashboard.stripe.com/disputes/${dispute.id}`
  );
}

async function handleDisputeClosed(dispute) {
  const won = dispute.status === 'won';
  const status = DISPUTE_STATUS[dispute.status] || dispute.status;
  const amount = formatAmount(dispute.amount, dispute.currency);

  await notifyAdmin(
    `${won ? '🏆' : '❌'} <b>争议已结案</b>\n\n` +
    `结果: <b>${status}</b>\n` +
    `金额: ${amount}\n` +
    `争议 ID: <code>${dispute.id}</code>\n` +
    `${won ? '恭喜，争议裁决胜出！金额将返还。' : '争议失败，款项已退还给客户。建议检查该订单。'}`
  );
}

async function handleChargeRefunded(charge) {
  const refundAmount = formatAmount(
    charge.amount_refunded,
    charge.currency
  );
  await notifyAdmin(
    `💸 <b>发生退款</b>\n\n` +
    `退款金额: ${refundAmount}\n` +
    `Charge ID: <code>${charge.id}</code>\n` +
    `客户邮箱: ${charge.billing_details?.email || charge.receipt_email || '未知'}\n` +
    `退款原因: ${charge.refunds?.data?.[0]?.reason || '未填写'}`
  );
}

async function handlePaymentFailed(intent) {
  // 仅记录卡被拒等错误，不通知（避免正常失败刷屏），只在高风险时通知
  const errCode = intent.last_payment_error?.code;
  const HIGH_RISK = ['card_declined', 'fraudulent', 'stolen_card', 'lost_card', 'do_not_honor'];
  if (!HIGH_RISK.includes(errCode)) return; // 普通失败忽略

  await notifyAdmin(
    `⚠️ <b>高风险支付失败</b>\n\n` +
    `错误代码: <code>${errCode}</code>\n` +
    `金额: ${formatAmount(intent.amount, intent.currency)}\n` +
    `PI ID: <code>${intent.id}</code>\n` +
    `邮箱: ${intent.receipt_email || intent.metadata?.email || '未知'}`
  );
}

// ── 主处理器 ──────────────────────────────────────────────────────────────────

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && sig) {
      const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // 开发/测试：未配置 webhook secret 时直接解析（不验证签名）
      event = JSON.parse(rawBody.toString());
      console.warn('[stripe-webhook] ⚠️ Webhook secret not configured, skipping signature verification');
    }
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // 异步处理，立即返回 200（Stripe 要求 5s 内响应）
  res.status(200).json({ received: true });

  try {
    switch (event.type) {
      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object);
        break;
      case 'charge.dispute.updated':
        await handleDisputeUpdated(event.data.object);
        break;
      case 'charge.dispute.closed':
        await handleDisputeClosed(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        // 其他事件忽略
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] Handler error:', event.type, err.message);
  }
};
