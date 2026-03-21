/**
 * SimKaze 核心支付链路测试
 * checkout → stripe-webhook 端到端测试
 */

const request = require('supertest');
const app = require('../api/server'); // Express app

describe('核心支付链路测试', () => {
  
  // 测试数据
  const testOrder = {
    productId: '12345',
    email: 'test@example.com',
    country: 'JP',
    quantity: 1
  };

  describe('POST /api/checkout', () => {
    it('应该成功创建订单并返回Stripe session', async () => {
      const res = await request(app)
        .post('/api/checkout')
        .send(testOrder)
        .expect(200);
      
      expect(res.body).toHaveProperty('sessionId');
      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toContain('stripe.com');
    });

    it('缺少email应该返回400错误', async () => {
      const invalidOrder = { ...testOrder };
      delete invalidOrder.email;
      
      await request(app)
        .post('/api/checkout')
        .send(invalidOrder)
        .expect(400);
    });
  });

  describe('POST /api/stripe-webhook', () => {
    it('应该正确处理支付成功回调', async () => {
      const mockWebhook = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            customer_email: 'test@example.com',
            metadata: { orderId: 'order_123' }
          }
        }
      };

      const res = await request(app)
        .post('/api/stripe-webhook')
        .send(mockWebhook)
        .set('Stripe-Signature', 'mock_sig')
        .expect(200);
      
      expect(res.body.status).toBe('success');
    });

    it('无效签名应该返回400', async () => {
      await request(app)
        .post('/api/stripe-webhook')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/order-status', () => {
    it('应该返回订单状态', async () => {
      const res = await request(app)
        .get('/api/order-status?id=order_123')
        .expect(200);
      
      expect(res.body).toHaveProperty('status');
      expect(['pending', 'paid', 'completed']).toContain(res.body.status);
    });
  });

});

console.log('✅ 核心支付链路测试脚本已生成');
console.log('运行: npm test');
