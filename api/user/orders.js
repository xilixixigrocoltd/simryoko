// GET /api/user/orders?email=... — 查询用户订单历史
const store = require('../_store');
const { subscriptions } = require('../_users');
const { applyRateLimit, setCors } = require('../_ratelimit');

module.exports = async (req, res) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 20, 60000)) return;

  const email = req.query.email?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // 查找该邮箱的所有订单
  const allOrders = store.listOrders();
  const userOrders = allOrders
    .filter(o => o.email?.toLowerCase() === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(o => ({
      orderId: o.orderId,
      productName: o.productName,
      country: o.country,
      price: o.productPrice,
      status: o.status,
      createdAt: o.createdAt,
      // 只有已完成订单才显示 eSIM 信息
      esim: o.status === 'fulfilled' ? {
        iccid: o.esimData?.iccid || o.esimInfo?.iccid,
        qrCode: o.esimData?.qrCode || o.esimInfo?.qrCode,
        activationCode: o.esimData?.activationCode || o.esimInfo?.activationCode,
      } : null,
    }));

  // 查找该邮箱的订阅（续费计划）
  const userSubs = subscriptions.byEmail(email).map(s => ({
    id: s.id,
    productName: s.productName,
    expiryDate: s.expiryDate,
    renewalEnabled: s.renewalEnabled,
    status: s.status,
  }));

  return res.json({
    success: true,
    data: {
      orders: userOrders,
      subscriptions: userSubs,
      total: userOrders.length,
    }
  });
};
