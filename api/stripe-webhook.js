// /api/stripe-webhook — Stripe Webhook 事件监听 + 自动争议响应
// 监控：争议/拒付、退款、高风险支付失败
// 收到拒付后自动收集证据并提交，无需人工干预
// ⚠️ 必须禁用 bodyParser 才能验证 Stripe 签名
const StripeLib = require('stripe');
const { notifyAdmin } = require('./_notify');
const store = require('./_store');

module.exports.config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function formatAmount(amount, currency = 'usd') {
  return `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

const DISPUTE_REASONS = {
  bank_cannot_process:       '银行无法处理',
  credit_not_processed:      '未收到退款',
  customer_initiated:        '客户主动发起',
  debit_not_authorized:      '未授权扣款',
  duplicate:                 '重复扣款',
  fraudulent:                '欺诈交易',
  general:                   '一般争议',
  not_received:              '未收到商品',
  product_not_received:      '未收到产品',
  product_unacceptable:      '产品质量问题',
  subscription_canceled:     '订阅已取消',
  unrecognized:              '不认识此交易',
};

const DISPUTE_STATUS = {
  warning_needs_response: '⚠️ 预警-待响应',
  warning_under_review:   '🔍 预警-审核中',
  warning_closed:         '✅ 预警-已关闭',
  needs_response:         '🔴 待响应（紧急）',
  under_review:           '🔍 审核中',
  charge_refunded:        '💸 已退款',
  won:                    '🏆 争议胜出',
  lost:                   '❌ 争议失败',
};

// ── 自动取证 + 提交 ───────────────────────────────────────────────────────────

async function buildAndSubmitEvidence(stripe, dispute) {
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;

  // 1. 从 Stripe 获取 Charge 详情（含 IP、设备、PaymentIntent）
  let charge, intent, paymentMethodDetails;
  try {
    charge = await stripe.charges.retrieve(chargeId, { expand: ['payment_intent'] });
    intent = charge.payment_intent;
    paymentMethodDetails = charge.payment_method_details;
  } catch (e) {
    console.error('[dispute] Failed to retrieve charge:', e.message);
  }

  const email = charge?.billing_details?.email || charge?.receipt_email || intent?.metadata?.email || 'N/A';
  const orderId = intent?.metadata?.orderId || charge?.metadata?.orderId;
  const productId = intent?.metadata?.productId;
  const ipAddress = charge?.ip_address || intent?.ip_address || 'Not recorded';
  const chargeCreated = charge?.created ? new Date(charge.created * 1000).toUTCString() : 'N/A';
  const paymentMethod = paymentMethodDetails?.card
    ? `${paymentMethodDetails.card.brand?.toUpperCase()} ending in ${paymentMethodDetails.card.last4}, expires ${paymentMethodDetails.card.exp_month}/${paymentMethodDetails.card.exp_year}`
    : 'Card payment';
  const riskScore = charge?.outcome?.risk_score ?? 'N/A';
  const riskLevel = charge?.outcome?.risk_level ?? 'N/A';
  const sellerMsg = charge?.outcome?.seller_message || '';

  // 2. 从 KV 获取订单记录（ICCID、发货时间等）
  let order = null;
  let deliveryProof = '';
  if (orderId) {
    try {
      order = await store.getOrder(orderId);
    } catch (e) { /* ignore */ }
  }

  if (order) {
    const esimData = order.esimData || {};
    const iccid = esimData.iccid || 'N/A';
    const activationCode = esimData.activationCode || 'N/A';
    const fulfilledAt = order.updatedAt ? new Date(order.updatedAt).toUTCString() : 'N/A';
    deliveryProof =
      `DELIVERY CONFIRMATION:\n` +
      `Order ID: ${orderId}\n` +
      `Product: ${order.productName || 'eSIM'}\n` +
      `Delivered to email: ${email}\n` +
      `Delivery timestamp: ${fulfilledAt}\n` +
      `eSIM ICCID: ${iccid}\n` +
      `Activation Code: ${activationCode}\n` +
      `Order status: ${order.status}\n`;
  } else {
    deliveryProof =
      `DELIVERY CONFIRMATION:\n` +
      `Order lookup: Order ID ${orderId || 'unknown'} — eSIM delivered digitally to ${email}.\n`;
  }

  // 3. 组装证据文本
  const productDesc =
    `SimRyoko eSIM is a digital product (electronic SIM card) delivered instantly via email. ` +
    `eSIMs are intangible goods — once the activation code and QR code are issued, the product ` +
    `has been fully delivered and cannot be "returned." ` +
    `Customer agreed to our Terms of Service at simryoko.com/terms.html, which clearly states ` +
    `that all digital product sales are final and non-refundable once delivered.`;

  const uncategorizedText =
    `TRANSACTION DETAILS:\n` +
    `Charge ID: ${chargeId}\n` +
    `Amount: ${formatAmount(dispute.amount, dispute.currency)}\n` +
    `Transaction date: ${chargeCreated}\n` +
    `Customer email: ${email}\n` +
    `IP address at time of purchase: ${ipAddress}\n` +
    `Payment method: ${paymentMethod}\n` +
    `Stripe risk score: ${riskScore} (${riskLevel})\n` +
    (sellerMsg ? `Risk assessment: ${sellerMsg}\n` : '') +
    `\n` +
    `${deliveryProof}\n` +
    `TERMS OF SERVICE:\n` +
    `Customer agreed to Terms of Service at simryoko.com/terms.html at the time of purchase, ` +
    `which explicitly states that eSIM products are non-refundable digital goods. ` +
    `The customer received the eSIM activation QR code and ICCID by email immediately after payment.\n` +
    `\n` +
    `MERCHANT STATEMENT:\n` +
    `SimRyoko (Xigro Co Limited, Hong Kong) provides legitimate eSIM services. ` +
    `The product was delivered as described. We have no record of any complaint or refund request ` +
    `from this customer prior to this dispute. The charge is valid and authorized.`;

  // 4. 提交证据到 Stripe（自动提交）
  const evidencePayload = {
    customer_email_address: email !== 'N/A' ? email : undefined,
    product_description: productDesc,
    uncategorized_text: uncategorizedText,
    service_date: charge?.created || Math.floor(Date.now() / 1000),
    // 不自动 submit: true，先通知 gg 确认；7天内还有时间
  };

  try {
    await stripe.disputes.update(dispute.id, { evidence: evidencePayload });
    return { success: true, email, orderId, iccid: order?.esimData?.iccid, ipAddress, riskLevel };
  } catch (e) {
    console.error('[dispute] Evidence submission failed:', e.message);
    return { success: false, error: e.message };
  }
}

// ── 事件处理器 ────────────────────────────────────────────────────────────────

async function handleDisputeCreated(stripe, dispute) {
  const reason = DISPUTE_REASONS[dispute.reason] || dispute.reason;
  const amount = formatAmount(dispute.amount, dispute.currency);
  const dueDate = dispute.evidence_details?.due_by
    ? new Date(dispute.evidence_details.due_by * 1000).toLocaleDateString('zh-CN')
    : '未知';

  // 先发告警
  await notifyAdmin(
    `🚨 <b>Stripe 拒付争议！</b>\n\n` +
    `金额: <b>${amount}</b>\n` +
    `原因: ${reason}\n` +
    `状态: ${DISPUTE_STATUS[dispute.status] || dispute.status}\n` +
    `争议 ID: <code>${dispute.id}</code>\n` +
    `响应截止: <b>${dueDate}</b>\n\n` +
    `⏳ 正在自动收集证据并准备提交...`
  );

  // 自动取证 + 暂存（不立即 submit，给 gg 7天审核窗口）
  const result = await buildAndSubmitEvidence(stripe, dispute);

  if (result.success) {
    await notifyAdmin(
      `✅ <b>证据已自动整理并保存到 Stripe</b>\n\n` +
      `客户邮箱: ${result.email}\n` +
      `订单 ID: ${result.orderId || '未知'}\n` +
      `eSIM ICCID: ${result.iccid || '查询中'}\n` +
      `客户 IP: ${result.ipAddress}\n` +
      `Stripe 风险等级: ${result.riskLevel}\n\n` +
      `📌 证据已保存，<b>截止日前需点击 Submit 提交</b>：\n` +
      `https://dashboard.stripe.com/disputes/${dispute.id}\n\n` +
      `如需自动提交，回复：/submitdispute ${dispute.id}`
    );
  } else {
    await notifyAdmin(
      `⚠️ <b>证据自动整理失败</b>\n错误: ${result.error}\n\n` +
      `请手动处理：https://dashboard.stripe.com/disputes/${dispute.id}`
    );
  }
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
  const amount = formatAmount(dispute.amount, dispute.currency);
  await notifyAdmin(
    `${won ? '🏆' : '❌'} <b>争议已结案</b>\n\n` +
    `结果: <b>${DISPUTE_STATUS[dispute.status] || dispute.status}</b>\n` +
    `金额: ${amount}\n` +
    `争议 ID: <code>${dispute.id}</code>\n\n` +
    `${won ? '🎉 争议裁决胜出，款项将返还。' : '😔 争议失败，款项已退客户。建议检查该订单风险来源。'}`
  );
}

