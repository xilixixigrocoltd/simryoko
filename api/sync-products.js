/**
 * 产品数据同步服务
 * 每小时同步供应商API数据，更新库存、价格、产品信息
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_BASE = process.env.B2B_API_BASE || 'https://ciuh32wky.xigrocoltd.com/api';
const AGENT_ID = process.env.B2B_AGENT_ID || 'lx001';
const AGENT_PASS = process.env.B2B_AGENT_PASS || '123123';
const CACHE_DIR = path.join(__dirname, '..', 'cache');
const DATA_FILE = path.join(__dirname, '..', 'data', 'products-full.json');

let cachedToken = null;
let tokenExpiry = 0;

// 获取JWT Token
async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const resp = await axios.post(
      `${API_BASE}/agent/login`,
      { username: AGENT_ID, password: AGENT_PASS },
      { timeout: 10000 }
    );

    if (resp.data?.success) {
      cachedToken = resp.data.data.token;
      // Token有效期设为50分钟（预留10分钟缓冲）
      tokenExpiry = now + 50 * 60 * 1000;
      return cachedToken;
    }
  } catch (err) {
    console.error('[Sync] 登录失败:', err.message);
  }
  return null;
}

// API调用
async function apiCall(method, path, retry = true) {
  const token = await getToken();
  if (!token) throw new Error('无法获取Token');

  try {
    const resp = await axios({
      method,
      url: `${API_BASE}${path}`,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000
    });
    return resp.data;
  } catch (err) {
    if (err.response?.status === 401 && retry) {
      cachedToken = null;
      tokenExpiry = 0;
      return apiCall(method, path, false);
    }
    throw err;
  }
}

// 获取所有产品（带重试）
async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;
  const maxPages = 300;
  let consecutiveErrors = 0;
  const maxErrors = 3;

  console.log('[Sync] 开始获取产品数据...');

  while (page <= maxPages && consecutiveErrors < maxErrors) {
    try {
      const result = await apiCall('get', `/agent/products?page=${page}`);

      if (!result?.success) {
        console.error(`[Sync] 第 ${page} 页获取失败: ${result?.message || '未知错误'}`);
        consecutiveErrors++;
        if (consecutiveErrors >= maxErrors) {
          console.error('[Sync] 连续失败次数过多，停止同步');
          break;
        }
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      const products = result.data?.list || [];
      if (products.length === 0) break;

      allProducts.push(...products);
      consecutiveErrors = 0; // 重置错误计数

      if (page % 50 === 0) {
        console.log(`[Sync] 已获取 ${allProducts.length} 款产品...`);
      }

      // 最后一页
      if (products.length < 10) break;

      page++;
      // 短暂延迟避免请求过快
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.error(`[Sync] 第 ${page} 页异常: ${err.message}`);
      consecutiveErrors++;
      if (consecutiveErrors >= maxErrors) break;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`[Sync] 总计获取 ${allProducts.length} 款产品`);
  return allProducts;
}

// 分析产品数据
function analyzeProducts(products) {
  const stats = {
    total: products.length,
    byType: {},
    byCountry: {},
    priceStats: {
      retail: { min: Infinity, max: 0, avg: 0 },
      cost: { min: Infinity, max: 0, avg: 0 }
    },
    stockAlert: [],
    updatedAt: new Date().toISOString()
  };

  let totalRetail = 0;
  let totalCost = 0;
  let priceCount = 0;

  for (const p of products) {
    // 类型统计
    const type = p.type || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // 国家统计
    for (const c of p.countries || []) {
      const code = c.code;
      stats.byCountry[code] = (stats.byCountry[code] || 0) + 1;
    }

    // 价格统计
    const retail = parseFloat(p.price) || 0;
    const cost = parseFloat(p.agentPrice) || 0;

    if (retail > 0 && cost > 0) {
      stats.priceStats.retail.min = Math.min(stats.priceStats.retail.min, retail);
      stats.priceStats.retail.max = Math.max(stats.priceStats.retail.max, retail);
      stats.priceStats.cost.min = Math.min(stats.priceStats.cost.min, cost);
      stats.priceStats.cost.max = Math.max(stats.priceStats.cost.max, cost);
      totalRetail += retail;
      totalCost += cost;
      priceCount++;
    }

    // 库存预警（库存<10）
    if (p.stock < 10) {
      stats.stockAlert.push({
        id: p.id,
        name: p.name,
        stock: p.stock
      });
    }
  }

  if (priceCount > 0) {
    stats.priceStats.retail.avg = totalRetail / priceCount;
    stats.priceStats.cost.avg = totalCost / priceCount;
  }

  return stats;
}

// 保存数据
async function saveData(products, stats) {
  // 确保目录存在
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });

  // 保存完整数据
  const data = {
    metadata: {
      total: products.length,
      updatedAt: stats.updatedAt,
      nextUpdate: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    },
    stats,
    products
  };

  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`[Sync] 数据已保存到 ${DATA_FILE}`);

  // 同时保存按国家分类的缓存
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const byCountry = {};
  for (const p of products) {
    for (const c of p.countries || []) {
      const code = c.code;
      if (!byCountry[code]) byCountry[code] = [];
      byCountry[code].push(p);
    }
  }

  for (const [code, list] of Object.entries(byCountry)) {
    const cacheFile = path.join(CACHE_DIR, `${code}.json`);
    await fs.writeFile(cacheFile, JSON.stringify({
      generatedAt: stats.updatedAt,
      total: list.length,
      list
    }));
  }

  console.log(`[Sync] 已更新 ${Object.keys(byCountry).length} 个国家缓存`);
}

// 发送同步报告
async function sendReport(stats) {
  const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_ID = process.env.ADMIN_CHAT_ID;

  if (!TG_TOKEN || !ADMIN_ID) return;

  const message = `📊 *产品数据同步完成*

总计: ${stats.total} 款产品
更新时间: ${new Date().toLocaleString('zh-CN')}

*价格统计:*
• 零售价: $${stats.priceStats.retail.min.toFixed(2)} - $${stats.priceStats.retail.max.toFixed(2)}
• 成本价: $${stats.priceStats.cost.min.toFixed(2)} - $${stats.priceStats.cost.max.toFixed(2)}

*库存预警:* ${stats.stockAlert.length} 款产品库存<10

*下次同步:* 1小时后`;

  try {
    await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      chat_id: ADMIN_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    console.error('[Sync] 发送报告失败:', err.message);
  }
}

// 主同步函数
async function sync() {
  console.log('\n' + '='.repeat(70));
  console.log(`[Sync] 开始同步 ${new Date().toLocaleString('zh-CN')}`);
  console.log('='.repeat(70));

  try {
    const products = await fetchAllProducts();
    const stats = analyzeProducts(products);
    await saveData(products, stats);
    await sendReport(stats);

    console.log('[Sync] 同步完成');
    return { success: true, stats };
  } catch (err) {
    console.error('[Sync] 同步失败:', err.message);
    return { success: false, error: err.message };
  }
}

// 如果是直接运行
if (require.main === module) {
  sync().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { sync, fetchAllProducts, analyzeProducts };
