// /api/admin — 后台管理：Token 自动续期 + 订单管理 + 系统状态
// 所有操作均需 CRON_SECRET 验证

const axios = require('axios');
const store = require('./_store');
const { sendEsimEmail } = require('./_email');
const { getBalance, placeOrder, apiCall } = require('./_agent');
const { notifyAdmin } = require('./_notify');

const VERCEL_TOKEN  = process.env.VERCEL_TOKEN  || '';
const PROJECT_ID    = process.env.VERCEL_PROJECT_ID || 'prj_SbPkDXGAojvyJhkpz0iiBix0m13L';
const API_BASE      = process.env.API_BASE       || 'https://ciuh32wky.xigrocoltd.com/api';
const AGENT_USER    = process.env.AGENT_USERNAME || 'lx001';
const AGENT_PASS    = process.env.AGENT_PASSWORD || '123123';
const CRON_SECRET   = process.env.CRON_SECRET    || 'simryoko-cron-2026';
const TG_BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN || '8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID   || '7867683484';

function auth(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (secret !== CRON_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ── Telegram 通知 ─────────────────────────────────────────────────────────────
async function tgNotify(msg) {
  try {
    await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      chat_id: ADMIN_CHAT_ID, text: msg, parse_mode: 'Markdown'
    });
  } catch (e) { console.error('[tg-notify]', e.message); }
}

