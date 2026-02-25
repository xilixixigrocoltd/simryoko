// GET /api/products?country=JP&page=1&pageSize=50
// B2B 后台每页最多10条，本层并发拉取多页合并返回
const { getProducts: b2bGetProducts } = require('./_agent');
const { applyRateLimit, setCors } = require('./_ratelimit');

const B2B_MAX      = 10;   // B2B 单页上限
const CLIENT_MAX   = 100;  // 对外最大 pageSize（超过按100算）
const PARALLEL_MAX = 10;   // 并发请求上限（10页=100条）

const POPULAR_DESTINATIONS = [
  { code: 'JP', name: 'Japan',        flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',  flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan',       flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand',     flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia',     flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore',    flag: '🇸🇬' },
  { code: 'DE', name: 'Europe (28)',  flag: '🇪🇺' },
  { code: 'US', name: 'USA',          flag: '🇺🇸' },
  { code: 'AU', name: 'Australia',    flag: '🇦🇺' },
  { code: 'HK', name: 'Hong Kong',   flag: '🇭🇰' },
  { code: 'ID', name: 'Indonesia',    flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines',  flag: '🇵🇭' },
];

/**
 * 并发拉取 B2B 多页，合并成一页返回给前端
 * @param {object} opts
 * @param {string} [opts.country]
 * @param {number} opts.page      - 前端请求的页码（基于 clientPageSize）
 * @param {number} opts.pageSize  - 前端请求的每页数量（最大 CLIENT_MAX）
 * @param {string} [opts.search]
 */
async function fetchMergedPage({ country, page, pageSize, search }) {
  const clampedSize  = Math.min(pageSize, CLIENT_MAX);
  const targetStart  = (page - 1) * clampedSize;           // 前端期望起点（0-indexed）

  // 计算对应 B2B 页范围
  const b2pStart = Math.floor(targetStart / B2B_MAX) + 1;
  const pagesNeeded = Math.min(Math.ceil(clampedSize / B2B_MAX), PARALLEL_MAX);

  // 并发拉取
  const requests = Array.from({ length: pagesNeeded }, (_, i) =>
    b2bGetProducts({ country, page: b2pStart + i, pageSize: B2B_MAX, search })
      .catch(() => ({ success: false, data: { list: [] } }))
  );
  const results = await Promise.all(requests);

  let total = 0;
  const allItems = [];
  for (const r of results) {
    if (!r.success) continue;
    total = r.data?.total || total;
    allItems.push(...(r.data?.list || []));
  }

  // 从合并列表中裁剪出前端期望的片段
  const sliceStart = targetStart - (b2pStart - 1) * B2B_MAX;
  const list = allItems.slice(sliceStart, sliceStart + clampedSize);

  return { list, total };
}

/**
 * 格式化产品字段：不暴露代理价，补充流量/天数
 */
function formatProduct(p) {
  return {
    id:           p.id,
    name:         p.name,
    nameEn:       p.nameEn,
    type:         p.type,
    price:        parseFloat(p.price),
    countries:    p.countries || [],
    description:  p.description || p.descriptionEn || '',
    dataAmount:   p.dataSize   || p.dataAmount   || p.data_size   || null,
    validityDays: p.validDays  || p.validityDays || p.validity_days || null,
  };
}

module.exports = async (req, res) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 60, 60000)) return;

  try {
    // 目的地列表（静态，长期缓存）
    if (req.query.destinations === '1') {
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=300');
      return res.json({ success: true, data: POPULAR_DESTINATIONS });
    }

    const country  = req.query.country  || '';
    const search   = req.query.search   || '';
    const page     = Math.max(1, parseInt(req.query.page)     || 1);
    const pageSize = Math.min(CLIENT_MAX, parseInt(req.query.pageSize) || 50);

    const { list, total } = await fetchMergedPage({ country, page, pageSize, search });
    const products = list.map(formatProduct);

    // CDN 缓存5分钟（按 country/page/search 分key）
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return res.json({
      success: true,
      data: { list: products, total, page, pageSize }
    });

  } catch (err) {
    console.error('[products]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
