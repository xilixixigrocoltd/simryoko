// GET /api/products?country=JP&page=1&pageSize=50
// B2B 后台每页最多10条，本层并发拉取多页合并返回
const { getProducts: b2bGetProducts, getProductById } = require('./_agent');
const { applyRateLimit, setCors } = require('./_ratelimit');
const fs   = require('fs');
const path = require('path');

// 静态缓存目录（预生成 JSON，Vercel 部署时随代码发布）
const CACHE_DIR = path.join(__dirname, '..', 'cache');
const CLEANED_FILE = path.join(__dirname, '..', 'data', 'products-cleaned.json');
const DATA_FILE = fs.existsSync(path.join(__dirname, '..', 'data', 'products-cleaned.json'))
  ? path.join(__dirname, '..', 'data', 'products-cleaned.json')
  : path.join(__dirname, '..', 'data', 'products-full.json');

// 读取完整产品数据（由 sync-products.js 每小时同步）
function readFullProducts() {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    // 检查数据新鲜度（2小时内有效）
    if (data.metadata?.updatedAt) {
      const age = Date.now() - new Date(data.metadata.updatedAt).getTime();
      if (age > 2 * 60 * 60 * 1000) return null; // 超过2小时降级到 API
    }
    return data;
  } catch { return null; }
}

// 从完整数据中获取指定国家的产品
function getProductsByCountry(fullData, country) {
  if (!country) return fullData.products;
  return fullData.products.filter(p =>
    p.countries?.some(c => c.code === country)
  );
}

// 兼容旧缓存读取
function readStaticCache(country) {
  // 优先使用完整数据
  const fullData = readFullProducts();
  if (fullData) {
    const products = getProductsByCountry(fullData, country);
    return {
      generatedAt: fullData.metadata.updatedAt,
      total: products.length,
      list: products
    };
  }

  // 降级到旧缓存
  try {
    const key  = country || '_global';
    const file = path.join(CACHE_DIR, `${key}.json`);
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data.generatedAt) {
      const age = Date.now() - new Date(data.generatedAt).getTime();
      if (age > 24 * 60 * 60 * 1000) return null;
    }
    return data;
  } catch { return null; }
}

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
 * 格式化产品字段：支持双价格体系，完整字段
 */
function formatProduct(p) {
  return {
    // 基础信息
    id:           p.id,
    name:         p.name,
    nameEn:       p.nameEn,
    type:         p.type,

    // 双价格体系
    price:        parseFloat(p.price),           // 建议零售价
    agentPrice:   parseFloat(p.agentPrice),      // 代理商成本价（内部使用）

    // 产品描述
    description:  p.description || '',
    descriptionEn: p.descriptionEn || '',
    features:     p.features || [],

    // 流量和有效期（新API字段名）
    dataSize:     p.dataSize || null,          // 流量(MB)
    dataAmount:   p.dataSize || null,          // 兼容旧字段
    validDays:    p.validDays || null,          // 有效期(天)
    validityDays: p.validDays || null,          // 兼容旧字段

    // 覆盖国家
    countries:    p.countries || [],

    // 运营商信息
    operator:     p.thirdPartyData?.operatorTitle || '',
    operatorData: p.thirdPartyData || {},

    // 库存和销量
    stock:        p.stock || 0,
    soldCount:    p.soldCount || 0,

    // 标记
    isHot:        p.isHot || false,
    isRecommend:  p.isRecommend || false,

    // 图片
    image:        p.image || '',

    // 状态
    status:       p.status || 'active',
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

    // 单品查询 ?id=141 — checkout 页面专用，毫秒级响应
    if (req.query.id) {
      const p = await getProductById(req.query.id);
      if (!p) return res.status(404).json({ success: false, error: 'Product not found' });
      res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=120');
      return res.json({ success: true, data: formatProduct(p) });
    }

    const country  = req.query.country  || '';
    const search   = req.query.search   || '';
    const page     = Math.max(1, parseInt(req.query.page)     || 1);
    const pageSize = Math.min(CLIENT_MAX, parseInt(req.query.pageSize) || 50);

    // ① 优先从静态预生成缓存读取（无 B2B API 延迟）
    if (!search) {
      const cached = readStaticCache(country);
      if (cached && cached.list && cached.list.length) {
        const start    = (page - 1) * pageSize;
        const slice    = cached.list.slice(start, start + pageSize);
        const products = slice.map(p => p); // 已 format
        // 静态文件缓存1小时，stale-while-revalidate 8小时
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=28800');
        return res.json({
          success: true,
          data: { list: products, total: cached.total || cached.list.length, page, pageSize, _source: 'cache' }
        });
      }
    }

    // ② 降级：实时调用 B2B API（兜底）
    const { list, total } = await fetchMergedPage({ country, page, pageSize, search });
    const products = list.map(formatProduct);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.json({
      success: true,
      data: { list: products, total, page, pageSize }
    });

  } catch (err) {
    console.error('[products]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── /api/config（合并自 config.js，释放函数槽位）─────────────────────────────
function handleConfig(req, res) {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Cache-Control', 'private, no-store');
  return res.json({
    stripePk:   process.env.STRIPE_PUBLISHABLE_KEY || '',
    usdtWallet: process.env.USDT_WALLET || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL'
  });
}

// ── 路由入口 ────────────────────────────────────────────────────────────────
const _originalHandler = module.exports;
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path === '/api/config' || path.endsWith('/config')) return handleConfig(req, res);
  return _originalHandler(req, res);
};
