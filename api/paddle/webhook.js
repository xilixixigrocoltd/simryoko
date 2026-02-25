// POST /api/paddle/webhook — Paddle 支付成功后自动发货
const crypto = require('crypto');
const store = require('../_store');
const { placeOrder } = require('../_agent');
const { sendEsimEmail } = require('../_email');
const { notifyOrderFulfilled, notifyError } = require('../_notify');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // 验证 Paddle 签名
    const signature = req.headers['paddle-signature'];
    const secret = process.env.PADDLE_WEBHOOK_SECRET;
    if (secret && signature) {
      const [tsPart, h1Part] = signature.split(';');
      const ts = tsPart?.replace('ts=', '');
      const h1 = h1Part?.replace('h1=', '');
      const body = JSON.stringify(req.body);
      const expected = crypto.createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex');
      if (expected !== h1) return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventType = event.event_type;

    // 只处理支付成功事件
    if (eventType !== 'transaction.completed') {
      return res.json({ received: true });
    }

    const tx = event.data;
    const customData = tx.custom_data || {};
    const orderId = customData.orderId;

    if (!orderId) {
      console.warn('[paddle/webhook] No orderId in custom_data');
      return res.json({ received: true });
    }

    const order = store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 防重复
    if (order.status === 'fulfilled') return res.json({ received: true, status: 'already_fulfilled' });

    store.updateOrder(orderId, { status: 'paid', paddleTxId: tx.id });

    // 自动发货
    try {
      store.updateOrder(orderId, { status: 'processing' });
      const orderResult = await placeOrder(order.productId, 1);

      if (!orderResult.success) {
        store.updateOrder(orderId, { status: 'pending_fulfillment', note: orderResult.message });
        return res.json({ received: true });
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

    } catch (fulfillErr) {
      console.error('[paddle/webhook] fulfill error:', fulfillErr.message);
      store.updateOrder(orderId, { status: 'pending_fulfillment', note: fulfillErr.message });
      await notifyError('paddle/webhook', fulfillErr.message).catch(() => {});
    }

    return res.json({ received: true });

  } catch (err) {
    console.error('[paddle/webhook]', err.message);
    return res.status(500).json({ error: 'Internal error' });
  }
};

function extractEsimData(orderResult) {
  const data = orderResult.data || orderResult;
  return {
    qrCodeUrl: data.qrCodeUrl || data.qrCode || data.lpa || '',
    qrCode: data.qrCode || data.smdpAddress || '',
    iccid: data.iccid || data.simIccid || '',
    activationCode: data.activationCode || data.lpa || data.smdpAddress || ''
  };
}
