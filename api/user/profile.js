// GET/POST /api/user/profile — 获取或更新用户资料
const { users } = require('../_users');
const { applyRateLimit, setCors } = require('../_ratelimit');

module.exports = async (req, res) => {
  setCors(req, res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 30, 60000)) return;

  // 从查询参数或 body 获取 email（生产环境应使用 JWT）
  const email = (req.method === 'GET'
    ? req.query.email
    : req.body?.email
  )?.toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  if (req.method === 'GET') {
    // 获取或自动创建用户资料
    const user = users.upsert(email);
    return res.json({ success: true, data: sanitize(user) });
  }

  if (req.method === 'POST') {
    const { telegramId, language, autoRenew, usageAlerts, pushSubscription } = req.body;
    const updates = {};
    if (telegramId !== undefined) updates.telegramId = telegramId;
    if (language !== undefined) updates.language = language;
    if (autoRenew !== undefined) updates.autoRenew = !!autoRenew;
    if (usageAlerts !== undefined) updates.usageAlerts = !!usageAlerts;
    if (pushSubscription !== undefined) updates.pushSubscription = pushSubscription;

    const user = users.upsert(email, updates);
    return res.json({ success: true, data: sanitize(user) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

function sanitize(u) {
  const { pushSubscription, ...safe } = u; // 不返回 push 订阅详情
  return safe;
}
