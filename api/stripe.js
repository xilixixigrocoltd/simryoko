// /api/stripe — 合并 intent + confirm，通过路径路由
// /api/stripe/intent → intent
// /api/stripe/confirm → confirm
const StripeLib = require('stripe');
const store = require('./_store');
const { getProductById, placeOrderWithEsim } = require('./_agent');
const { sendEsimEmail } = require('./_email');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyOrderFulfilled, notifyError } = require('./_notify');

// ── intent ──────────────────────────────────────────────────────────────────
async function handleIntent(req, res) {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 5, 60000)) return;
  try {
    const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);
    const { productId, email } = req.body;
    if (!productId || !email) return res.status(400).json({ error: 'Missing productId or email' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const product = await getProductById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const order = store.createOrder({
      productId: product.id, productName: product.nameEn || product.name,
      productPrice: parseFloat(product.price), email,
      country: product.countries?.[0]?.code || 'INT', paymentMethod: 'card'
    });

    const amountCents = Math.max(50, Math.round(parseFloat(product.price) * 100));
    const intent = await stripe.paymentIntents.create({
      amount: amountCents, currency: 'usd', receipt_email: email,
      metadata: { orderId: order.orderId, productId: String(product.id), email },
      description: `SimRyoko eSIM — ${order.productName}`
    });

    return res.json({ success: true, clientSecret: intent.client_secret, orderId: order.orderId, amount: product.price });
  } catch (err) {
    console.error('[stripe/intent]', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

// ── confirm ──────────────────────────────────────────────────────────────────
async function handleConfirm(req, res) {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return;
  try {
    const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId, orderId } = req.body;
    if (!paymentIntentId || !orderId) return res.status(400).json({ error: 'Missing fields' });

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') return res.status(400).json({ error: `Payment not succeeded: ${intent.status}` });
    if (intent.metadata.orderId !== orderId) return res.status(400).json({ error: 'Order ID mismatch' });

    // 从 store 获取订单；若 /tmp 因冷启动丢失，从 Stripe metadata 重建
    let order = store.getOrder(orderId);
    let recovered = false;
    if (!order) {
      const { productId: metaPid, email: metaEmail } = intent.metadata;
      const product = await getProductById(parseInt(metaPid));
      if (!product) {
        await notifyError('stripe/confirm', `Order ${orderId} not in store and product ${metaPid} not found`).catch(() => {});
        return res.status(404).json({ error: 'Order not found. Please contact support with your payment ID.' });
      }
      order = { orderId, productId: parseInt(metaPid), productName: product.nameEn || product.name,
        productPrice: parseFloat(product.price), email: metaEmail,
        country: product.countries?.[0]?.code || 'INT', paymentIntentId, status: 'paid' };
      recovered = true;
    }
    if (order.status === 'fulfilled') return res.json({ success: true, status: 'fulfilled', message: 'eSIM already sent to your email' });

    if (!recovered) store.updateOrder(orderId, { status: 'paid', paymentIntentId });
    try {
      if (!recovered) store.updateOrder(orderId, { status: 'processing' });
      const orderResult = await placeOrderWithEsim(order.productId, 1);
      if (!orderResult.success) {
        if (!recovered) store.updateOrder(orderId, { status: 'failed', note: orderResult.message });
        await notifyError('stripe/confirm-b2b', `Order ${orderId}: ${orderResult.message}`).catch(() => {});
        return res.json({ success: true, status: 'pending_fulfillment', message: 'Payment confirmed! eSIM will be delivered within 30 minutes.' });
      }
      const esimData = extractEsim(orderResult);
      if (!recovered) store.updateOrder(orderId, { status: 'fulfilled', esimData });
      await sendEsimEmail({ to: order.email, productName: order.productName, qrCodeUrl: esimData.qrCodeUrl, iccid: esimData.iccid, activationCode: esimData.activationCode, country: order.country });
      await notifyOrderFulfilled(order, esimData).catch(() => {});
      return res.json({ success: true, status: 'fulfilled', message: 'eSIM sent to your email!' });
    } catch (e) {
      if (!recovered) store.updateOrder(orderId, { status: 'pending_fulfillment', note: e.message });
      await notifyError('stripe/confirm', e.message).catch(() => {});
      return res.json({ success: true, status: 'pending_fulfillment', message: 'Payment confirmed! eSIM will be delivered within 30 minutes.' });
    }
  } catch (err) {
    console.error('[stripe/confirm]', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

function extractEsim(r) {
  const d = r.data || r;
  // B2B 订单详情：esimData.sims[0] 包含完整数据
  const sim = d.esimData?.sims?.[0] || {};
  return {
    qrCodeUrl:      sim.qrCodeUrl      || d.esimQrCode       || '',
    qrCode:         sim.qrCode         || d.esimQrCode        || '',
    iccid:          sim.iccid          || d.esimIccid         || '',
    activationCode: sim.activationCode || d.esimActivationCode || '',
    directAppleUrl: sim.directAppleUrl || '',
  };
}

// ── router ───────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.endsWith('/confirm') || path === '/api/stripe/confirm') return handleConfirm(req, res);
  return handleIntent(req, res);
};
