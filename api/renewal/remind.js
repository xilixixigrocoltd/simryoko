// POST /api/renewal/remind — 检查即将到期订阅，发送续费提醒
// 由 cron job 每天上午9点触发
const { subscriptions } = require('../_users');
const { sendRenewalReminderEmail } = require('../_email');
const { notifyError } = require('../_notify');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8764732212:AAH7bqyX3Vi6bdP5esZhspLvUDrkURaBaNc';
const ADMIN_ID = process.env.ADMIN_CHAT_ID || '7867683484';

async function sendTelegramMessage(chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
  return res.json();
}

module.exports = async (req, res) => {
  // 安全校验：只允许来自 Vercel Cron 或内部调用
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET || 'simryoko-cron-2026'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const expiring = subscriptions.expiringSoon(3); // 3天内到期
    let sent = 0;
    let skipped = 0;

    for (const sub of expiring) {
      // 已发送提醒的跳过
      if (sub.reminderSent) { skipped++; continue; }

      const daysLeft = Math.max(0, Math.ceil(
        (new Date(sub.expiryDate) - Date.now()) / 86400000
      ));

      // 发送邮件提醒
      try {
        await sendRenewalReminderEmail({
          to: sub.email,
          productName: sub.productName,
          daysLeft,
          expiryDate: sub.expiryDate,
          renewUrl: `https://simryoko.com/shop.html?renew=${sub.id}&email=${encodeURIComponent(sub.email)}`,
          price: sub.price,
        });

        // 标记已发送
        subscriptions.update(sub.id, { reminderSent: true });
        sent++;
      } catch (emailErr) {
        console.error('[renewal/remind] email error:', emailErr.message, sub.email);
        notifyError(`续费提醒邮件发送失败: ${sub.email} — ${emailErr.message}`).catch(() => {});
      }
    }

    // 通知管理员
    if (expiring.length > 0) {
      const msg = `📅 *续费提醒任务完成*\n即将到期: ${expiring.length} 个\n已发送: ${sent}\n已跳过: ${skipped}`;
      await sendTelegramMessage(ADMIN_ID, msg).catch(() => {});
    }

    return res.json({
      success: true,
      data: { total: expiring.length, sent, skipped }
    });

  } catch (err) {
    console.error('[renewal/remind]', err.message);
    notifyError(`续费提醒 cron 异常: ${err.message}`).catch(() => {});
    return res.status(500).json({ error: 'Internal server error' });
  }
};
