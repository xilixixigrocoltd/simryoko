// GET /api/config — 返回前端所需公开配置（安全，无敏感信息）
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json({
    stripePk: process.env.STRIPE_PUBLISHABLE_KEY || '',
    paddleToken: process.env.PADDLE_CLIENT_TOKEN || '',
    paddleEnv: process.env.PADDLE_ENV || 'sandbox',
    usdtWallet: process.env.USDT_WALLET || ''
  });
};
// Stripe live mode Wed Feb 25 17:04:53 CST 2026
