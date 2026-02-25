// _notify.js — 通过 Telegram Bot 向管理员发送通知
const https = require('https');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_ID || '7867683484';

/**
 * 发送 Telegram 消息给管理员
 * @param {string} text - 消息内容（支持 HTML 格式）
 */
function notifyAdmin(text) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      chat_id: ADMIN_CHAT_ID,
      text,
      parse_mode: 'HTML'
    });

    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', resolve);
    });

    req.on('error', (e) => {
      console.error('[notify] Telegram error:', e.message);
      resolve(); // 通知失败不影响主流程
    });

    req.write(body);
    req.end();
  });
}

/**
 * 订单下单成功通知
 */
function notifyNewOrder(order) {
  const emoji = order.paymentMethod === 'usdt' ? '₮' : '💳';
  return notifyAdmin(
    `🛒 <b>新订单</b> ${emoji}\n\n` +
    `订单号: <code>${order.orderId}</code>\n` +
    `产品: ${order.productName}\n` +
    `金额: $${order.paymentAmount || order.productPrice}\n` +
    `邮箱: ${order.email}\n` +
    `付款方式: ${order.paymentMethod || 'usdt'}`
  );
}

/**
 * 付款确认 + eSIM发货通知
 */
function notifyOrderFulfilled(order, esimData) {
  return notifyAdmin(
    `✅ <b>eSIM已发货</b>\n\n` +
    `订单号: <code>${order.orderId}</code>\n` +
    `产品: ${order.productName}\n` +
    `客户: ${order.email}\n` +
    `ICCID: <code>${esimData?.iccid || 'N/A'}</code>\n` +
    `💰 净利润约: $${((order.paymentAmount || order.productPrice) * 0.4).toFixed(2)}`
  );
}

/**
 * 付款待处理（余额不足）通知
 */
function notifyLowBalance(order, balance) {
  return notifyAdmin(
    `⚠️ <b>需要人工处理</b>\n\n` +
    `订单 <code>${order.orderId}</code> 已收款但余额不足\n` +
    `当前余额: $${balance}\n` +
    `所需金额: $${order.productPrice}\n` +
    `客户邮箱: ${order.email}\n\n` +
    `请及时充值代理账号并手动完成发货！`
  );
}

/**
 * B2B申请通知
 */
function notifyB2BApply(applicant) {
  return notifyAdmin(
    `🤝 <b>新B2B合作申请</b>\n\n` +
    `姓名: ${applicant.name}\n` +
    `公司: ${applicant.company}\n` +
    `邮箱: ${applicant.email}\n` +
    `WhatsApp: ${applicant.whatsapp || '未填'}\n` +
    `类型: ${applicant.btype}\n` +
    `月销量: ${applicant.volume || '未填'}`
  );
}

/**
 * 系统异常通知
 */
function notifyError(context, error) {
  return notifyAdmin(
    `🚨 <b>系统错误</b>\n\n` +
    `位置: ${context}\n` +
    `错误: ${error}`
  );
}

module.exports = {
  notifyAdmin,
  notifyNewOrder,
  notifyOrderFulfilled,
  notifyLowBalance,
  notifyB2BApply,
  notifyError
};
