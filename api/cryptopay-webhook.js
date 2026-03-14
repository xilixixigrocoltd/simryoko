// /api/cryptopay-webhook — CryptoPay (CryptoBot) 支付回调
// 文档: https://help.crypt.bot/crypto-pay-api#webhooks
// 与 /api/ton/webhook 功能相同，提供独立端点

const store = require('./_store');
const { verifyWebhookSignature } = require('./_cryptopay');
const { getProductById, placeOrderWithEsim } = require('./_agent');
const { sendEsimEmail, sendPaymentPendingEmail } = require('./_email');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyNewOrder, notifyOrderFulfilled, notifyError } = require('./_notify');

// 复用 ton.js 的处理逻辑
async function handleWebhook(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['crypto-pay-api-signature'];
    
    // 验证签名（如果配置了 CRYPTOPAY_TOKEN）
    if (signature && process.env.CRYPTOPAY_TOKEN) {
      if (!verifyWebhookSignature(rawBody, signature)) {
        console.warn('[cryptopay-webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { update_type, payload: invoice } = req.body;
    
    // 只处理 invoice_paid 事件
    if (update_type !== 'invoice_paid') {
      return res.json({ ok: true, skipped: true });
    }

    // 解析订单ID
    let orderId = null;
    try { 
      orderId = JSON.parse(invoice.payload || '{}').orderId; 
    } catch (e) {}
    
    if (!orderId) {
      return res.json({ ok: true, error: 'No orderId in payload' });
    }

    // 获取订单
    const order = await store.getOrder(orderId);
    if (!order) {
      return res.json({ ok: true, error: 'Order not found' });
    }
    
    if (order.status === 'fulfilled') {
      return res.json({ ok: true, skipped: 'already_fulfilled' });
    }

    // 验证支付金额
    const expectedAmount = parseFloat(order.paymentAmount);
    const paidAmount = parseFloat(invoice.amount);
    
    if (paidAmount < expectedAmount * 0.99) {
      await store.updateOrder(orderId, { 
        status: 'underpaid', 
        paidAmount, 
        paidAsset: invoice.asset 
      });
      return res.json({ ok: true, error: 'Amount mismatch' });
    }

    // 更新为已付款
    await store.updateOrder(orderId, { 
      status: 'paid', 
      paidAt: new Date().toISOString(), 
      paidAmount, 
      paidAsset: invoice.asset, 
      cryptoPayInvoiceId: invoice.invoice_id 
    });

    // 调用代理商API下单
    try {
      const esimResult = await placeOrderWithEsim(order.productId, 1);
      
      if (!esimResult?.success) {
        throw new Error(esimResult?.message || 'Agent order failed');
      }
      
      const d = esimResult.data || {};
      const sim = d.esimData?.sims?.[0] || {};
      
      // 提取 eSIM 数据
      const rawQrUrl = sim.qrcode || d.esimQrCode || '';
      const rawActivation = sim.matching_id || d.esimActivationCode || '';
      const iccid = sim.iccid || d.esimIccid || '';
      const lpaString = rawQrUrl || rawActivation;
      
      const esimInfo = { 
        lpaString, 
        activationCode: rawActivation, 
        iccid 
      };

      // 发送 eSIM 邮件
      await sendEsimEmail({ 
        to: order.email, 
        productName: order.productName, 
        lpaString, 
        iccid, 
        activationCode: rawActivation, 
        country: order.country 
      });

      // 更新订单状态为已完成
      await store.updateOrder(orderId, { 
        status: 'fulfilled', 
        fulfilledAt: new Date().toISOString(), 
        esimInfo 
      });

      // 发送 Telegram 通知
      await notifyOrderFulfilled({ 
        ...order, 
        esimInfo, 
        paymentMethod: `CryptoPay/${invoice.asset}` 
      }).catch(() => {});

      // 推荐返利
      if (order.refCode) {
        const credit = await store.creditReferral(order.refCode, orderId, order.productPrice).catch(() => null);
        if (credit?.reachedThreshold) {
          await notifyAdmin(`🎁 <b>推荐返利待打款</b>\n推荐码: <code>${order.refCode}</code>\n待付金额: $${credit.ref.pendingPayout}\n邮箱: ${credit.ref.email}`).catch(() => {});
        }
      }

      return res.json({ ok: true, orderId, status: 'fulfilled' });
      
    } catch (e) {
      // 履约失败，更新状态但不强退
      await store.updateOrder(orderId, { status: 'paid_pending_fulfillment' });
      await notifyError(`CryptoPay订单履约失败 ${orderId}: ${e.message}`).catch(() => {});
      return res.json({ ok: true, orderId, status: 'pending_fulfillment' });
    }

  } catch (err) {
    console.error('[cryptopay-webhook]', err.message);
    await notifyError(`CryptoPay Webhook异常: ${err.message}`).catch(() => {});
    // 返回200避免重复回调
    return res.status(200).json({ ok: true, error: 'Internal error' });
  }
}

module.exports = handleWebhook;