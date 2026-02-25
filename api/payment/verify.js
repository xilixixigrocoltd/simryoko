// POST /api/payment/verify — 检查 USDT 付款状态，付款确认后自动下单发货
const store = require('../_store');
const { placeOrder, getBalance, apiCall } = require('../_agent');
const { sendEsimEmail } = require('../_email');
const { applyRateLimit, setCors } = require('../_ratelimit');
const axios = require('axios');

const USDT_WALLET = process.env.USDT_WALLET || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL';
// USDT TRC-20 合约地址
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
// TronGrid API（免费额度足够）
const TRON_API = 'https://api.trongrid.io';

module.exports = async (req, res) => {
  setCors(req, res, 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  // 轮询限速：每IP每分钟最多20次（前端每3秒轮询一次，远低于此阈值）
  if (!applyRateLimit(req, res, 20, 60000)) return;

  try {
    const { orderId } = req.method === 'GET' ? req.query : req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });
    // 基础输入校验：orderId 只允许字母数字和连字符
    if (!/^[A-Za-z0-9-]{6,40}$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid orderId format' });
    }

    const order = store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 如果已经完成，直接返回状态
    if (order.status === 'fulfilled') {
      return res.json({ success: true, status: 'fulfilled', message: 'eSIM has been sent to your email' });
    }
    if (order.status === 'failed') {
      return res.json({ success: false, status: 'failed', message: 'Order failed. Please contact support.' });
    }

    // 查询链上最近 TRC-20 交易
    const paid = await checkTronPayment(order.paymentAmount, order.createdAt);

    if (!paid) {
      return res.json({ success: true, status: 'pending_payment', message: 'Payment not detected yet. Please ensure you sent the correct amount via TRC-20.' });
    }

    // 已检测到付款 → 更新状态 → 执行下单
    store.updateOrder(orderId, { status: 'paid', txHash: paid.txHash });

    // 检查代理账号余额
    const balance = await getBalance();
    if (balance < order.productPrice) {
      // 余额不足，标记为需人工处理，发通知
      store.updateOrder(orderId, { status: 'pending_fulfillment', note: 'Insufficient agent balance' });
      // 这里可以发 Telegram 通知给 gg
      await notifyAdminLowBalance(order, balance);
      return res.json({ success: true, status: 'paid', message: 'Payment confirmed! Your eSIM will be delivered within 30 minutes.' });
    }

    // 余额足够 → 直接下单
    await fulfillOrder(orderId, order);

    return res.json({ success: true, status: 'fulfilled', message: 'eSIM has been sent to your email!' });

  } catch (err) {
    console.error('[verify]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// 查链上交易（TronGrid API）
async function checkTronPayment(expectedAmount, afterTimestamp) {
  try {
    const minTimestamp = new Date(afterTimestamp).getTime();
    // 取最近50条 TRC-20 收款记录
    const url = `${TRON_API}/v1/accounts/${USDT_WALLET}/transactions/trc20?limit=50&contract_address=${USDT_CONTRACT}`;
    const { data } = await axios.get(url, {
      headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' }
    });

    if (!data.data) return null;

    for (const tx of data.data) {
      // 只看收款（to 是我们的钱包）
      if (tx.to.toLowerCase() !== USDT_WALLET.toLowerCase()) continue;
      // 时间在订单创建后
      if (tx.block_timestamp < minTimestamp) continue;
      // 金额匹配（USDT 精度 6位小数）
      const txAmount = parseFloat(tx.value) / 1e6;
      if (Math.abs(txAmount - expectedAmount) < 0.005) {
        return { txHash: tx.transaction_id, amount: txAmount };
      }
    }
    return null;
  } catch (err) {
    console.error('[checkTronPayment]', err.message);
    return null;
  }
}

// 自动下单 + 发货
async function fulfillOrder(orderId, order) {
  try {
    store.updateOrder(orderId, { status: 'processing' });

    const orderResult = await placeOrder(order.productId, 1);

    if (!orderResult.success) {
      store.updateOrder(orderId, { status: 'failed', note: orderResult.message });
      return;
    }

    // 从订单结果中提取 eSIM 数据
    const esimData = extractEsimData(orderResult);
    store.updateOrder(orderId, { status: 'fulfilled', esimData });

    // 发邮件给客户
    await sendEsimEmail({
      to: order.email,
      productName: order.productName,
      qrCodeUrl: esimData.qrCodeUrl || esimData.qrCode,
      iccid: esimData.iccid,
      activationCode: esimData.activationCode,
      country: order.country
    });

  } catch (err) {
    console.error('[fulfillOrder]', err.message);
    store.updateOrder(orderId, { status: 'failed', note: err.message });
  }
}

// 从订单响应中提取 eSIM 信息
function extractEsimData(orderResult) {
  // 根据实际 API 响应结构解析
  const data = orderResult.data || orderResult;
  return {
    qrCodeUrl: data.qrCodeUrl || data.qrCode || data.lpa || data.activationQrCode || '',
    qrCode: data.qrCode || data.smdpAddress || '',
    iccid: data.iccid || data.simIccid || '',
    activationCode: data.activationCode || data.lpa || data.smdpAddress || ''
  };
}

// 余额不足时通知管理员（可扩展为 Telegram 通知）
async function notifyAdminLowBalance(order, currentBalance) {
  console.warn(`[ADMIN ALERT] Low balance! Order ${order.orderId} needs fulfillment. Current balance: $${currentBalance}, needed: $${order.productPrice}`);
  // TODO: 接入 Telegram Bot 发消息给 gg
}
