// 代理商 API 封装模块（含产品缓存优化）
const axios = require('axios');

const API_BASE        = process.env.API_BASE        || 'https://ciuh32wky.xigrocoltd.com/api';
const AGENT_USERNAME  = process.env.AGENT_USERNAME  || 'lx001';
const AGENT_PASSWORD  = process.env.AGENT_PASSWORD  || '123123';

// ── JWT 缓存 ──────────────────────────────────────────
let cachedToken  = null;
let tokenExpiry  = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await axios.post(`${API_BASE}/agent/login`, {
    username: AGENT_USERNAME, password: AGENT_PASSWORD
  });
  if (!res.data.success) throw new Error('Agent login failed');
  cachedToken  = res.data.data.token;
  tokenExpiry  = Date.now() + 29 * 24 * 60 * 60 * 1000; // 29天
  return cachedToken;
}

// ── 产品列表缓存（模块级，Serverless 实例复用）────────────
// key: query string  value: { data, expiry }
const productCache = new Map();
const PRODUCT_TTL  = 5 * 60 * 1000; // 5分钟

// 完整产品表（按 ID 查找用）
let allProductsCache   = null;
let allProductsExpiry  = 0;
const ALL_PRODUCTS_TTL = 5 * 60 * 1000;

// ── 基础调用 ───────────────────────────────────────────
async function apiCall(method, path, data = null) {
  const token = await getToken();
  const config = { method, url: `${API_BASE}${path}`, headers: { Authorization: `Bearer ${token}` } };
  if (data) config.data = data;
  const res = await axios(config);
  return res.data;
}

// ── 获取产品列表（带缓存）─────────────────────────────
async function getProducts({ country, page = 1, pageSize = 50, search = '' } = {}) {
  const params = new URLSearchParams({ page, pageSize });
  if (country) params.append('country', country);
  if (search)  params.append('search', search);
  const cacheKey = params.toString();

  const cached = productCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return cached.data;

  const result = await apiCall('get', `/agent/products?${params}`);
  productCache.set(cacheKey, { data: result, expiry: Date.now() + PRODUCT_TTL });
  return result;
}

// ── 按 ID 查找产品（先走缓存全量表，避免翻页循环）────────
async function getProductById(productId) {
  // 1. 优先从全量缓存查
  if (allProductsCache && Date.now() < allProductsExpiry) {
    const found = allProductsCache.find(p => p.id == productId);
    if (found) return found;
  }

  // 2. 尝试直接按 ID 查询（若后台支持）
  try {
    const res = await apiCall('get', `/agent/products/${productId}`);
    if (res.success && res.data) return res.data;
  } catch (e) { /* 不支持时回退 */ }

  // 3. 加载全量产品表（最多加载 500 个）
  const result = await apiCall('get', `/agent/products?page=1&pageSize=500`);
  if (result.success && result.data?.list) {
    allProductsCache  = result.data.list;
    allProductsExpiry = Date.now() + ALL_PRODUCTS_TTL;
    const found = allProductsCache.find(p => p.id == productId);
    if (found) return found;
  }

  // 4. 分页翻找（兜底，最多10页）
  for (let page = 2; page <= 10; page++) {
    const r = await apiCall('get', `/agent/products?page=${page}&pageSize=500`);
    if (!r.success) break;
    const items = r.data?.list || [];
    const found = items.find(p => p.id == productId);
    if (found) return found;
    if (items.length < 500) break;
  }

  return null;
}

// ── 余额查询 ───────────────────────────────────────────
async function getBalance() {
  const res = await apiCall('get', '/agent/info');
  return parseFloat(res.data?.balance || 0);
}

// ── 下单 ───────────────────────────────────────────────
async function placeOrder(productId, quantity = 1) {
  return apiCall('post', '/agent/orders', {
    items: [{ id: productId, quantity }]
  });
}

module.exports = { getProducts, getProductById, getBalance, placeOrder, apiCall, getToken };
