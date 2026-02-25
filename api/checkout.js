// /api/checkout — 合并 checkout + payment/verify
// POST /api/checkout       → 创建 USDT 订单
// GET/POST /api/payment/verify → 检查 USDT 链上付款并自动发货
const store = require('./_store');
const { sendPaymentPendingEmail, sendEsimEmail } = require('./_email');
const { getProductById, placeOrder, getBalance } = require('./_agent');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyNewOrder, notifyOrderFulfilled, notifyLowBalance } = require('./_notify');
const axios = require('axios');

const USDT_WALLET   = process.env.USDT_WALLET || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL';
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const TRON_API      = 'https://api.trongrid.io';

// ── checkout ──────────────────────────────────────────────────────────────────
async function handleCheckout(req, res) {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return;
  try {
    const { productId, email, paymentMethod = 'usdt' } = req.body;
    if (!productId || !email) return res.status(400).json({ error: 'Missing productId or email' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    const product = await getProductById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const order = store.createOrder({
      productId: product.id, productName: product.nameEn || product.name,
      productPrice: parseFloat(product.price), email,
      country: product.countries?.[0]?.code || 'INT'
    });

    notifyNewOrder({ ...order, paymentMethod: 'usdt' }).catch(() => {});

    try {
      await sendPaymentPendingEmail({ to: email, productName: order.productName, amount: order.paymentAmount, walletAddress: USDT_WALLET, orderId: order.orderId });
    } catch (e) { console.error('[checkout] email error:', e.message); }

    return res.json({ success: true, data: { orderId: order.orderId, productName: order.productName, paymentAmount: order.paymentAmount, walletAddress: USDT_WALLET, network: 'TRC-20', expiresIn: 3600, message: 'Payment instructions sent to your email' } });
  } catch (err) {
    console.error('[checkout]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── payment/verify ────────────────────────────────────────────────────────────
async function handleVerify(req, res) {
  setCors(req, res, 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 20, 60000)) return;
  try {
    const { orderId } = req.method === 'GET' ? req.query : req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });
    if (!/^[A-Za-z0-9-]{6,40}$/.test(orderId)) return res.status(400).json({ error: 'Invalid orderId format' });

    const order = store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'fulfilled') return res.json({ success: true, status: 'fulfilled', message: 'eSIM has been sent to your email' });
    if (order.status === 'failed')    return res.json({ success: false, status: 'failed', message: 'Order failed. Please contact support.' });

    const paid = await checkTronPayment(order.paymentAmount, order.createdAt);
    if (!paid) return res.json({ success: true, status: 'pending_payment', message: 'Payment not detected yet. Please ensure you sent the correct amount via TRC-20.' });

    store.updateOrder(orderId, { status: 'paid', txHash: paid.txHash });

    const balance = await getBalance();
    if (balance < order.productPrice) {
      store.updateOrder(orderId, { status: 'pending_fulfillment', note: 'Insufficient agent balance' });
      notifyLowBalance && notifyLowBalance(balance).catch(() => {});
      return res.json({ success: true, status: 'paid', message: 'Payment confirmed! Your eSIM will be delivered within 30 minutes.' });
    }

    await fulfillOrder(orderId, order);
    return res.json({ success: true, status: 'fulfilled', message: 'eSIM has been sent to your email!' });
  } catch (err) {
    console.error('[verify]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkTronPayment(expectedAmount, afterTimestamp) {
  try {
    const minTs = new Date(afterTimestamp).getTime();
    const url = `${TRON_API}/v1/accounts/${USDT_WALLET}/transactions/trc20?limit=50&contract_address=${USDT_CONTRACT}`;
    const { data } = await axios.get(url, { headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY || '' } });
    if (!data.data) return null;
    for (const tx of data.data) {
      if (tx.to.toLowerCase() !== USDT_WALLET.toLowerCase()) continue;
      if (tx.block_timestamp < minTs) continue;
      const txAmount = parseFloat(tx.value) / 1e6;
      if (Math.abs(txAmount - expectedAmount) < 0.005) return { txHash: tx.transaction_id, amount: txAmount };
    }
    return null;
  } catch (err) { console.error('[checkTronPayment]', err.message); return null; }
}

async function fulfillOrder(orderId, order) {
  try {
    store.updateOrder(orderId, { status: 'processing' });
    const orderResult = await placeOrder(order.productId, 1);
    if (!orderResult.success) { store.updateOrder(orderId, { status: 'failed', note: orderResult.message }); return; }
    const d = orderResult.data || orderResult;
    const esimData = { qrCodeUrl: d.qrCodeUrl || d.qrCode || d.lpa || '', qrCode: d.qrCode || '', iccid: d.iccid || d.simIccid || '', activationCode: d.activationCode || d.lpa || '' };
    store.updateOrder(orderId, { status: 'fulfilled', esimData });
    await sendEsimEmail({ to: order.email, productName: order.productName, qrCodeUrl: esimData.qrCodeUrl, iccid: esimData.iccid, activationCode: esimData.activationCode, country: order.country });
    await notifyOrderFulfilled(order, esimData).catch(() => {});
  } catch (err) { store.updateOrder(orderId, { status: 'failed', note: err.message }); throw err; }
}

// ── router ────────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.includes('/verify') || path.includes('/payment')) return handleVerify(req, res);
  return handleCheckout(req, res);
};
