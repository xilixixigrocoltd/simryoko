// /api/esim — 合并 usage + renewal/remind + push/subscribe
// /api/esim/usage          → 查询 eSIM 用量
// /api/renewal/remind      → cron 续费提醒（重写路由到此）
// /api/push/subscribe      → Web Push 订阅（重写路由到此）
const { getToken } = require('./_agent');
const { users, subscriptions } = require('./_users');
const { sendRenewalReminderEmail } = require('./_email');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyError } = require('./_notify');

const API_BASE = process.env.API_BASE || 'https://ciuh32wky.xigrocoltd.com/api';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc';
const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID || '7867683484';

async function tgSend(chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }) });
  } catch (e) {}
}

// ── usage ─────────────────────────────────────────────────────────────────────
async function handleUsage(req, res) {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 20, 60000)) return;
  const { iccid, orderId } = req.query;
  if (!iccid && !orderId) return res.status(400).json({ error: 'Provide iccid or orderId' });
  try {
    const token = await getToken();
    if (iccid) {
      const usageRes = await fetch(`${API_BASE}/agent/esim/usage?iccid=${encodeURIComponent(iccid)}`, { headers: { Authorization: `Bearer ${token}` } });
      if (usageRes.ok) { const data = await usageRes.json(); return res.json({ success: true, data: normalizeUsage(data) }); }
    }
    return res.json({ success: true, data: { available: false, message: 'Usage data not available. Check device settings.' } });
  } catch (err) {
    return res.json({ success: true, data: { available: false, message: 'Unable to retrieve usage data.' } });
  }
}

function normalizeUsage(raw) {
  const d = raw?.data || raw;
  const total = toMB(d?.total_mb || d?.totalMb || d?.dataTotal);
  const used = toMB(d?.used_mb || d?.usedMb || d?.dataUsed);
  const remaining = d?.remaining_mb ? toMB(d.remaining_mb) : (total && used ? total - used : null);
  const expiryDate = d?.expiry_date || d?.expiryDate || d?.validUntil;
  const daysLeft = expiryDate ? Math.max(0, Math.ceil((new Date(expiryDate) - Date.now()) / 86400000)) : null;
  return { available: true, totalMB: total, usedMB: used, remainingMB: remaining, usedPercent: total > 0 ? Math.round((used / total) * 100) : null, expiryDate, daysLeft, lowData: remaining !== null && (remaining < 200 || (total > 0 && remaining / total < 0.2)), expiringSoon: daysLeft !== null && daysLeft <= 3 };
}
function toMB(val) { if (val == null) return null; const str = String(val).trim().toUpperCase(); const num = parseFloat(str); if (str.includes('GB')) return num * 1024; return num; }

// ── renewal/remind ────────────────────────────────────────────────────────────
async function handleRenewalRemind(req, res) {
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET || 'simkaze-cron-2026'}`) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const expiring = subscriptions.expiringSoon(3);
    let sent = 0, skipped = 0;
    for (const sub of expiring) {
      if (sub.reminderSent) { skipped++; continue; }
      const daysLeft = Math.max(0, Math.ceil((new Date(sub.expiryDate) - Date.now()) / 86400000));
      try {
        await sendRenewalReminderEmail({ to: sub.email, productName: sub.productName, daysLeft, expiryDate: sub.expiryDate, renewUrl: `https://simkaze.com/shop.html?renew=${sub.id}&email=${encodeURIComponent(sub.email)}`, price: sub.price });
        subscriptions.update(sub.id, { reminderSent: true });
        sent++;
      } catch (e) {
        notifyError(`续费提醒失败: ${sub.email} — ${e.message}`).catch(() => {});
      }
    }
    if (expiring.length > 0) await tgSend(ADMIN_ID, `📅 *续费提醒完成*\n到期: ${expiring.length} | 发送: ${sent} | 跳过: ${skipped}`);
    return res.json({ success: true, data: { total: expiring.length, sent, skipped } });
  } catch (err) {
    notifyError(`续费提醒cron异常: ${err.message}`).catch(() => {});
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── push/subscribe ────────────────────────────────────────────────────────────
async function handlePush(req, res) {
  setCors(req, res, 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 10, 60000)) return;
  if (req.method === 'GET') return res.json({ success: true, vapidPublicKey: process.env.VAPID_PUBLIC || '' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, subscription } = req.body;
  if (!email || !subscription) return res.status(400).json({ error: 'Missing email or subscription' });
  users.upsert(email, { pushSubscription: subscription });
  return res.json({ success: true, message: 'Push subscription saved' });
}

// ── router ────────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.includes('/renewal') || path.includes('/remind')) return handleRenewalRemind(req, res);
  if (path.includes('/push'))                                  return handlePush(req, res);
  return handleUsage(req, res);
};
