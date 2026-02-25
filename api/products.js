// GET /api/products?country=JP&page=1&pageSize=20
const { getProducts } = require('./_agent');
const { applyRateLimit, setCors } = require('./_ratelimit');

// 热门目的地（前端展示用）
const POPULAR_DESTINATIONS = [
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'DE', name: 'Europe (28)', flag: '🇪🇺' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
];

module.exports = async (req, res) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 60, 60000)) return; // 60 req/min per IP

  try {
    const { country, page = 1, pageSize = 50, search } = req.query;

    // 如果只请求目的地列表
    if (req.query.destinations === '1') {
      return res.json({ success: true, data: POPULAR_DESTINATIONS });
    }

    const result = await getProducts({ country, page: parseInt(page), pageSize: parseInt(pageSize), search });
    
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // 格式化产品数据，对外只暴露零售价（price），不暴露代理价（agentPrice）
    const products = result.data.list.map(p => ({
      id: p.id,
      name: p.name,
      nameEn: p.nameEn,
      type: p.type,
      price: parseFloat(p.price),         // 零售价（客户付的钱）
      countries: p.countries || [],
      description: p.description || p.descriptionEn || ''
    }));

    return res.json({
      success: true,
      data: {
        list: products,
        total: result.data.total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (err) {
    console.error('[products]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
