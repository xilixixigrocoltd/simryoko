// POST /api/stripe/intent — 创建 Stripe PaymentIntent，返回 client_secret
const Stripe = require('stripe');
const store = require('../_store');
const { getProducts } = require('../_agent');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { productId, email } = req.body;

    if (!productId || !email) {
      return res.status(400).json({ error: 'Missing productId or email' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // 查找产品
    let product = null, page = 1;
    while (!product) {
      const r = await getProducts({ page, pageSize: 100 });
      product = r.data.list.find(p => p.id == productId);
      if (!product && r.data.list.length < 100) break;
      if (!product) page++;
      if (page > 30) break;
    }
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 创建订单记录
    const order = store.createOrder({
      productId: product.id,
      productName: product.nameEn || product.name,
      productPrice: parseFloat(product.price),
      email,
      country: product.countries?.[0]?.code || 'INT',
      paymentMethod: 'card'
    });

    // 金额转换为美分（Stripe 最低 $0.50）
    const amountCents = Math.max(50, Math.round(parseFloat(product.price) * 100));

    // 创建 PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      receipt_email: email,
      metadata: {
        orderId: order.orderId,
        productId: String(product.id),
        productName: order.productName,
        email
      },
      description: `SimRyoko eSIM — ${order.productName}`
    });

    return res.json({
      success: true,
      clientSecret: intent.client_secret,
      orderId: order.orderId,
      amount: product.price
    });

  } catch (err) {
    console.error('[stripe/intent]', err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
