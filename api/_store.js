// 持久化订单存储 — Cloudflare Workers KV（REST API）
// 替换原来的 /tmp 临时文件，支持 Vercel serverless 冷启动后数据不丢失
// CF KV 免费额度：100,000 读/天，1,000 写/天，完全够用
const axios = require('axios');

const CF_BASE   = 'https://api.cloudflare.com/client/v4';
const ORDER_TTL = 30 * 24 * 3600; // 订单保留 30 天

// ── 内存缓存（同实例内复用，减少 KV 读次数）──────────────────────────────────
const memCache  = new Map();
const MEM_TTL   = 30 * 1000; // 30 秒内存缓存

// ── CF 配置（硬编码 fallback，防止 env 丢失时 crash）──────────────────────────
function env() {
  return {
    accountId:   process.env.CF_ACCOUNT_ID    || 'c78c07c8b86f0f642b476f5a93c9947e',
    namespaceId: process.env.CF_KV_NAMESPACE_ID || '47826a9b43c84e6f9a0dbcc6660ecf04',
    email:       process.env.CF_API_EMAIL      || 'xilixi@xigrocoltd.com',
    apiKey:      process.env.CF_API_KEY        || 'd293950de661bbe95c7ca91242cd00476c33e',
  };
}

function headers() {
  const e = env();
  return { 'X-Auth-Email': e.email, 'X-Auth-Key': e.apiKey };
}

function valueUrl(key) {
  const e = env();
  return `${CF_BASE}/accounts/${e.accountId}/storage/kv/namespaces/${e.namespaceId}/values/${encodeURIComponent(key)}`;
}

// ── 基础 KV 操作 ────────────────────────────────────────────────────────────
async function kvGet(key) {
  const cached = memCache.get(key);
  if (cached && Date.now() < cached.expiry) return cached.data;
  try {
    const res = await axios.get(valueUrl(key), { headers: headers(), timeout: 5000, responseType: 'text' });
    const data = JSON.parse(res.data);
    memCache.set(key, { data, expiry: Date.now() + MEM_TTL });
    return data;
  } catch (e) {
    if (e.response?.status === 404) return null;
    console.error('[kv] GET error:', key, e.message);
    return null;
  }
}

async function kvSet(key, value, ttl = ORDER_TTL) {
  memCache.set(key, { data: value, expiry: Date.now() + MEM_TTL });
  try {
    await axios.put(
      `${valueUrl(key)}?expiration_ttl=${ttl}`,
      JSON.stringify(value),
      { headers: { ...headers(), 'Content-Type': 'text/plain' }, timeout: 5000 }
    );
  } catch (e) {
    console.error('[kv] SET error:', key, e.message);
    throw e;
  }
}

// ── 工具函数 ─────────────────────────────────────────────────────────────────
function generateOrderId() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${ts}-${rand}`;
}

function generatePaymentAmount(basePrice) {
  const cents = Math.floor(Math.random() * 90) + 1;
  return parseFloat((basePrice + cents / 100).toFixed(2));
}

// ── 公开 API（全部 async）────────────────────────────────────────────────────
const store = {
  async createOrder({ productId, productName, productPrice, email, country }) {
    const orderId       = generateOrderId();
    const paymentAmount = generatePaymentAmount(productPrice);
    const order = {
      orderId, productId, productName, productPrice, paymentAmount,
      email, country, status: 'pending_payment',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      txHash: null, esimData: null
    };
    await kvSet(`order:${orderId}`, order);
    // 金额索引（用于 USDT 支付匹配）
    await kvSet(`amt:${paymentAmount.toFixed(2)}`, orderId, ORDER_TTL);
    return order;
  },

  async getOrder(orderId) {
    return kvGet(`order:${orderId}`);
  },

  async updateOrder(orderId, updates) {
    const order = await kvGet(`order:${orderId}`);
    if (!order) return null;
    const updated = { ...order, ...updates, updatedAt: new Date().toISOString() };
    await kvSet(`order:${orderId}`, updated);
    return updated;
  },

  async findByPaymentAmount(amount) {
    const key     = `amt:${parseFloat(amount).toFixed(2)}`;
    const orderId = await kvGet(key);
    if (!orderId) return null;
    const order = await kvGet(`order:${orderId}`);
    if (!order || order.status !== 'pending_payment') return null;
    return order;
  },

  async listOrders(status = null) {
    try {
      const e   = env();
      const res = await axios.get(
        `${CF_BASE}/accounts/${e.accountId}/storage/kv/namespaces/${e.namespaceId}/keys?prefix=order%3A&limit=100`,
        { headers: headers(), timeout: 8000 }
      );
      const keys   = (res.data?.result || []).map(k => k.name);
      const orders = await Promise.all(keys.map(k => kvGet(k)));
      const valid  = orders.filter(Boolean);
      return status ? valid.filter(o => o.status === status) : valid;
    } catch (e) {
      console.error('[kv] listOrders error:', e.message);
      return [];
    }
  }
};

module.exports = store;
