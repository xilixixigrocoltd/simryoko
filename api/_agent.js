// 代理商 API 封装模块
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'https://ciuh32wky.xigrocoltd.com/api';
const AGENT_USERNAME = process.env.AGENT_USERNAME || 'lx001';
const AGENT_PASSWORD = process.env.AGENT_PASSWORD || '123123';

let cachedToken = null;
let tokenExpiry = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await axios.post(`${API_BASE}/agent/login`, {
    username: AGENT_USERNAME,
    password: AGENT_PASSWORD
  });

  if (!res.data.success) throw new Error('Agent login failed');

  cachedToken = res.data.data.token;
  // JWT 有效期30天，缓存29天
  tokenExpiry = Date.now() + 29 * 24 * 60 * 60 * 1000;
  return cachedToken;
}

async function apiCall(method, path, data = null) {
  const token = await getToken();
  const config = {
    method,
    url: `${API_BASE}${path}`,
    headers: { Authorization: `Bearer ${token}` }
  };
  if (data) config.data = data;
  const res = await axios(config);
  return res.data;
}

// 获取产品列表（按国家代码过滤）
async function getProducts({ country, page = 1, pageSize = 50, search = '' } = {}) {
  const params = new URLSearchParams({ page, pageSize });
  if (country) params.append('country', country);
  if (search) params.append('search', search);
  return apiCall('get', `/agent/products?${params}`);
}

// 获取代理商余额
async function getBalance() {
  const res = await apiCall('get', '/agent/info');
  return parseFloat(res.data.balance || 0);
}

// 下单
async function placeOrder(productId, quantity = 1) {
  return apiCall('post', '/agent/orders', {
    items: [{ id: productId, quantity }]
  });
}

module.exports = { getProducts, getBalance, placeOrder, apiCall };
