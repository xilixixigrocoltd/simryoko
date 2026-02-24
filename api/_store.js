// 简易订单存储（使用内存 + 文件持久化）
// 生产环境应替换为 Vercel KV / Redis / PostgreSQL
const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join('/tmp', 'esim-orders.json');

function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {}
}

// 生成唯一订单ID
function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${ts}-${rand}`;
}

// 生成唯一支付金额（在零售价基础上加随机分，用于识别支付）
function generatePaymentAmount(basePrice) {
  const cents = Math.floor(Math.random() * 90) + 1; // 1-90 分
  return parseFloat((basePrice + cents / 100).toFixed(2));
}

const store = {
  createOrder({ productId, productName, productPrice, email, country }) {
    const orders = loadStore();
    const orderId = generateOrderId();
    const paymentAmount = generatePaymentAmount(productPrice);
    
    orders[orderId] = {
      orderId,
      productId,
      productName,
      productPrice,
      paymentAmount,
      email,
      country,
      status: 'pending_payment', // pending_payment → paid → fulfilled → failed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      txHash: null,
      esimData: null
    };
    
    saveStore(orders);
    return orders[orderId];
  },

  getOrder(orderId) {
    const orders = loadStore();
    return orders[orderId] || null;
  },

  updateOrder(orderId, updates) {
    const orders = loadStore();
    if (!orders[orderId]) return null;
    orders[orderId] = {
      ...orders[orderId],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveStore(orders);
    return orders[orderId];
  },

  // 查找匹配支付金额的待付款订单
  findByPaymentAmount(amount) {
    const orders = loadStore();
    return Object.values(orders).find(
      o => o.status === 'pending_payment' && Math.abs(o.paymentAmount - amount) < 0.001
    ) || null;
  },

  listOrders(status = null) {
    const orders = loadStore();
    const all = Object.values(orders);
    return status ? all.filter(o => o.status === status) : all;
  }
};

module.exports = store;
