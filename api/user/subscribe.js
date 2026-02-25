// POST /api/user/subscribe — 创建/更新自动续费订阅
// PATCH /api/user/subscribe — 暂停/取消订阅
const { subscriptions, users } = require('../_users');
const { applyRateLimit, setCors } = require('../_ratelimit');
const { notifyNewOrder } = require('../_notify');

module.exports = async (req, res) => {
  setCors(req, res, 'POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 10, 60000)) return;

  if (req.method === 'POST') {
    // 创建新订阅
    const { email, productId, productName, price, iccid, expiryDate, paymentMethod } = req.body;

    if (!email || !productId || !expiryDate) {
      return res.status(400).json({ error: 'Missing email, productId, or expiryDate' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    // 确保日期格式正确
    if (isNaN(new Date(expiryDate).getTime())) {
      return res.status(400).json({ error: 'Invalid expiryDate (use ISO format: YYYY-MM-DD)' });
    }

    // 创建或确认用户存在
    users.upsert(email, { autoRenew: true });

    const sub = subscriptions.create({
      email,
      productId,
      productName,
      price: parseFloat(price) || 0,
      iccid,
      expiryDate,
      paymentMethod: paymentMethod || 'usdt',
    });

    // 通知管理员
    notifyNewOrder({
      orderId: sub.id,
      productName: sub.productName,
      email: sub.email,
      paymentMethod: `auto-renew/${sub.paymentMethod}`,
    }).catch(() => {});

    return res.json({ success: true, data: sub });
  }

  if (req.method === 'PATCH') {
    // 更新订阅状态（暂停/取消/重新开启）
    const { id, action } = req.body;
    if (!id || !action) return res.status(400).json({ error: 'Missing id or action' });

    const sub = subscriptions.get(id);
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    const statusMap = {
      pause: 'paused',
      cancel: 'cancelled',
      resume: 'active',
      enable: 'active',
    };
    const newStatus = statusMap[action];
    if (!newStatus) return res.status(400).json({ error: `Unknown action: ${action}` });

    const updated = subscriptions.update(id, {
      status: newStatus,
      renewalEnabled: newStatus === 'active',
    });
    return res.json({ success: true, data: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
