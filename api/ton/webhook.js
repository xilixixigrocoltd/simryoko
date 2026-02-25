// POST /api/ton/webhook — CryptoPay 支付回调处理
// Webhook 设置: @CryptoBot → My Apps → Your App → Webhooks → Add URL
// URL: https://simryoko.com/api/ton/webhook

const store = require('../_store');
const { verifyWebhookSignature } = require('../_cryptopay');
const { placeOrder } = require('../_agent');
const { sendEsimEmail } = require('../_email');
const { notifyOrderFulfilled, notifyError } = require('../_notify');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // 1. 读取 raw body（用于签名验证）
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['crypto-pay-api-signature'];

    // 2. 验证签名（生产环境必须验证）
    if (signature && process.env.CRYPTOPAY_TOKEN) {
      const valid = verifyWebhookSignature(rawBody, signature);
      if (!valid) {
        console.warn('[ton/webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { update_type, payload } = req.body;

    // 只处理 invoice_paid 事件
    if (update_type !== 'invoice_paid') {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const invoice = payload;
    const { invoice_id, asset, amount, status } = invoice;

    // 3. 解析 orderId（来自 createInvoice 时写入的 payload 字段）
    let orderId = null;
    try {
      const invoicePayload = JSON.parse(invoice.payload || '{}');
      orderId = invoicePayload.orderId;
    } catch (e) {
      console.error('[ton/webhook] Cannot parse invoice payload');
    }

    if (!orderId) {
      console.error('[ton/webhook] No orderId in invoice payload');
      return res.status(200).json({ ok: true, error: 'No orderId' });
    }

    // 4. 查找订单
    const order = store.getOrder(orderId);
    if (!order) {
      console.error(`[ton/webhook] Order not found: ${orderId}`);
      return res.status(200).json({ ok: true, error: 'Order not found' });
    }

    // 5. 防重复处理
    if (order.status === 'fulfilled') {
      console.log(`[ton/webhook] Order already fulfilled: ${orderId}`);
      return res.status(200).json({ ok: true, skipped: 'already_fulfilled' });
    }

    // 6. 验证金额（允许 1% 误差）
    const expectedAmount = parseFloat(order.paymentAmount);
    const paidAmount = parseFloat(amount);
    if (paidAmount < expectedAmount * 0.99) {
      console.error(`[ton/webhook] Amount mismatch: paid ${paidAmount} ${asset}, expected ${expectedAmount}`);
      store.updateOrder(orderId, { status: 'underpaid', paidAmount, paidAsset: asset });
      return res.status(200).json({ ok: true, error: 'Amount mismatch' });
    }

    // 7. 更新订单为已支付
    store.updateOrder(orderId, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      paidAmount: paidAmount,
      paidAsset: asset,
      cryptoPayInvoiceId: invoice_id,
    });

    // 8. 向 Airalo 代理商 API 下单购买 eSIM
    try {
      const esimResult = await placeOrder(order.productId, 1);

      if (!esimResult?.success && !esimResult?.data) {
        throw new Error(esimResult?.error || 'Agent order failed');
      }

      const esimData = esimResult.data;
      const esimInfo = {
        qrCode: esimData?.esim?.qrCode || esimData?.qrCode,
        activationCode: esimData?.esim?.activationCode || esimData?.activationCode,
        iccid: esimData?.esim?.iccid || esimData?.iccid,
      };

      // 9. 发送 eSIM 到邮件
      await sendEsimEmail({
        to: order.email,
        productName: order.productName,
        esimInfo,
        orderId: order.orderId,
      });

      // 10. 更新订单状态
      store.updateOrder(orderId, {
        status: 'fulfilled',
        fulfilledAt: new Date().toISOString(),
        esimInfo,
      });

      notifyOrderFulfilled({ ...order, esimInfo, paymentMethod: `TON/${asset}` }).catch(() => {});

    } catch (fulfillErr) {
      console.error('[ton/webhook] Fulfillment error:', fulfillErr.message);
      store.updateOrder(orderId, { status: 'paid_pending_fulfillment' });
      notifyError(`TON订单履约失败 ${orderId}: ${fulfillErr.message}`).catch(() => {});
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('[ton/webhook] Fatal:', err.message);
    notifyError(`TON Webhook 异常: ${err.message}`).catch(() => {});
    return res.status(200).json({ ok: true }); // 始终 200，避免 CryptoPay 重试
  }
};
