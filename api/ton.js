// /api/ton — 合并 create + webhook
// /api/ton/create   → 创建 CryptoPay 发票
// /api/ton/webhook  → 支付回调自动发货
const store = require('./_store');
const { createInvoice, verifyWebhookSignature } = require('./_cryptopay');
const { getProducts, placeOrder } = require('./_agent');
const { sendEsimEmail, sendPaymentPendingEmail } = require('./_email');
const { applyRateLimit, setCors } = require('./_ratelimit');
const { notifyNewOrder, notifyOrderFulfilled, notifyError } = require('./_notify');

const TON_USD_FALLBACK = 5.5;

async function getTonPrice() {
  try {
    const res = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd', { headers: { Accept: 'application/json' } });
    const data = await res.json();
    const price = data?.rates?.TON?.prices?.USD;
    if (price && price > 0) return price;
  } catch (e) {}
  return TON_USD_FALLBACK;
}

// ── create ────────────────────────────────────────────────────────────────────
async function handleCreate(req, res) {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return;
  try {
    const { productId, email } = req.body;
    if (!productId || !email) return res.status(400).json({ error: 'Missing productId or email' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    let product = null, page = 1;
    while (!product) {
      const r = await getProducts({ page, pageSize: 100 });
      const found = r.data.list.find(p => p.id == productId);
      if (found) { product = found; break; }
      if (r.data.list.length < 100) break;
      page++; if (page > 30) break;
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const usdPrice = parseFloat(product.price);
    const order = store.createOrder({
      productId: product.id, productName: product.nameEn || product.name,
      productPrice: usdPrice, email, country: product.countries?.[0]?.code || 'INT',
    });

    const tonPrice = await getTonPrice();
    const tonAmount = (usdPrice / tonPrice).toFixed(4);
    const asset = 'USDT';
    const invoiceAmount = usdPrice.toFixed(2);

    let invoice = null, payUrl = null;
    try {
      invoice = await createInvoice({ asset, amount: invoiceAmount, description: `SimRyoko eSIM — ${order.productName}`, payload: JSON.stringify({ orderId: order.orderId }), expires_in: 3600 });
      payUrl = invoice.bot_invoice_url || invoice.pay_url;
    } catch (e) { console.warn('[ton/create] CryptoPay error:', e.message); }

    notifyNewOrder({ ...order, paymentMethod: 'ton' }).catch(() => {});
    try {
      await sendPaymentPendingEmail({ to: email, productName: order.productName, amount: order.paymentAmount, walletAddress: payUrl || 'See Telegram @CryptoBot', orderId: order.orderId, paymentMethod: 'TON/USDT (CryptoPay)' });
    } catch (e) { console.error('[ton/create] email error:', e.message); }

    return res.json({ success: true, data: { orderId: order.orderId, productName: order.productName, amount: invoiceAmount, asset, tonAmount, tonPrice: tonPrice.toFixed(2), payUrl, invoiceId: invoice?.invoice_id || null, expiresIn: 3600, expiresAt: new Date(Date.now() + 3600000).toISOString() } });
  } catch (err) {
    console.error('[ton/create]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── webhook ───────────────────────────────────────────────────────────────────
async function handleWebhook(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['crypto-pay-api-signature'];
    if (signature && process.env.CRYPTOPAY_TOKEN) {
      if (!verifyWebhookSignature(rawBody, signature)) {
        console.warn('[ton/webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { update_type, payload: invoice } = req.body;
    if (update_type !== 'invoice_paid') return res.json({ ok: true, skipped: true });

    let orderId = null;
    try { orderId = JSON.parse(invoice.payload || '{}').orderId; } catch (e) {}
    if (!orderId) return res.json({ ok: true, error: 'No orderId' });

    const order = store.getOrder(orderId);
    if (!order) return res.json({ ok: true, error: 'Order not found' });
    if (order.status === 'fulfilled') return res.json({ ok: true, skipped: 'already_fulfilled' });

    const expectedAmount = parseFloat(order.paymentAmount);
    const paidAmount = parseFloat(invoice.amount);
    if (paidAmount < expectedAmount * 0.99) {
      store.updateOrder(orderId, { status: 'underpaid', paidAmount, paidAsset: invoice.asset });
      return res.json({ ok: true, error: 'Amount mismatch' });
    }

    store.updateOrder(orderId, { status: 'paid', paidAt: new Date().toISOString(), paidAmount, paidAsset: invoice.asset, cryptoPayInvoiceId: invoice.invoice_id });

    try {
      const esimResult = await placeOrder(order.productId, 1);
      if (!esimResult?.success && !esimResult?.data) throw new Error(esimResult?.error || 'Agent order failed');
      const d = esimResult.data;
      const esimInfo = { qrCode: d?.esim?.qrCode || d?.qrCode, activationCode: d?.esim?.activationCode || d?.activationCode, iccid: d?.esim?.iccid || d?.iccid };
      await sendEsimEmail({ to: order.email, productName: order.productName, esimInfo, orderId: order.orderId });
      store.updateOrder(orderId, { status: 'fulfilled', fulfilledAt: new Date().toISOString(), esimInfo });
      notifyOrderFulfilled({ ...order, esimInfo, paymentMethod: `TON/${invoice.asset}` }).catch(() => {});
    } catch (e) {
      store.updateOrder(orderId, { status: 'paid_pending_fulfillment' });
      notifyError(`TON订单履约失败 ${orderId}: ${e.message}`).catch(() => {});
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('[ton/webhook]', err.message);
    notifyError(`TON Webhook异常: ${err.message}`).catch(() => {});
    return res.status(200).json({ ok: true });
  }
}

// ── router ────────────────────────────────────────────────────────────────────
module.exports = (req, res) => {
  const path = (req.url || '').split('?')[0];
  if (path.endsWith('/webhook')) return handleWebhook(req, res);
  return handleCreate(req, res);
};
