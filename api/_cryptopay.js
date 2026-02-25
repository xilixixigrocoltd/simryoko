// CryptoPay API helper (@CryptoBot)
// 文档: https://help.crypt.bot/crypto-pay-api
// 申请 API Token: @CryptoBot → My Apps → Create App

const CRYPTOPAY_TOKEN = process.env.CRYPTOPAY_TOKEN || '';
const BASE_URL = 'https://pay.crypt.bot/api';

/**
 * 调用 CryptoPay API
 */
async function callApi(method, params = {}) {
  const url = `${BASE_URL}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Crypto-Pay-API-Token': CRYPTOPAY_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`CryptoPay error: ${data.error?.name || 'Unknown'} — ${data.error?.code || ''}`);
  }
  return data.result;
}

/**
 * 创建支付发票
 * @param {Object} opts
 * @param {string} opts.asset - 币种: TON, USDT, BTC, ETH...
 * @param {string|number} opts.amount - 金额（字符串，最多9位小数）
 * @param {string} opts.description - 支付说明
 * @param {string} opts.payload - 自定义数据（最多4096字符），用于回调识别订单
 * @param {number} opts.expires_in - 过期秒数（最大3600）
 */
async function createInvoice({ asset = 'TON', amount, description, payload, expires_in = 3600 }) {
  if (!CRYPTOPAY_TOKEN) throw new Error('CRYPTOPAY_TOKEN not configured');

  return callApi('createInvoice', {
    asset,
    amount: String(amount),
    description: description || 'eSIM Purchase — SimRyoko',
    payload: payload || '',
    allow_comments: false,
    allow_anonymous: false,
    expires_in,
  });
}

/**
 * 获取发票信息（查询支付状态）
 * @param {number|string} invoiceId
 */
async function getInvoice(invoiceId) {
  const result = await callApi('getInvoices', {
    invoice_ids: [String(invoiceId)],
  });
  return result.items?.[0] || null;
}

/**
 * 获取账户余额信息
 */
async function getBalance() {
  return callApi('getBalance');
}

/**
 * 验证 Webhook 签名
 * 签名方式: HMAC-SHA256(body_string, SHA256(token))
 */
function verifyWebhookSignature(body, signature) {
  const crypto = require('crypto');
  const secret = crypto.createHash('sha256').update(CRYPTOPAY_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return hmac === signature;
}

module.exports = { createInvoice, getInvoice, getBalance, verifyWebhookSignature };
