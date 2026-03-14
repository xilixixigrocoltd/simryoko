/**
 * Products API v2 - 使用清洗后数据，支持高级筛选
 * 
 * GET /api/v2/products
 *   ?country=JP          - 按国家筛选
 *   ?type=local|regional|global  - 按类型筛选
 *   ?minData=1024        - 最小流量(MB)
 *   ?maxData=10240       - 最大流量(MB)
 *   ?minDays=7           - 最小有效期
 *   ?maxDays=30          - 最大有效期
 *   ?minPrice=5          - 最低价格
 *   ?maxPrice=50         - 最高价格
 *   ?search=japan        - 搜索名称
 *   ?sort=price|data|days|popular  - 排序
 *   ?order=asc|desc      - 排序方向
 *   ?page=1&pageSize=20  - 分页
 * 
 * GET /api/v2/products/:id  - 单品详情
 * GET /api/v2/products/stats - 产品统计
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { setCors, applyRateLimit } = require('./_ratelimit');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CLEANED_FILE = path.join(DATA_DIR, 'products-cleaned.json');
const FULL_FILE = path.join(DATA_DIR, 'products-full.json');

// In-memory cache
let productsCache = null;
let cacheLoadedAt = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function loadProducts() {
  const now = Date.now();
  if (productsCache && (now - cacheLoadedAt) < CACHE_TTL) {
    return productsCache;
  }
  
  try {
    // Prefer cleaned data
    const file = fs.existsSync(CLEANED_FILE) ? CLEANED_FILE : FULL_FILE;
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    productsCache = raw.products || [];
    cacheLoadedAt = now;
    console.log(`[products-v2] Loaded ${productsCache.length} products from ${path.basename(file)}`);
    return productsCache;
  } catch (err) {
    console.error('[products-v2] Failed to load products:', err.message);
    return productsCache || [];
  }
}

function formatProduct(p) {
  return {
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    type: p.type,
    price: parseFloat(p.price),
    dataSize: p.dataSize || null,
    validDays: p.validDays || null,
    countries: (p.countries || []).map(c => ({ code: c.code, name: c.name })),
    operator: p.thirdPartyData?.operatorTitle || p.operator || '',
    stock: p.stock || 0,
    soldCount: p.soldCount || 0,
    isHot: p.isHot || false,
    isRecommend: p.isRecommend || false,
    image: p.image || '',
    status: p.status || 'active',
    description: p.description || '',
    descriptionEn: p.descriptionEn || '',
  };
}

// Middleware
router.use((req, res, next) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 120, 60000)) return;
  next();
});

// GET /stats - 产品统计
router.get('/stats', (req, res) => {
  const products = loadProducts();
  
  const typeCount = {};
  const countrySet = new Set();
  let minPrice = Infinity, maxPrice = 0;
  let minData = Infinity, maxData = 0;
  
  for (const p of products) {
    const t = p.type || 'unknown';
    typeCount[t] = (typeCount[t] || 0) + 1;
    
    const price = parseFloat(p.price);
    if (price > 0) {
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    }
    if (p.dataSize) {
      minData = Math.min(minData, p.dataSize);
      maxData = Math.max(maxData, p.dataSize);
    }
    for (const c of (p.countries || [])) {
      countrySet.add(c.code);
    }
  }
  
  res.setHeader('Cache-Control', 'public, s-maxage=3600');
  res.json({
    success: true,
    data: {
      total: products.length,
      byType: typeCount,
      countries: countrySet.size,
      priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
      dataRange: { minMB: minData === Infinity ? 0 : minData, maxMB: maxData },
    }
  });
});

// GET /:id - 单品详情
router.get('/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
  const products = loadProducts();
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  res.setHeader('Cache-Control', 'public, s-maxage=600');
  res.json({ success: true, data: formatProduct(product) });
});

// GET / - 产品列表 + 筛选
router.get('/', (req, res) => {
  let products = loadProducts();
  
  const {
    country, type, search,
    minData, maxData, minDays, maxDays, minPrice, maxPrice,
    sort = 'popular', order = 'desc',
  } = req.query;
  
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize) || 20));
  
  // Filter: country
  if (country) {
    const code = country.toUpperCase();
    products = products.filter(p => 
      (p.countries || []).some(c => c.code === code)
    );
  }
  
  // Filter: type
  if (type && ['local', 'regional', 'global'].includes(type)) {
    products = products.filter(p => p.type === type);
  }
  
  // Filter: search
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      (p.name || '').toLowerCase().includes(q) ||
      (p.nameEn || '').toLowerCase().includes(q) ||
      (p.countries || []).some(c => (c.name || '').toLowerCase().includes(q))
    );
  }
  
  // Filter: data range (MB)
  if (minData) products = products.filter(p => p.dataSize >= parseInt(minData));
  if (maxData) products = products.filter(p => p.dataSize <= parseInt(maxData));
  
  // Filter: days range
  if (minDays) products = products.filter(p => p.validDays >= parseInt(minDays));
  if (maxDays) products = products.filter(p => p.validDays <= parseInt(maxDays));
  
  // Filter: price range
  if (minPrice) products = products.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
  if (maxPrice) products = products.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
  
  // Sort
  const dir = order === 'asc' ? 1 : -1;
  switch (sort) {
    case 'price':
      products.sort((a, b) => dir * (parseFloat(a.price) - parseFloat(b.price)));
      break;
    case 'data':
      products.sort((a, b) => dir * ((a.dataSize || 0) - (b.dataSize || 0)));
      break;
    case 'days':
      products.sort((a, b) => dir * ((a.validDays || 0) - (b.validDays || 0)));
      break;
    case 'popular':
    default:
      products.sort((a, b) => dir * ((b.soldCount || 0) - (a.soldCount || 0)));
      break;
  }
  
  // Paginate
  const total = products.length;
  const start = (page - 1) * pageSize;
  const list = products.slice(start, start + pageSize).map(formatProduct);
  
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  res.json({
    success: true,
    data: {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  });
});

module.exports = router;
