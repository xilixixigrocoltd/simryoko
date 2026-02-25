// /api/paddle — 合并 intent + webhook
// /api/paddle/intent → intent
// /api/paddle/webhook → webhook
const crypto = require('crypto');
const axios = require('axios');
const store = require('./_store');
const { getProducts, placeOrder } = require('./_agent');
const { sendEsimEmail } = require('./_email');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyOrderFulfilled, notifyError } = require('./_notify');

// ── intent ───────────────────────────────────────────────────────────────────
async function handleIntent(req, res) {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 5, 60000)) return;
  try {
    const { productId, email } = req.body;
    if (!productId || !email) return res.status(400).json({ error: 'Missing fields' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    let product = null, page = 1;
    while (!product) {
      const r = await getProducts({ page, pageSize: 100 });
      product = r.data.list.find(p => p.id == productId);
      if (!product && r.data.list.length < 100) break;
      if (!product) page++;
      if (page > 30) break;
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const order = store.createOrder({
      productId: product.id, productName: product.nameEn || product.name,
      productPrice: parseFloat(product.price), email,
      country: product.countries?.[0]?.code || 'INT', paymentMethod: 'card_paddle'
    });

    const amountCents = Math.round(parseFloat(product.price) * 100);
    const PADDLE_PRODUCT_ID = process.env.PADDLE_PRODUCT_ID || 'pro_01kj9na9x31t57npmmsm99vfj9';

    const { data } = await axios.post(
      'https://api.paddle.com/transactions',
      { items: [{ price: { description: order.productName, name: order.productName, unit_price: { amount: String(amountCents), currency_code: 'USD' }, tax_mode: 'inclusive', product_id: PADDLE_PRODUCT_ID }, quantity: 1 }], customer: { email }, custom_data: { orderId: order.orderId, email } },
      { headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const txId = data.data?.id;
    if (!txId) throw new Error('No transaction ID from Paddle');
    store.updateOrder(order.orderId, { paddleTxId: txId });

    return res.json({ success: true, transactionId: txId, orderId: order.orderId, amount: product.price });
  } catch (err) {
    console.error('[paddle/intent]', err.response?.data || err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

// ── webhook ──────────────────────────────────────────────────────────────────
async function handleWebhook(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const signature = req.headers['paddle-signature'];
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (secret && signature) {
      const [tsPart, h1Part] = signature.split(';');
      const ts = tsPart?.replace('ts=', ''), h1 = h1Part?.replace('h1=', '');
      const expected = crypto.createHmac('sha256', secret).update(`${ts}:${JSON.stringify(req.body)}`).digest('hex');
      if (expected !== h1) return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event_type, data: tx } = req.body;
    if (event_type !== 'transaction.completed') return res.json({ received: true });

    const orderId = tx.custom_data?.orderId;
    if (!orderId) return res.json({ received: true });

    const order = store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'fulfilled') return res.json({ received: true, status: 'already_fulfilled' });

    store.updateOrder(orderId, { status: 'paid', paddleTxId: tx.id });
    try {
      store.updateOrder(orderId, { status: 'processing' });
      const orderResult = await placeOrder(order.productId, 1);
      if (!orderResult.success) { store.updateOrder(orderId, { status: 'pending_fulfillment', note: orderResult.message }); return res.json({ received: true }); }
      const esimData = extractEsim(orderResult);
      store.updateOrder(orderId, { status: 'fulfilled', esimData });
      await sendEsimEmail({ to: order.email, productName: order.productName, qrCodeUrl: esimData.qrCodeUrl, iccid: esimData.iccid, activationCode: esimData.activationCode, country: order.country });
      await notifyOrderFulfilled(order, esimData).catch(() => {});
    } catch (e) {
      store.updateOrder(orderId, { status: 'pending_fulfillment', note: e.message });
      await notifyError('paddle/webhook', e.message).catch(() => {});
    }
    return res.json({ received: true });
  } catch (err) {
    console.error('[paddle/webhook]', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function extractEsim(r) {
  const d = r.data || r;
  return { qrCodeUrl: d.qrCodeUrl || d.qrCode || d.lpa || '', qrCode: d.qrCode || '', iccid: d.iccid || d.simIccid || '', activationCode: d.activationCode || d.lpa || '' };
}

// ── router ───────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.endsWith('/webhook')) return handleWebhook(req, res);
  return handleIntent(req, res);
};
