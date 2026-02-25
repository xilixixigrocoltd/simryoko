// POST /api/checkout — 创建订单，返回支付信息
const store = require('./_store');
const { sendPaymentPendingEmail } = require('./_email');
const { getProducts } = require('./_agent');
const { applyRateLimit, setCors } = require('./_ratelimit');

const USDT_WALLET = process.env.USDT_WALLET || 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL';

module.exports = async (req, res) => {
  setCors(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!applyRateLimit(req, res, 10, 60000)) return; // 10 orders/min per IP

  try {
    const { productId, email, paymentMethod = 'usdt' } = req.body;

    // 基础校验
    if (!productId || !email) {
      return res.status(400).json({ error: 'Missing productId or email' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 通过产品列表找到对应产品
    let product = null;
    let page = 1;
    while (!product) {
      const res2 = await getProducts({ page, pageSize: 100 });
      const found = res2.data.list.find(p => p.id == productId);
      if (found) { product = found; break; }
      if (res2.data.list.length < 100) break;
      page++;
      if (page > 30) break; // 防无限循环
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // 创建订单记录
    const order = store.createOrder({
      productId: product.id,
      productName: product.nameEn || product.name,
      productPrice: parseFloat(product.price),
      email,
      country: product.countries?.[0]?.code || 'INT'
    });

    // 发送支付指引邮件
    try {
      await sendPaymentPendingEmail({
        to: email,
        productName: order.productName,
        amount: order.paymentAmount,
        walletAddress: USDT_WALLET,
        orderId: order.orderId
      });
    } catch (emailErr) {
      console.error('[checkout] email error:', emailErr.message);
      // 邮件失败不阻断流程
    }

    return res.json({
      success: true,
      data: {
        orderId: order.orderId,
        productName: order.productName,
        paymentAmount: order.paymentAmount,
        walletAddress: USDT_WALLET,
        network: 'TRC-20',
        expiresIn: 3600, // 1小时内完成付款
        message: 'Payment instructions sent to your email'
      }
    });
  } catch (err) {
    console.error('[checkout]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
