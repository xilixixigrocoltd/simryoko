// /api/user — 合并 profile + orders + subscribe
// /api/user/profile   → 用户资料
// /api/user/orders    → 订单历史
// /api/user/subscribe → 自动续费订阅
const store = require('./_store');
const { users, subscriptions } = require('./_users');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyNewOrder } = require('./_notify');

// ── profile ───────────────────────────────────────────────────────────────────
async function handleProfile(req, res) {
  setCors(req, res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 30, 60000)) return;
  const email = (req.method === 'GET' ? req.query.email : req.body?.email)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email required' });
  if (req.method === 'GET') return res.json({ success: true, data: sanitize(users.upsert(email)) });
  if (req.method === 'POST') {
    const { telegramId, language, autoRenew, usageAlerts, pushSubscription } = req.body;
    const updates = {};
    if (telegramId !== undefined) updates.telegramId = telegramId;
    if (language !== undefined) updates.language = language;
    if (autoRenew !== undefined) updates.autoRenew = !!autoRenew;
    if (usageAlerts !== undefined) updates.usageAlerts = !!usageAlerts;
    if (pushSubscription !== undefined) updates.pushSubscription = pushSubscription;
    return res.json({ success: true, data: sanitize(users.upsert(email, updates)) });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
function sanitize(u) { const { pushSubscription, ...safe } = u; return safe; }

// ── orders ────────────────────────────────────────────────────────────────────
async function handleOrders(req, res) {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 20, 60000)) return;
  const email = req.query.email?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Valid email required' });
  const allOrders = store.listOrders();
  const userOrders = allOrders
    .filter(o => o.email?.toLowerCase() === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(o => ({
      orderId: o.orderId, productName: o.productName, country: o.country,
      price: o.productPrice, status: o.status, createdAt: o.createdAt,
      esim: o.status === 'fulfilled' ? { iccid: o.esimData?.iccid || o.esimInfo?.iccid, qrCode: o.esimData?.qrCode || o.esimInfo?.qrCode, activationCode: o.esimData?.activationCode || o.esimInfo?.activationCode } : null,
    }));
  const userSubs = subscriptions.byEmail(email).map(s => ({ id: s.id, productName: s.productName, status: s.status, expiryDate: s.expiryDate, autoRenew: s.autoRenew }));
  return res.json({ success: true, data: { orders: userOrders, subscriptions: userSubs, total: userOrders.length } });
}

// ── subscribe ─────────────────────────────────────────────────────────────────
async function handleSubscribe(req, res) {
  setCors(req, res, 'POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 10, 60000)) return;
  if (req.method === 'POST') {
    const { email, productId, productName, price, iccid, expiryDate, paymentMethod } = req.body;
    if (!email || !productId || !expiryDate) return res.status(400).json({ error: 'Missing email, productId, or expiryDate' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (isNaN(new Date(expiryDate).getTime())) return res.status(400).json({ error: 'Invalid expiryDate' });
    users.upsert(email, { autoRenew: true });
    const sub = subscriptions.create({ email, productId, productName: productName || `eSIM Plan #${productId}`, price: parseFloat(price) || 0, iccid, expiryDate, paymentMethod: paymentMethod || 'usdt', autoRenew: true });
    notifyNewOrder({ orderId: `SUB-${sub.id}`, email, productName: sub.productName, paymentMethod: 'subscription' }).catch(() => {});
    return res.json({ success: true, data: sub });
  }
  if (req.method === 'PATCH') {
    const { subscriptionId, action } = req.body;
    if (!subscriptionId || !action) return res.status(400).json({ error: 'Missing subscriptionId or action' });
    const validActions = ['pause', 'resume', 'cancel'];
    if (!validActions.includes(action)) return res.status(400).json({ error: `Invalid action. Must be: ${validActions.join(', ')}` });
    const sub = subscriptions.update(subscriptionId, { status: action === 'cancel' ? 'cancelled' : action === 'pause' ? 'paused' : 'active', autoRenew: action !== 'cancel' && action !== 'pause' });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    return res.json({ success: true, data: sub });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

// ── router ────────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.endsWith('/orders'))    return handleOrders(req, res);
  if (path.endsWith('/subscribe')) return handleSubscribe(req, res);
  return handleProfile(req, res);
};
