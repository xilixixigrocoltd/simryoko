// GET /api/config — 返回前端所需公开配置（安全，无敏感信息）
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json({
    stripePk: process.env.STRIPE_PUBLISHABLE_KEY || '',
    usdtWallet: process.env.USDT_WALLET || ''
  });
};