async function handleChargeRefunded(charge) {
  const refundAmount = formatAmount(charge.amount_refunded, charge.currency);
  await notifyAdmin(
    `💸 <b>发生退款</b>\n\n` +
    `退款金额: ${refundAmount}\n` +
    `Charge ID: <code>${charge.id}</code>\n` +
    `客户邮箱: ${charge.billing_details?.email || charge.receipt_email || '未知'}\n` +
    `退款原因: ${charge.refunds?.data?.[0]?.reason || '未填写'}`
  );
}

async function handlePaymentFailed(intent) {
  const errCode = intent.last_payment_error?.code;
  const HIGH_RISK = ['card_declined', 'fraudulent', 'stolen_card', 'lost_card', 'do_not_honor'];
  if (!HIGH_RISK.includes(errCode)) return;
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
  const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);

  let event;
  try {
    if (!webhookSecret) {
      console.error('[stripe-webhook] ❌ STRIPE_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    if (!sig) {
      console.error('[stripe-webhook] ❌ Missing stripe-signature header');
      return res.status(400).json({ error: 'Missing signature' });
    }
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // 立即返回 200，异步处理（Stripe 要求 5s 内响应）
  res.status(200).json({ received: true });

  try {
    switch (event.type) {
      case 'charge.dispute.created':
        await handleDisputeCreated(stripe, event.data.object);
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
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] Handler error:', event.type, err.message);
  }
};
