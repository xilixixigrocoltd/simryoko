// /api/referral — 推荐返利系统
// GET  /api/referral?email=xxx          → 获取/创建推荐码
// GET  /api/referral/stats?code=xxx     → 查询推荐统计
// POST /api/referral/payout             → 管理员标记已打款（需 x-cron-secret）
const store = require('./_store');
const { setCors, applyRateLimit } = require('./_ratelimit');
const { notifyAdmin } = require('./_notify');

const CRON_SECRET     = process.env.CRON_SECRET || 'SimRyoko-cron-2026';
const COMMISSION_RATE = 0.10;  // 10%
const PAYOUT_MIN      = 10;    // 最低起付 $10
const BASE_URL        = 'https://simryoko.com';

module.exports = async (req, res) => {
  setCors(req, res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 20, 60000)) return;

  const path = (req.url || '').split('?')[0];

  // ── GET /api/referral?email=xxx — 获取/创建推荐码 ──────────────────────────
  if (req.method === 'GET' && !path.includes('/stats') && !path.includes('/payout')) {
    const email = req.query.email?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    try {
      const ref = await store.getOrCreateReferral(email);
      return res.json({
        success: true,
        data: {
          code:          ref.code,
          referralLink:  `${BASE_URL}/shop.html?ref=${ref.code}`,
          totalEarnings: ref.totalEarnings,
          pendingPayout: ref.pendingPayout,
          paidOut:       ref.paidOut,
          count:         ref.count,
          commission:    `${(COMMISSION_RATE * 100).toFixed(0)}%`,
          minPayout:     `$${PAYOUT_MIN}`,
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── GET /api/referral/stats?code=xxx — 公开统计 ────────────────────────────
  if (req.method === 'GET' && path.includes('/stats')) {
    const code = req.query.code?.toUpperCase();
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Valid 6-char code required' });
    try {
      const ref = await store.getReferral(code);
      if (!ref) return res.status(404).json({ error: 'Referral code not found' });
      return res.json({
        success: true,
        data: {
          code:          ref.code,
          referralLink:  `${BASE_URL}/shop.html?ref=${ref.code}`,
          totalEarnings: ref.totalEarnings,
          pendingPayout: ref.pendingPayout,
          paidOut:       ref.paidOut,
          count:         ref.count,
          commission:    `${(COMMISSION_RATE * 100).toFixed(0)}%`,
          minPayout:     `$${PAYOUT_MIN}`,
          // 不暴露邮箱
        }
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST /api/referral/payout — 管理员标记已打款 ───────────────────────────
  if (req.method === 'POST' && path.includes('/payout')) {
    const secret = req.headers['x-cron-secret'];
    if (secret !== CRON_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    const { code, amount } = req.body || {};
    if (!code || !amount) return res.status(400).json({ error: 'Missing code or amount' });
    try {
      const ref = await store.markReferralPaid(code.toUpperCase(), parseFloat(amount));
      if (!ref) return res.status(404).json({ error: 'Referral code not found' });
      await notifyAdmin(
        `💸 <b>返利已打款</b>\n\n` +
        `推荐码: <code>${ref.code}</code>\n` +
        `打款金额: $${amount}\n` +
        `累计打款: $${ref.paidOut}\n` +
        `剩余待付: $${ref.pendingPayout}`
      );
      return res.json({ success: true, data: ref });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Not found' });
};
