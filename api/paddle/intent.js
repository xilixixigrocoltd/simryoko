// POST /api/paddle/intent — 创建 Paddle 交易，返回 transaction ID
const axios = require('axios');
const store = require('../_store');
const { getProducts } = require('../_agent');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { productId, email } = req.body;
    if (!productId || !email) return res.status(400).json({ error: 'Missing fields' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    // 找产品
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
      paymentMethod: 'card_paddle'
    });

    const amountCents = Math.round(parseFloat(product.price) * 100);

    // 创建 Paddle 交易（关联已审核产品 ID，税务合规）
    const PADDLE_PRODUCT_ID = process.env.PADDLE_PRODUCT_ID || 'pro_01kj9na9x31t57npmmsm99vfj9';
    const { data } = await axios.post(
      'https://api.paddle.com/transactions',
      {
        items: [{
          price: {
            description: order.productName,
            name: order.productName,
            unit_price: { amount: String(amountCents), currency_code: 'USD' },
            tax_mode: 'inclusive',
            product_id: PADDLE_PRODUCT_ID
          },
          quantity: 1
        }],
        customer: { email },
        custom_data: { orderId: order.orderId, email }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const txId = data.data?.id;
    if (!txId) throw new Error('No transaction ID from Paddle');

    store.updateOrder(order.orderId, { paddleTxId: txId });

    return res.json({
      success: true,
      transactionId: txId,
      orderId: order.orderId,
      amount: product.price
    });

  } catch (err) {
    console.error('[paddle/intent]', err.response?.data || err.message);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
