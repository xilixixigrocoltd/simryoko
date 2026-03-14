// 持久化订单存储 — Cloudflare Workers KV（REST API）
// 替换原来的 /tmp 临时文件，支持 Vercel serverless 冷启动后数据不丢失
// CF KV 免费额度：100,000 读/天，1,000 写/天，完全够用
const axios = require('axios');

const CF_BASE   = 'https://api.cloudflare.com/client/v4';
const ORDER_TTL = 30 * 24 * 3600; // 订单保留 30 天

// ── 内存缓存（同实例内复用，减少 KV 读次数）──────────────────────────────────
const memCache  = new Map();
const MEM_TTL   = 30 * 1000; // 30 秒内存缓存

// ── CF 配置（必须从环境变量读取）────────────────────────────────────────────
function env() {
  const accountId = process.env.CF_ACCOUNT_ID;
  const namespaceId = process.env.CF_KV_NAMESPACE_ID;
  const email = process.env.CF_API_EMAIL;
  const apiKey = process.env.CF_API_KEY;
  
  if (!accountId || !namespaceId || !email || !apiKey) {
    throw new Error('Cloudflare KV credentials missing in environment variables');
  }
  
  return { accountId, namespaceId, email, apiKey };
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
  // 重试3次，超时延长至12s，写失败不中断主流程
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await axios.put(
        `${valueUrl(key)}?expiration_ttl=${ttl}`,
        JSON.stringify(value),
        { headers: { ...headers(), 'Content-Type': 'text/plain' }, timeout: 12000 }
      );
      return; // 写入成功
    } catch (e) {
      console.error(`[kv] SET error (attempt ${attempt}/${maxRetries}):`, key, e.message);
      if (attempt === maxRetries) {
        // 最终失败：记录但不抛出，避免中断订单主流程
        console.error('[kv] SET permanently failed, continuing without KV persistence:', key);
        return;
      }
      await new Promise(r => setTimeout(r, 800 * attempt)); // 退避重试
    }
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

  // 直接写入完整订单对象（用于 recovered 路径补写 KV）
  async createOrderDirect(orderId, orderData) {
    await kvSet(`order:${orderId}`, { ...orderData, orderId });
    return orderData;
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
  },

  // ── 推荐返利系统 ────────────────────────────────────────────────────────────

  // 根据邮箱生成确定性6位推荐码
  _genCode(email) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
    let code = '';
    for (let i = 0; i < 6; i++) { code += chars[hash % chars.length]; hash = Math.floor(hash / chars.length) || (hash * 7 + 13); }
    return code;
  },

  async getOrCreateReferral(email) {
    const code = store._genCode(email.toLowerCase());
    const existing = await kvGet(`ref:${code}`);
    if (existing) return existing;
    const data = {
      code, email: email.toLowerCase(),
      totalEarnings: 0, pendingPayout: 0, paidOut: 0,
      count: 0, createdAt: new Date().toISOString(),
      referrals: []
    };
    await kvSet(`ref:${code}`, data, 365 * 24 * 3600); // 1年TTL
    return data;
  },

  async getReferral(code) {
    return kvGet(`ref:${code.toUpperCase()}`);
  },

  // 返利积分（履单后调用）
  async creditReferral(code, orderId, purchaseAmount) {
    const COMMISSION_RATE = 0.10; // 10%
    const PAYOUT_THRESHOLD = 10;  // $10 起付
    const ref = await kvGet(`ref:${code.toUpperCase()}`);
    if (!ref) return null;
    const commission = parseFloat((purchaseAmount * COMMISSION_RATE).toFixed(2));
    ref.totalEarnings  = parseFloat((ref.totalEarnings + commission).toFixed(2));
    ref.pendingPayout  = parseFloat((ref.pendingPayout + commission).toFixed(2));
    ref.count         += 1;
    ref.referrals.push({ orderId, purchaseAmount, commission, date: new Date().toISOString() });
    await kvSet(`ref:${ref.code}`, ref, 365 * 24 * 3600);
    return { ref, commission, reachedThreshold: ref.pendingPayout >= PAYOUT_THRESHOLD };
  },

  async markReferralPaid(code, amount) {
    const ref = await kvGet(`ref:${code.toUpperCase()}`);
    if (!ref) return null;
    ref.paidOut       = parseFloat((ref.paidOut + amount).toFixed(2));
    ref.pendingPayout = parseFloat(Math.max(0, ref.pendingPayout - amount).toFixed(2));
    await kvSet(`ref:${ref.code}`, ref, 365 * 24 * 3600);
    return ref;
  }
};

module.exports = store;
