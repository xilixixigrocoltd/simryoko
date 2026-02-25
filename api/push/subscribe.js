// POST /api/push/subscribe — 保存用户 Web Push 订阅
// POST /api/push/send — 发送 Push 通知（管理员用）
const { users } = require('../_users');
const { applyRateLimit, setCors } = require('../_ratelimit');

const VAPID_PUBLIC = process.env.VAPID_PUBLIC || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:xilixi@xigrocoltd.com';

module.exports = async (req, res) => {
  setCors(req, res, 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 10, 60000)) return;

  // GET — 返回 VAPID public key（前端订阅时需要）
  if (req.method === 'GET') {
    return res.json({ success: true, vapidPublicKey: VAPID_PUBLIC });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, subscription } = req.body;
  if (!email || !subscription) {
    return res.status(400).json({ error: 'Missing email or subscription' });
  }

  // 保存 push 订阅到用户档案
  users.upsert(email, { pushSubscription: subscription });

  return res.json({ success: true, message: 'Push subscription saved' });
};
