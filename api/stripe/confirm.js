// POST /api/stripe/confirm — 确认支付成功后自动发货
const Stripe = require('stripe');
const store = require('../_store');
const { placeOrder } = require('../_agent');
const { sendEsimEmail } = require('../_email');
const { applyRateLimit, setCors } = require('../_ratelimit');
const { notifyOrderFulfilled, notifyError } = require('../_notify');

module.exports = async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ error: 'Missing paymentIntentId or orderId' });
    }

    // 从 Stripe 验证支付状态（不信任前端）
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment not succeeded: ${intent.status}` });
    }

    // 验证 orderId 匹配
    if (intent.metadata.orderId !== orderId) {
      return res.status(400).json({ error: 'Order ID mismatch' });
    }

    const order = store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 防重复处理
    if (order.status === 'fulfilled') {
      return res.json({ success: true, status: 'fulfilled', message: 'eSIM already sent to your email' });
    }

    // 更新订单状态
    store.updateOrder(orderId, { status: 'paid', paymentIntentId });

    // 自动下单发货
    try {
      store.updateOrder(orderId, { status: 'processing' });
      const orderResult = await placeOrder(order.productId, 1);

      if (!orderResult.success) {
        store.updateOrder(orderId, { status: 'failed', note: orderResult.message });
        return res.json({ success: true, status: 'pending_fulfillment', message: 'Payment confirmed! eSIM will be delivered within 30 minutes.' });
      }

      const esimData = extractEsimData(orderResult);
      store.updateOrder(orderId, { status: 'fulfilled', esimData });

      await sendEsimEmail({
        to: order.email,
        productName: order.productName,
        qrCodeUrl: esimData.qrCodeUrl || esimData.qrCode,
        iccid: esimData.iccid,
        activationCode: esimData.activationCode,
        country: order.country
      });

      await notifyOrderFulfilled(order, esimData).catch(() => {});
      return res.json({ success: true, status: 'fulfilled', message: 'eSIM sent to your email!' });

    } catch (fulfillErr) {
      console.error('[stripe/confirm] fulfill error:', fulfillErr.message);
      store.updateOrder(orderId, { status: 'pending_fulfillment', note: fulfillErr.message });
      await notifyError('stripe/confirm', fulfillErr.message).catch(() => {});
      return res.json({ success: true, status: 'pending_fulfillment', message: 'Payment confirmed! eSIM will be delivered within 30 minutes.' });
    }

  } catch (err) {
    console.error('[stripe/confirm]', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

function extractEsimData(orderResult) {
  const data = orderResult.data || orderResult;
  return {
    qrCodeUrl: data.qrCodeUrl || data.qrCode || data.lpa || data.activationQrCode || '',
    qrCode: data.qrCode || data.smdpAddress || '',
    iccid: data.iccid || data.simIccid || '',
    activationCode: data.activationCode || data.lpa || data.smdpAddress || ''
  };
}
