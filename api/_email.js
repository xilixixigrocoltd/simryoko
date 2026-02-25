// 邮件发送模块
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.exmail.qq.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'xilixi@xigrocoltd.com',
    pass: process.env.SMTP_PASS || 'x8F7Jr4gn8i9Y95m'
  }
});

// 发送 eSIM 二维码邮件
async function sendEsimEmail({ to, productName, qrCodeUrl, iccid, activationCode, country }) {
  const flagEmoji = getFlagEmoji(country);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px; }
    .body { padding: 40px; }
    .product-badge { background: #f0f4ff; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 32px; }
    .product-badge .flag { font-size: 48px; margin-bottom: 8px; }
    .product-badge .name { font-size: 20px; font-weight: 600; color: #1a1a2e; }
    .qr-section { text-align: center; margin: 32px 0; }
    .qr-section img { width: 200px; height: 200px; border: 3px solid #667eea; border-radius: 12px; padding: 8px; }
    .qr-label { margin-top: 12px; font-size: 14px; color: #666; }
    .details { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .details h3 { margin: 0 0 16px; color: #333; font-size: 16px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666; font-size: 14px; }
    .detail-value { color: #1a1a2e; font-weight: 500; font-size: 14px; word-break: break-all; max-width: 60%; text-align: right; }
    .steps { margin: 32px 0; }
    .steps h3 { color: #333; font-size: 16px; margin-bottom: 16px; }
    .step { display: flex; gap: 16px; margin-bottom: 16px; }
    .step-num { width: 32px; height: 32px; background: #667eea; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .step-text { color: #555; font-size: 14px; line-height: 1.6; padding-top: 6px; }
    .footer { text-align: center; padding: 24px 40px; background: #f9fafb; border-top: 1px solid #eee; }
    .footer p { color: #999; font-size: 13px; margin: 4px 0; }
    .footer a { color: #667eea; text-decoration: none; }
    .warning { background: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; padding: 12px 16px; margin: 20px 0; font-size: 13px; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your eSIM is Ready! 🎉</h1>
      <p>SimRyoko — Stay connected everywhere</p>
    </div>
    <div class="body">
      <div class="product-badge">
        <div class="flag">${flagEmoji}</div>
        <div class="name">${productName}</div>
      </div>

      <div class="qr-section">
        <img src="${qrCodeUrl}" alt="eSIM QR Code" />
        <div class="qr-label">Scan this QR code to install your eSIM</div>
      </div>

      <div class="details">
        <h3>📋 eSIM Details</h3>
        ${iccid ? `<div class="detail-row"><span class="detail-label">ICCID</span><span class="detail-value">${iccid}</span></div>` : ''}
        ${activationCode ? `<div class="detail-row"><span class="detail-label">Activation Code</span><span class="detail-value">${activationCode}</span></div>` : ''}
      </div>

      <div class="steps">
        <h3>📱 How to Install</h3>
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Go to <strong>Settings → Cellular / Mobile Data → Add eSIM</strong> on your phone</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Tap <strong>"Use QR Code"</strong> and scan the QR code above</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Follow the prompts to complete eSIM installation. <strong>Do not activate until you arrive at your destination.</strong></div>
        </div>
      </div>

      <div class="warning">
        ⚠️ <strong>Important:</strong> This eSIM can only be installed once. Store this email safely. Do not share your QR code with others.
      </div>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a></p>
      <p>WhatsApp: <a href="https://wa.me/19402382990">+1 940 238 2990</a></p>
      <p style="margin-top:12px; color:#ccc;">SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'SimRyoko'}" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `Your eSIM is Ready — ${productName} ${flagEmoji}`,
    html
  });
}

// 发送订单确认邮件（等待付款）
async function sendPaymentPendingEmail({ to, productName, amount, walletAddress, orderId }) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .body { padding: 40px; }
    .amount-box { background: #f0f4ff; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .amount { font-size: 36px; font-weight: 800; color: #667eea; }
    .amount-label { color: #666; font-size: 14px; margin-top: 4px; }
    .wallet { background: #1a1a2e; color: #a8d8ea; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 16px 0; }
    .network-badge { display: inline-block; background: #ff6b35; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
    .note { background: #fff8e1; border-left: 4px solid #ffc107; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #555; margin: 20px 0; }
    .footer { text-align: center; padding: 24px 40px; background: #f9fafb; font-size: 13px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏳ Awaiting Payment</h1>
    </div>
    <div class="body">
      <p>Hi! Your order for <strong>${productName}</strong> has been created. Please complete your USDT payment to receive your eSIM.</p>
      
      <div class="amount-box">
        <div class="amount">${amount} USDT</div>
        <div class="amount-label">Exact amount to send</div>
      </div>

      <p><strong>Send to this wallet address:</strong></p>
      <div class="network-badge">TRON (TRC-20) Network</div>
      <div class="wallet">${walletAddress}</div>

      <div class="note">
        ⚠️ <strong>Important:</strong><br>
        • Send <strong>exactly ${amount} USDT</strong> — incorrect amounts cannot be matched automatically<br>
        • Use <strong>TRC-20 network only</strong> (not ERC-20 or BEP-20)<br>
        • Your eSIM will be emailed to you within 15 minutes of payment confirmation<br>
        • Order reference: <strong>${orderId}</strong>
      </div>
    </div>
    <div class="footer">
      <p>Questions? Email <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a> or WhatsApp +1 940 238 2990</p>
      <p>SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"SimRyoko" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `Action Required: Send ${amount} USDT to complete your order`,
    html
  });
}

function getFlagEmoji(countryCode) {
  if (!countryCode) return '🌍';
  const map = {
    JP: '🇯🇵', KR: '🇰🇷', TW: '🇹🇼', TH: '🇹🇭', MY: '🇲🇾', SG: '🇸🇬',
    DE: '🇩🇪', FR: '🇫🇷', GB: '🇬🇧', IT: '🇮🇹', ES: '🇪🇸', NL: '🇳🇱',
    US: '🇺🇸', AU: '🇦🇺', HK: '🇭🇰', CN: '🇨🇳', ID: '🇮🇩', PH: '🇵🇭',
    VN: '🇻🇳', IN: '🇮🇳', EU: '🇪🇺'
  };
  return map[countryCode.toUpperCase()] || '🌍';
}

// 续费提醒邮件
async function sendRenewalReminderEmail({ to, productName, daysLeft, expiryDate, renewUrl, price }) {
  const urgencyColor = daysLeft <= 1 ? '#e53e3e' : daysLeft <= 2 ? '#dd6b20' : '#d69e2e';
  const urgencyText = daysLeft <= 1 ? '🚨 Expiring Tomorrow!' : `⏰ Expiring in ${daysLeft} days`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); padding: 40px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .body { padding: 40px; }
    .urgency { background: ${urgencyColor}; color: white; padding: 16px; border-radius: 12px; text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 24px; }
    .plan-box { background: #f0f4ff; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .plan-name { font-size: 18px; font-weight: 700; color: #1a1a2e; }
    .expiry { color: #666; font-size: 14px; margin-top: 4px; }
    .renew-btn { display: block; background: #667eea; color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; text-align: center; font-size: 16px; font-weight: 700; margin: 24px 0; }
    .price-note { text-align: center; color: #666; font-size: 14px; margin-top: -16px; margin-bottom: 24px; }
    .footer { text-align: center; padding: 24px; background: #f9fafb; font-size: 13px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>📡 eSIM Renewal Reminder</h1></div>
    <div class="body">
      <div class="urgency">${urgencyText}</div>
      <p>Your eSIM plan is about to expire. Renew now to stay connected without interruption.</p>
      <div class="plan-box">
        <div class="plan-name">📱 ${productName}</div>
        <div class="expiry">Expires: ${new Date(expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <a href="${renewUrl}" class="renew-btn">🔄 Renew My eSIM Now</a>
      ${price ? `<p class="price-note">Same plan from $${price.toFixed(2)}</p>` : ''}
      <p style="color:#666;font-size:14px;">Click the button above to quickly renew the same plan and stay connected.</p>
    </div>
    <div class="footer">
      <p>Questions? Contact us at <a href="mailto:xilixi@xigrocoltd.com" style="color:#667eea;">xilixi@xigrocoltd.com</a></p>
      <p>SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
      <p style="margin-top:8px"><a href="${renewUrl}?unsubscribe=1" style="color:#ccc;">Unsubscribe from renewal reminders</a></p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"SimRyoko" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `${urgencyText} — Your ${productName} eSIM`,
    html
  });
}

// Generic raw email sender
async function sendRawEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'SimRyoko'}" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject,
    html
  });
}

module.exports = { sendEsimEmail, sendPaymentPendingEmail, sendRenewalReminderEmail, sendRawEmail };