// ── 1. Token 自动续期 ─────────────────────────────────────────────────────────
// 每 25 天调用一次（Cron），自动刷新 B2B_TOKEN 环境变量，无需人工干预
async function handleTokenRefresh(req, res) {
  try {
    console.log('[admin] Starting token refresh...');

    // Step 1: 登录 B2B API 获取新 Token
    const loginRes = await axios.post(`${API_BASE}/agent/login`, {
      username: AGENT_USER, password: AGENT_PASS
    }, { timeout: 10000 });

    if (!loginRes.data.success) {
      const msg = `⚠️ *Token 续期失败*\n原因：${loginRes.data.message}\n请手动登录 B2B 控制台检查账号状态`;
      await tgNotify(msg);
      return res.status(500).json({ error: 'Login failed', message: loginRes.data.message });
    }

    const newToken = loginRes.data.data.token;
    const expiry   = loginRes.data.data.expiresAt || '29天后';

    // Step 2: 更新 Vercel 环境变量
    if (VERCEL_TOKEN) {
      // 删除旧 B2B_TOKEN
      const listRes = await axios.get(
        `https://api.vercel.com/v9/projects/${PROJECT_ID}/env`,
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
      );
      const envs = listRes.data.envs || [];
      const oldEnv = envs.find(e => e.key === 'B2B_TOKEN');
      if (oldEnv) {
        await axios.delete(
          `https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${oldEnv.id}`,
          { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
        );
      }

      // 创建新 B2B_TOKEN
      await axios.post(
        `https://api.vercel.com/v9/projects/${PROJECT_ID}/env`,
        {
          key: 'B2B_TOKEN', value: newToken,
          type: 'encrypted',
          target: ['production', 'preview']
        },
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
      );

      // Step 3: 触发重新部署（让新 env var 生效）
      const deplRes = await axios.get(
        `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`,
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
      );
      const lastDepId = deplRes.data.deployments?.[0]?.uid;
      if (lastDepId) {
        await axios.post(
          'https://api.vercel.com/v13/deployments?forceNew=1&withCache=0',
          { deploymentId: lastDepId, name: 'simryoko', target: 'production' },
          { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
        );
      }

      await tgNotify(`✅ *B2B Token 已自动续期*\n过期时间：${expiry}\nVercel 已更新并重新部署，无需任何手动操作`);
      return res.json({ success: true, message: 'Token refreshed and Vercel updated', expiry });
    } else {
      // 没有 Vercel Token，只通知新 Token 让人工更新
      await tgNotify(`🔑 *B2B Token 已刷新，但需手动更新 Vercel*\n新 Token（前30字）：\`${newToken.substring(0,30)}...\`\n请在 Vercel Dashboard → Environment Variables → B2B_TOKEN 中更新`);
      return res.json({ success: true, token: newToken.substring(0, 20) + '...', note: 'Update VERCEL_TOKEN env var for fully automatic operation' });
    }
  } catch (err) {
    await tgNotify(`🔴 *Token 续期报错*\n\`${err.message}\``);
    console.error('[token-refresh]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// ── 2. 系统状态检查 ───────────────────────────────────────────────────────────
async function handleStatus(req, res) {
  const results = { timestamp: new Date().toISOString() };

  // B2B API 余额
  try {
    results.balance = await getBalance();
    results.balanceOk = results.balance >= 50;
  } catch (e) {
    results.balance = null;
    results.balanceError = e.message;
    results.balanceOk = false;
  }

  // 近期订单统计
  const orders = await store.listOrders() // [];
  const now = Date.now();
  const last24h = orders.filter(o => now - new Date(o.createdAt).getTime() < 86400000);
  results.orders24h = {
    total: last24h.length,
    fulfilled: last24h.filter(o => o.status === 'fulfilled').length,
    failed: last24h.filter(o => o.status === 'failed').length,
    pending: last24h.filter(o => ['pending_payment','paid','processing'].includes(o.status)).length
  };

  // B2B Token 有效性检查
  try {
    await apiCall('get', '/agent/info');
    results.tokenOk = true;
  } catch (e) {
    results.tokenOk = false;
    results.tokenError = e.message;
  }

  return res.json({ success: true, data: results });
}

// ── 3. 订单列表 ───────────────────────────────────────────────────────────────
async function handleOrders(req, res) {
  const limit = parseInt(req.query.limit || '20');
  const status = req.query.status || '';
  let orders = await store.listOrders() // [];
  if (status) orders = orders.filter(o => o.status === status);
  orders = orders.slice(-limit).reverse();
  return res.json({ success: true, data: orders });
}

// ── 4. 订单补发 eSIM ──────────────────────────────────────────────────────────
async function handleResend(req, res) {
  const { orderId, email: overrideEmail } = req.method === 'GET' ? req.query : req.body;
  if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

  const order = await store.getOrder(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const targetEmail = overrideEmail || order.email;
  const esimData = order.esimData;

  if (!esimData || (!esimData.qrCodeUrl && !esimData.activationCode && !esimData.iccid)) {
    // 订单无 eSIM 数据，尝试重新下单
    if (order.productId) {
      try {
        const orderResult = await placeOrder(order.productId, 1);
        if (orderResult.success) {
          const d = orderResult.data || orderResult;
          const item = (d.items && d.items[0]) || d;
          const newEsimData = {
            qrCodeUrl: item.qrCodeUrl || item.qrUrl || d.qrCodeUrl || '',
            iccid: item.iccid || d.iccid || '',
            activationCode: item.activationCode || item.lpa || d.lpa || ''
          };
          if (newEsimData.activationCode && !newEsimData.qrCodeUrl) {
            const QRCode = require('qrcode');
            newEsimData.qrCodeUrl = await QRCode.toDataURL(newEsimData.activationCode, { width: 300 });
          }
          await store.updateOrder(orderId, { esimData: newEsimData, status: 'fulfilled' });
          await sendEsimEmail({ to: targetEmail, productName: order.productName, ...newEsimData, country: order.country });
          await tgNotify(`✅ 订单 \`${orderId}\` 重新下单并补发成功 → ${targetEmail}`);
          return res.json({ success: true, message: 'Replaced and resent', esimData: newEsimData });
        }
      } catch (e) {
        return res.status(500).json({ error: 'Failed to re-place order: ' + e.message });
      }
    }
    return res.status(400).json({ error: 'Order has no eSIM data and no productId for re-order' });
  }

  // 已有 eSIM 数据，直接补发
  await sendEsimEmail({
    to: targetEmail,
    productName: order.productName,
    qrCodeUrl: esimData.qrCodeUrl || '',
    iccid: esimData.iccid || '',
    activationCode: esimData.activationCode || '',
    country: order.country
  });

  await tgNotify(`📧 eSIM 已补发\n订单：\`${orderId}\`\n邮箱：${targetEmail}\n套餐：${order.productName}`);
  return res.json({ success: true, message: `eSIM resent to ${targetEmail}` });
}

// ── Stripe Webhook 注册（一次性操作）────────────────────────────────────────
async function handleRegisterStripeWebhook(req, res) {
  const StripeLib = require('stripe');
  const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);
  const webhookUrl = 'https://simryoko.com/api/stripe-webhook';

  try {
    // 先检查是否已存在
    const existing = await stripe.webhookEndpoints.list({ limit: 20 });
    const found = existing.data.find(w => w.url === webhookUrl);
    if (found) {
      return res.json({
        success: true,
        message: 'Webhook already registered',
        id: found.id,
        status: found.status,
        note: 'Secret cannot be retrieved after creation. If lost, delete and re-create.'
      });
    }

    // 创建新 Webhook
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'charge.dispute.created',
        'charge.dispute.updated',
        'charge.dispute.closed',
        'charge.refunded',
        'payment_intent.payment_failed',
      ],
      description: 'SimRyoko risk monitoring — disputes & refunds',
    });

    // 自动存入 Vercel 环境变量
    const secret = webhook.secret;
    if (secret && VERCEL_TOKEN) {
      const envRes = await axios.post(
        `https://api.vercel.com/v10/projects/${PROJECT_ID}/env`,
        { key: 'STRIPE_WEBHOOK_SECRET', value: secret, type: 'encrypted', target: ['production', 'preview'] },
        { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
      ).catch(e => ({ data: { error: e.message } }));
      console.log('[admin/register-stripe-webhook] Vercel env set:', envRes.data);
    }

    return res.json({
      success: true,
      message: 'Stripe webhook registered successfully',
      id: webhook.id,
      secret: secret, // 仅此一次可见，已自动存入 Vercel
      events: webhook.enabled_events,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ── Stripe 争议证据正式提交 ────────────────────────────────────────────────────
async function handleSubmitDispute(req, res) {
  const StripeLib = require('stripe');
  const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);
  const disputeId = req.query.id || req.body?.disputeId;
  if (!disputeId) return res.status(400).json({ error: 'Missing dispute ID (use ?id=disp_xxx)' });

  try {
    const dispute = await stripe.disputes.retrieve(disputeId);
    if (['won', 'lost', 'charge_refunded'].includes(dispute.status)) {
      return res.json({ success: false, message: `Dispute already closed: ${dispute.status}` });
    }

    // 正式提交（submit: true）
    const updated = await stripe.disputes.update(disputeId, { submit: true });
    await tgNotify(
      `📤 <b>争议证据已正式提交</b>\n\n` +
      `争议 ID: <code>${disputeId}</code>\n` +
      `金额: $${(dispute.amount / 100).toFixed(2)}\n` +
      `状态: ${updated.status}\n\n` +
      `Stripe 将在 5-7 个工作日内裁决。`
    );
    return res.json({ success: true, message: 'Evidence submitted to Stripe', status: updated.status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ── B2B 申请（合并自 b2b-apply.js，释放函数槽位）────────────────────────────
async function handleB2BApply(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { applyRateLimit } = require('./_ratelimit');
  if (!applyRateLimit(req, res, 3, 60000)) return;
  const { sendRawEmail } = require('./_email');
  const { notifyB2BApply } = require('./_notify');
  try {
    const { name, company, email, whatsapp, btype, volume, notes } = req.body;
    if (!name || !company || !email || !btype)
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    notifyB2BApply({ name, company, email, whatsapp, btype, volume }).catch(() => {});
    await sendRawEmail({
      to: process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com',
      subject: `🤝 New B2B Partner Application — ${company}`,
      html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px"><h2 style="color:#6C63FF">New Partner Application</h2><p><b>Name:</b> ${name}<br><b>Company:</b> ${company}<br><b>Email:</b> ${email}<br><b>WhatsApp:</b> ${whatsapp||'N/A'}<br><b>Type:</b> ${btype}<br><b>Volume:</b> ${volume||'N/A'}<br><b>Notes:</b> ${notes||'None'}</p></div>`
    });
    await sendRawEmail({
      to: email,
      subject: `Your SimRyoko Partner Application — ${company}`,
      html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px"><h2>Application Received! 🎉</h2><p>Hi ${name}, we received your application for <b>${company}</b> and will reply within 24 hours.</p><p>Contact: <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a> | <a href="https://wa.me/19402382990">WhatsApp</a></p></div>`
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// ── 购后跟进邮件（3天后自动发送，要好评+推荐码）────────────────────────────
async function handleFollowup(req, res) {
  try {
    const { sendRawEmail } = require('./_email');
    const orders = await store.listOrders();
    const now = Date.now();
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const FOUR_DAYS  = 4 * 24 * 60 * 60 * 1000;
    let sent = 0, skipped = 0;

    for (const order of orders) {
      if (!order || !order.email) { skipped++; continue; }
      if (order.status !== 'paid' && order.status !== 'delivered') { skipped++; continue; }
      if (order.followupSent) { skipped++; continue; }

      const age = now - (order.paidAt || order.createdAt || 0);
      if (age < THREE_DAYS || age > FOUR_DAYS) { skipped++; continue; }

      // 生成推荐码（邮箱 hash 前6位，与 referral.js 一致）
      const crypto = require('crypto');
      const refCode = crypto.createHash('sha256').update(order.email.toLowerCase()).digest('hex').substring(0, 6).toUpperCase();
      const refLink = `https://simryoko.com?ref=${refCode}`;

      const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:Inter,Helvetica,sans-serif;background:#f8f9ff;margin:0;padding:0}
.wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(102,126,234,.1)}
.header{background:linear-gradient(135deg,#667eea,#764ba2);padding:32px;text-align:center}
.header h1{color:#fff;font-size:1.5rem;margin:0}
.body{padding:32px}
.stars{font-size:2rem;text-align:center;margin:16px 0;color:#f59e0b}
h2{color:#1a1a2e;font-size:1.1rem}
p{color:#555;line-height:1.7}
.cta{display:block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;text-align:center;font-weight:700;margin:24px 0}
.ref-box{background:#f8f9ff;border:1px solid rgba(102,126,234,.2);border-radius:10px;padding:20px;margin:24px 0}
.ref-code{font-size:1.5rem;font-weight:800;color:#667eea;letter-spacing:3px;text-align:center;margin:8px 0}
.footer{background:#f8f9ff;padding:20px 32px;text-align:center;color:#999;font-size:0.8rem}
</style></head><body>
<div class="wrap">
  <div class="header"><h1>How was your trip? ✈️</h1></div>
  <div class="body">
    <div class="stars">★★★★★</div>
    <p>Hi there!</p>
    <p>It's been a few days since you used your <b>${order.productName || 'SimRyoko eSIM'}</b>. We hope your trip was amazing and the eSIM kept you connected throughout! 🌍</p>

    <h2>📝 Share your experience</h2>
    <p>Your feedback helps other travelers make better choices. Would you mind leaving a quick review?</p>
    <a href="https://t.me/Simryokoesimbot?start=review_${order.id}" class="cta">Leave a Review (takes 30 seconds)</a>

    <h2>💰 Earn with your referral link</h2>
    <div class="ref-box">
      <p style="margin:0;font-size:.9rem;color:#666;text-align:center">Your personal referral code</p>
      <div class="ref-code">${refCode}</div>
      <p style="margin:0;font-size:.85rem;color:#888;text-align:center">Share this link → earn <b>10% commission</b> on every order</p>
      <p style="margin:8px 0 0;font-size:.85rem;color:#667eea;text-align:center;word-break:break-all">${refLink}</p>
    </div>

    <p>Minimum payout: $10 USDT · Paid on request · No expiry</p>
    <p>Questions? Reply to this email or <a href="https://wa.me/19402382990" style="color:#667eea">WhatsApp us</a>.</p>
    <p>See you on your next trip! 🦞<br><b>SimRyoko Team</b></p>
  </div>
  <div class="footer">SimRyoko · <a href="https://simryoko.com" style="color:#667eea">simryoko.com</a> · <a href="mailto:noreply@simryoko.com" style="color:#667eea">Unsubscribe</a></div>
</div></body></html>`;

      try {
        await sendRawEmail({ to: order.email, subject: `How was your trip? ✈️ + Your referral code`, html });
        await store.updateOrder(order.id, { followupSent: true, followupSentAt: now });
        sent++;
        console.log(`[followup] Sent to ${order.email} (order ${order.id})`);
      } catch (e) {
        console.error(`[followup] Failed for ${order.email}:`, e.message);
      }
    }

    await tgNotify(`📧 *购后跟进邮件*\n发送: ${sent} 封 | 跳过: ${skipped} 封`);
    return res.json({ success: true, sent, skipped });
  } catch (err) {
    console.error('[followup] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// ── Router ────────────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // B2B 申请不需要鉴权
  const path = (req.url || '').split('?')[0];
  if (path.includes('/b2b-apply')) return handleB2BApply(req, res);

  if (!auth(req, res)) return;

  if (path.includes('/token-refresh'))           return handleTokenRefresh(req, res);
  if (path.includes('/status'))                  return handleStatus(req, res);
  if (path.includes('/orders'))                  return handleOrders(req, res);
  if (path.includes('/resend'))                  return handleResend(req, res);
  if (path.includes('/register-stripe-webhook')) return handleRegisterStripeWebhook(req, res);
  if (path.includes('/submit-dispute'))          return handleSubmitDispute(req, res);
  if (path.includes('/followup'))                return handleFollowup(req, res);

  return res.status(404).json({ error: 'Unknown admin action' });
};
