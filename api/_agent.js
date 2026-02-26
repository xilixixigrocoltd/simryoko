// 代理商 API 封装模块（Token 持久化 + 限速保护）
const axios = require('axios');

const API_BASE       = process.env.API_BASE       || 'https://ciuh32wky.xigrocoltd.com/api';
const AGENT_USERNAME = process.env.AGENT_USERNAME || 'lx001';
const AGENT_PASSWORD = process.env.AGENT_PASSWORD || '123123';

// ── JWT Token 管理 ────────────────────────────────────────────────────────────
// 优先使用环境变量中的长效 Token（在 Vercel Dashboard 设置 B2B_TOKEN）
// 这样 serverless 冷启动不会每次都触发登录，避免 429 限速

let cachedToken = process.env.B2B_TOKEN || null;
let tokenExpiry = cachedToken ? (Date.now() + 28 * 24 * 60 * 60 * 1000) : 0;

// 登录锁：防止并发请求同时触发登录
let loginPromise = null;
let lastLoginAttempt = 0;
const LOGIN_COOLDOWN = 60 * 1000; // 60秒内只允许登录一次

async function doLogin() {
  const now = Date.now();
  if (now - lastLoginAttempt < LOGIN_COOLDOWN) {
    throw new Error('Login cooldown active — too many attempts');
  }
  lastLoginAttempt = now;
  const res = await axios.post(`${API_BASE}/agent/login`, {
    username: AGENT_USERNAME, password: AGENT_PASSWORD
  }, { timeout: 10000 });
  if (!res.data.success) throw new Error('Agent login failed: ' + res.data.message);
  cachedToken = res.data.data.token;
  tokenExpiry = Date.now() + 28 * 24 * 60 * 60 * 1000;
  console.log('[agent] Login OK, token cached');
  return cachedToken;
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  // 防止并发重复登录
  if (!loginPromise) {
    loginPromise = doLogin().finally(() => { loginPromise = null; });
  }
  return loginPromise;
}

// ── 产品列表缓存（模块级，同实例复用）──────────────────────────────────────────
const productCache = new Map();
const PRODUCT_TTL  = 10 * 60 * 1000; // 10分钟（从5分钟增加到10分钟减少 API 压力）

let allProductsCache  = null;
let allProductsExpiry = 0;
const ALL_PRODUCTS_TTL = 10 * 60 * 1000;

// ── 基础 API 调用（含 401 自动续签）──────────────────────────────────────────
async function apiCall(method, path, data = null, retry = true) {
  const token = await getToken();
  const config = {
    method,
    url: `${API_BASE}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    timeout: 12000
  };
  if (data) config.data = data;
  try {
    const res = await axios(config);
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    // 401 = token 失效，清除缓存并重试一次
    if (status === 401 && retry) {
      console.log('[agent] 401 received, refreshing token...');
      cachedToken = null;
      tokenExpiry = 0;
      return apiCall(method, path, data, false);
    }
    // 429 = 限速，直接抛出
    if (status === 429) {
      throw new Error(`Rate limited by B2B API. Retry after: ${err.response?.headers?.['retry-after'] || '?'}s`);
    }
    throw err;
  }
}

// ── 获取产品列表（带缓存）────────────────────────────────────────────────────
async function getProducts({ country, page = 1, pageSize = 50, search = '' } = {}) {
  const params = new URLSearchParams({ page, pageSize });
  if (country) params.append('country', country);
  if (search)  params.append('search', search);
  const cacheKey = params.toString();

  const cached = productCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) return cached.data;

  const result = await apiCall('get', `/agent/products?${params}`);
  if (result.success) {
    productCache.set(cacheKey, { data: result, expiry: Date.now() + PRODUCT_TTL });
  }
  return result;
}

// ── 按 ID 查找产品────────────────────────────────────────────────────────────
async function getProductById(productId) {
  if (allProductsCache && Date.now() < allProductsExpiry) {
    const found = allProductsCache.find(p => p.id == productId);
    if (found) return found;
  }

  try {
    const res = await apiCall('get', `/agent/products/${productId}`);
    if (res.success && res.data) return res.data;
  } catch (e) {}

  const result = await apiCall('get', `/agent/products?page=1&pageSize=500`);
  if (result.success && result.data?.list) {
    allProductsCache  = result.data.list;
    allProductsExpiry = Date.now() + ALL_PRODUCTS_TTL;
    const found = allProductsCache.find(p => p.id == productId);
    if (found) return found;
  }

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

// ── 余额查询 ──────────────────────────────────────────────────────────────────
async function getBalance() {
  const res = await apiCall('get', '/agent/info');
  return parseFloat(res.data?.balance || 0);
}

// ── 下单 ──────────────────────────────────────────────────────────────────────
async function placeOrder(productId, quantity = 1) {
  return apiCall('post', '/agent/orders', {
    items: [{ id: productId, quantity }]
  });
}

module.exports = { getProducts, getProductById, getBalance, placeOrder, apiCall, getToken };
