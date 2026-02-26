// GET /api/config — 返回前端所需公开配置（安全，无敏感信息）
const { setCors } = require('./_ratelimit');
module.exports = (req, res) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Cache-Control', 'private, no-store');
  return res.json({
    stripePk: process.env.STRIPE_PUBLISHABLE_KEY || '',
    usdtWallet: process.env.USDT_WALLET || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL'
  });
};
// Stripe live mode Wed Feb 25 17:04:53 CST 2026
