// GET /api/esim/usage?iccid=...&email=... — 查询 eSIM 用量
// 通过 Airalo 代理 API 查询，返回已用/剩余流量和有效期
const { getToken } = require('../_agent');
const { applyRateLimit, setCors } = require('../_ratelimit');

const API_BASE = process.env.API_BASE || 'https://ciuh32wky.xigrocoltd.com/api';

module.exports = async (req, res) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 20, 60000)) return;

  const { iccid, orderId } = req.query;
  if (!iccid && !orderId) {
    return res.status(400).json({ error: 'Provide iccid or orderId' });
  }

  try {
    const token = await getToken();

    // 尝试通过 ICCID 查询用量
    if (iccid) {
      const usageRes = await fetch(`${API_BASE}/agent/esim/usage?iccid=${encodeURIComponent(iccid)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (usageRes.ok) {
        const data = await usageRes.json();
        return res.json({ success: true, data: normalizeUsage(data) });
      }
    }

    // 尝试通过订单ID查询
    if (orderId) {
      const orderRes = await fetch(`${API_BASE}/agent/orders/${encodeURIComponent(orderId)}/usage`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (orderRes.ok) {
        const data = await orderRes.json();
        return res.json({ success: true, data: normalizeUsage(data) });
      }
    }

    // API 不支持用量查询，返回估算提示
    return res.json({
      success: true,
      data: {
        available: false,
        message: 'Usage data not available for this plan. Check your phone settings for real-time usage.',
        tip: 'iOS: Settings → Mobile Data → SIM. Android: Settings → Network → Data Usage',
      }
    });

  } catch (err) {
    console.error('[esim/usage]', err.message);
    return res.json({
      success: true,
      data: {
        available: false,
        message: 'Unable to retrieve usage data. Please check your device settings.',
      }
    });
  }
};

function normalizeUsage(raw) {
  const d = raw?.data || raw;
  const totalMB = d?.total_mb || d?.totalMb || d?.dataTotal;
  const usedMB = d?.used_mb || d?.usedMb || d?.dataUsed;
  const remainingMB = d?.remaining_mb || d?.remainingMb || d?.dataRemaining;

  const total = toMB(totalMB);
  const used = toMB(usedMB);
  const remaining = remainingMB !== undefined ? toMB(remainingMB) : (total - used);

  const expiryDate = d?.expiry_date || d?.expiryDate || d?.validUntil;
  const daysLeft = expiryDate
    ? Math.max(0, Math.ceil((new Date(expiryDate) - Date.now()) / 86400000))
    : null;

  return {
    available: true,
    totalMB: total,
    usedMB: used,
    remainingMB: remaining,
    usedPercent: total > 0 ? Math.round((used / total) * 100) : null,
    expiryDate,
    daysLeft,
    // 用量警告：剩余不足 20% 或不足 200MB
    lowData: remaining !== null && (remaining < 200 || (total > 0 && remaining / total < 0.2)),
    expiringSoon: daysLeft !== null && daysLeft <= 3,
  };
}

function toMB(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  // 尝试解析字符串（"500 MB", "1.5 GB" 等）
  const str = String(val).trim().toUpperCase();
  const num = parseFloat(str);
  if (str.includes('GB')) return num * 1024;
  return num;
}
