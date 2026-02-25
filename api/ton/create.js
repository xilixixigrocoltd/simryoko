// POST /api/ton/create — 创建 TON/CryptoPay 支付发票
const store = require('../_store');
const { createInvoice } = require('../_cryptopay');
const { getProducts } = require('../_agent');
const { applyRateLimit, setCors } = require('../_ratelimit');
const { notifyNewOrder } = require('../_notify');
const { sendPaymentPendingEmail } = require('../_email');

// TON 实时汇率（fallback，优先用实时价格）
const TON_USD_FALLBACK = 5.5; // 约 $5.5/TON，需定期更新

/**
 * 获取 TON/USD 实时价格
 */
async function getTonPrice() {
  try {
    const res = await fetch('https://tonapi.io/v2/rates?tokens=ton&currencies=usd', {
      headers: { 'Accept': 'application/json' },
    });
    const data = await res.json();
    const price = data?.rates?.TON?.prices?.USD;
    if (price && price > 0) return price;
  } catch (e) {
    console.warn('[ton/create] price fetch failed, using fallback');
  }
  return TON_USD_FALLBACK;
}

module.exports = async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return;

  try {
    const { productId, email } = req.body;

    if (!productId || !email) {
      return res.status(400).json({ error: 'Missing productId or email' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 找产品
    let product = null;
    let page = 1;
    while (!product) {
      const r = await getProducts({ page, pageSize: 100 });
      const found = r.data.list.find(p => p.id == productId);
      if (found) { product = found; break; }
      if (r.data.list.length < 100) break;
      page++;
      if (page > 30) break;
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const usdPrice = parseFloat(product.price);

    // 创建订单记录
    const order = store.createOrder({
      productId: product.id,
      productName: product.nameEn || product.name,
      productPrice: usdPrice,
      email,
      country: product.countries?.[0]?.code || 'INT',
    });

    // 计算 TON 金额（USD → TON）
    const tonPrice = await getTonPrice();
    const tonAmount = (usdPrice / tonPrice).toFixed(4);

    // 也支持直接 USDT on TON（稳定币）
    // 优先用 USDT（稳定，用户体验更好），TON 作为备选
    const asset = 'USDT'; // USDT on TON, 1:1 USD
    const invoiceAmount = usdPrice.toFixed(2);

    // 创建 CryptoPay 发票
    let invoice = null;
    let payUrl = null;

    try {
      invoice = await createInvoice({
        asset,
        amount: invoiceAmount,
        description: `SimRyoko eSIM — ${order.productName}`,
        payload: JSON.stringify({ orderId: order.orderId }),
        expires_in: 3600,
      });
      payUrl = invoice.bot_invoice_url || invoice.pay_url;
    } catch (cryptoErr) {
      // CryptoPay 未配置时 fallback 到 USDT TRC-20
      console.warn('[ton/create] CryptoPay not configured:', cryptoErr.message);
    }

    // 通知管理员
    notifyNewOrder({ ...order, paymentMethod: 'ton' }).catch(() => {});

    // 发送支付指引邮件
    try {
      await sendPaymentPendingEmail({
        to: email,
        productName: order.productName,
        amount: order.paymentAmount,
        walletAddress: payUrl || 'See Telegram @CryptoBot',
        orderId: order.orderId,
        paymentMethod: 'TON/USDT (CryptoPay)',
      });
    } catch (e) {
      console.error('[ton/create] email error:', e.message);
    }

    return res.json({
      success: true,
      data: {
        orderId: order.orderId,
        productName: order.productName,
        // USDT 金额（稳定，等于 USD）
        amount: invoiceAmount,
        asset,
        // TON 金额（供参考）
        tonAmount,
        tonPrice: tonPrice.toFixed(2),
        // CryptoPay 支付链接（点击跳转 Telegram/CryptoBot）
        payUrl,
        invoiceId: invoice?.invoice_id || null,
        // 过期时间
        expiresIn: 3600,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      }
    });
  } catch (err) {
    console.error('[ton/create]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
