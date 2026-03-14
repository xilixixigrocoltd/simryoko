// /api/order-status — 通用订单状态查询
// 前端轮询或用户查询支付状态
const store = require('./_store');
const { applyRateLimit, setCors } = require('./_ratelimit');

async function handleGetStatus(req, res) {
  setCors(req, res, 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 30, 60000)) return;
  
  try {
    const { orderId } = req.method === 'GET' ? req.query : req.body;
    if (!orderId) return res.status(400).json({ error: 'Missing orderId' });
    if (!/^[A-Za-z0-9-]{6,50}$/.test(orderId)) return res.status(400).json({ error: 'Invalid orderId format' });

    const order = await store.getOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 返回精简的订单信息（不暴露敏感数据）
    const status = order.status;
    const isPending = status === 'pending_payment';
    const isFulfilled = status === 'fulfilled';
    const isFailed = status === 'failed';

    // 待付款订单返回支付信息
    let paymentInfo = null;
    if (isPending) {
      paymentInfo = {
        amount: order.paymentAmount,
        walletAddress: order.paymentMethod === 'usdt' ? 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL' : null,
        network: 'TRC-20',
        expiresAt: new Date(new Date(order.createdAt).getTime() + 3600000).toISOString()
      };
    }

    // 已完成订单返回eSIM信息
    let esimInfo = null;
    if (isFulfilled && order.esimData) {
      esimInfo = {
        iccid: order.esimData.iccid || order.esimData.iccid,
        lpaString: order.esimData.lpaString || order.esimData.qrCode || order.esimData.activationCode,
        activationCode: order.esimData.activationCode || order.esimData.activationCode
      };
    }

    // 状态消息
    const statusMessages = {
      pending_payment: 'Awaiting payment. Please complete your payment.',
      paid: 'Payment confirmed. Processing your order...',
      processing: 'Order is being processed. eSIM will be delivered soon.',
      fulfilled: 'Order completed! eSIM has been sent to your email.',
      failed: 'Order failed. Please contact support.',
      underpaid: 'Payment amount insufficient. Please contact support.',
      pending_fulfillment: 'Payment confirmed. Manual processing required.',
      paid_pending_fulfillment: 'Payment confirmed. eSIM will be delivered within 30 minutes.'
    };

    return res.json({
      success: true,
      orderId: order.orderId,
      status,
      message: statusMessages[status] || `Order status: ${status}`,
      productName: order.productName,
      email: order.email, // 邮箱用于确认
      ...(paymentInfo && { payment: paymentInfo }),
      ...(esimInfo && { esim: esimInfo }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  } catch (err) {
    console.error('[order-status]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = handleGetStatus;