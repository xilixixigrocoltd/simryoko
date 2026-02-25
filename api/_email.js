// 邮件发送模块 — SimRyoko
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

function getFlagEmoji(countryCode) {
  if (!countryCode) return '🌍';
  const map = {
    JP:'🇯🇵',KR:'🇰🇷',TW:'🇹🇼',TH:'🇹🇭',MY:'🇲🇾',SG:'🇸🇬',HK:'🇭🇰',
    CN:'🇨🇳',ID:'🇮🇩',PH:'🇵🇭',VN:'🇻🇳',IN:'🇮🇳',MM:'🇲🇲',KH:'🇰🇭',
    DE:'🇩🇪',FR:'🇫🇷',GB:'🇬🇧',IT:'🇮🇹',ES:'🇪🇸',NL:'🇳🇱',AT:'🇦🇹',
    CH:'🇨🇭',PT:'🇵🇹',SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',PL:'🇵🇱',GR:'🇬🇷',
    US:'🇺🇸',CA:'🇨🇦',AU:'🇦🇺',NZ:'🇳🇿',AE:'🇦🇪',SA:'🇸🇦',TR:'🇹🇷',
    EU:'🇪🇺',INT:'🌐'
  };
  return map[countryCode.toUpperCase()] || '🌍';
}

// ──────────────────────────────────────────────────────────────────────────────
// 1. eSIM 交付邮件（大幅升级）
// ──────────────────────────────────────────────────────────────────────────────
async function sendEsimEmail({ to, productName, qrCodeUrl, iccid, activationCode, country, carrier }) {
  const flag = getFlagEmoji(country);
  // 从 productName 提取运营商（"Moshi Moshi - 1 GB - 7 days" → "Moshi Moshi"）
  const carrierName = carrier || (productName ? productName.split(' - ')[0] : 'Local Network');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#f0f4ff; margin:0; padding:20px 0; }
    .wrap { max-width:600px; margin:0 auto; }

    /* Header */
    .header { background:linear-gradient(135deg,#5A4FE8 0%,#9333EA 100%); padding:40px 32px; text-align:center; border-radius:20px 20px 0 0; }
    .header h1 { color:#fff; margin:0; font-size:26px; font-weight:800; }
    .header p { color:rgba(255,255,255,.8); margin:8px 0 0; font-size:15px; }

    /* Body */
    .body { background:#fff; padding:36px 32px; }

    /* Product badge */
    .product-card { background:linear-gradient(135deg,#f0f4ff,#e8eaff); border-radius:16px; padding:24px; text-align:center; margin-bottom:28px; border:1px solid #dde3ff; }
    .product-card .flag { font-size:52px; margin-bottom:8px; }
    .product-card .pname { font-size:20px; font-weight:700; color:#1a1a2e; }
    .product-card .carrier-tag { display:inline-block; background:#fff; color:#5A4FE8; border:1px solid #c4bdff; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:600; margin-top:8px; }

    /* Guarantee badge */
    .guarantee { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px 18px; margin-bottom:24px; display:flex; align-items:center; gap:12px; }
    .guarantee-icon { font-size:24px; flex-shrink:0; }
    .guarantee-text { font-size:13px; color:#166534; line-height:1.5; }
    .guarantee-text strong { display:block; font-size:14px; margin-bottom:2px; }

    /* QR */
    .qr-section { text-align:center; margin:24px 0; }
    .qr-section img { width:180px; height:180px; border:4px solid #5A4FE8; border-radius:16px; padding:8px; background:#fff; }
    .qr-label { margin-top:10px; font-size:13px; color:#777; }

    /* Details */
    .details { background:#f9fafb; border-radius:12px; padding:20px; margin:20px 0; }
    .details h3 { margin:0 0 14px; color:#333; font-size:15px; }
    .detail-row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid #eee; }
    .detail-row:last-child { border-bottom:none; }
    .detail-label { color:#888; font-size:13px; }
    .detail-value { color:#1a1a2e; font-weight:600; font-size:13px; word-break:break-all; max-width:62%; text-align:right; }

    /* Install steps */
    .steps { margin:28px 0; }
    .steps h3 { color:#1a1a2e; font-size:16px; font-weight:700; margin-bottom:18px; }

    /* Device toggle */
    .device-tabs { display:flex; gap:8px; margin-bottom:18px; }
    .device-tab { flex:1; padding:10px; border-radius:10px; text-align:center; font-size:13px; font-weight:600; cursor:pointer; }
    .ios-tab { background:#000; color:#fff; }
    .android-tab { background:#3DDC84; color:#fff; }

    /* Step rows */
    .step { display:flex; gap:14px; margin-bottom:14px; align-items:flex-start; }
    .step-num { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; flex-shrink:0; color:#fff; }
    .step-ios .step-num { background:#000; }
    .step-and .step-num { background:#3DDC84; }
    .step-text { color:#555; font-size:13.5px; line-height:1.6; padding-top:5px; }
    .step-text strong { color:#1a1a2e; }

    /* Tips box */
    .tip-box { background:linear-gradient(135deg,#fff8e1,#fff3cd); border-left:4px solid #f59e0b; border-radius:0 12px 12px 0; padding:14px 16px; margin:20px 0; }
    .tip-box h4 { margin:0 0 8px; color:#92400e; font-size:14px; }
    .tip-box ul { margin:0; padding-left:18px; color:#78350f; font-size:13px; line-height:1.8; }

    /* Warning */
    .warning { background:#fff1f0; border-left:4px solid #ff4d4f; border-radius:0 12px 12px 0; padding:12px 16px; margin:20px 0; font-size:13px; color:#cf1322; }

    /* WhatsApp CTA */
    .wa-box { background:#f0fdf4; border-radius:16px; padding:20px; text-align:center; margin:24px 0; }
    .wa-box p { color:#166534; font-size:14px; margin:0 0 14px; font-weight:500; }
    .wa-btn { display:inline-block; background:#25d366; color:#fff; text-decoration:none; padding:12px 28px; border-radius:12px; font-size:14px; font-weight:700; }

    /* Footer */
    .footer { background:#f9fafb; border-top:1px solid #eee; padding:24px 32px; text-align:center; border-radius:0 0 20px 20px; }
    .footer p { color:#999; font-size:12px; margin:4px 0; }
    .footer a { color:#5A4FE8; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Your eSIM is Ready! 🎉</h1>
    <p>SimRyoko — Instant connectivity, anywhere</p>
  </div>

  <div class="body">
    <!-- Product card -->
    <div class="product-card">
      <div class="flag">${flag}</div>
      <div class="pname">${productName}</div>
      <div class="carrier-tag">📡 ${carrierName} Network</div>
    </div>

    <!-- 7-day guarantee -->
    <div class="guarantee">
      <div class="guarantee-icon">🛡️</div>
      <div class="guarantee-text">
        <strong>7-Day Refund Guarantee</strong>
        If you haven't activated this eSIM, contact us within 7 days for a full refund.
      </div>
    </div>

    <!-- QR Code -->
    ${qrCodeUrl ? `
    <div class="qr-section">
      <img src="${qrCodeUrl}" alt="eSIM QR Code"/>
      <div class="qr-label">📷 Scan to install your eSIM</div>
    </div>` : ''}

    <!-- eSIM Details -->
    <div class="details">
      <h3>📋 eSIM Details</h3>
      ${iccid ? `<div class="detail-row"><span class="detail-label">ICCID</span><span class="detail-value">${iccid}</span></div>` : ''}
      ${activationCode ? `<div class="detail-row"><span class="detail-label">Activation Code</span><span class="detail-value">${activationCode}</span></div>` : ''}
      <div class="detail-row"><span class="detail-label">Network</span><span class="detail-value">${carrierName}</span></div>
      <div class="detail-row"><span class="detail-label">Destination</span><span class="detail-value">${flag} ${country}</span></div>
    </div>

    <!-- Installation steps — iOS -->
    <div class="steps">
      <h3>📱 How to Install — iPhone (iOS)</h3>
      <div class="step step-ios">
        <div class="step-num">1</div>
        <div class="step-text">Go to <strong>Settings → Cellular → Add eSIM</strong></div>
      </div>
      <div class="step step-ios">
        <div class="step-num">2</div>
        <div class="step-text">Tap <strong>"Use QR Code"</strong> → scan the QR above with another device (or use the activation code)</div>
      </div>
      <div class="step step-ios">
        <div class="step-num">3</div>
        <div class="step-text">Label it (e.g. "SimRyoko JP") → leave it <strong>OFF</strong> until you land</div>
      </div>
      <div class="step step-ios">
        <div class="step-num">4</div>
        <div class="step-text">At your destination: go to <strong>Settings → Cellular → SimRyoko</strong> → turn it ON</div>
      </div>
    </div>

    <!-- Installation steps — Android -->
    <div class="steps">
      <h3>📱 How to Install — Android</h3>
      <div class="step step-and">
        <div class="step-num">1</div>
        <div class="step-text">Go to <strong>Settings → Connections → SIM Manager → Add eSIM</strong></div>
      </div>
      <div class="step step-and">
        <div class="step-num">2</div>
        <div class="step-text">Tap <strong>"Scan QR Code"</strong> → scan the QR above (use another device to display it)</div>
      </div>
      <div class="step step-and">
        <div class="step-num">3</div>
        <div class="step-text">Complete the setup — <strong>don't activate yet</strong>, save for your trip</div>
      </div>
      <div class="step step-and">
        <div class="step-num">4</div>
        <div class="step-text">At your destination: enable this eSIM and set it as <strong>mobile data SIM</strong></div>
      </div>
    </div>

    <!-- Pro tips -->
    <div class="tip-box">
      <h4>💡 Pro Tips for Best Connection</h4>
      <ul>
        <li><strong>Airplane mode trick:</strong> After landing, toggle airplane mode ON → wait 5s → OFF. This forces your phone to find the local network immediately.</li>
        <li><strong>Install before you fly</strong> — install the eSIM at home so you're ready to connect the moment you land.</li>
        <li><strong>Data usage:</strong> Open our <a href="https://t.me/Simryokoesimbot" style="color:#92400e;">Telegram Bot</a> to check your remaining data anytime.</li>
      </ul>
    </div>

    <!-- One-time warning -->
    <div class="warning">
      ⚠️ <strong>Important:</strong> This eSIM can only be installed <strong>once</strong>. Save this email. Do not share your QR code — it cannot be re-issued.
    </div>

    <!-- WhatsApp support -->
    <div class="wa-box">
      <p>🙋 Need help with installation? We reply in under 30 minutes.</p>
      <a href="https://wa.me/19402382990?text=Hi%2C%20I%20need%20help%20installing%20my%20SimRyoko%20eSIM%20(${encodeURIComponent(productName)})" class="wa-btn">💬 WhatsApp Us Now</a>
    </div>
  </div>

  <div class="footer">
    <p>📧 <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a> &nbsp;|&nbsp; 💬 <a href="https://wa.me/19402382990">WhatsApp +1 940 238 2990</a></p>
    <p>🤖 Track data usage: <a href="https://t.me/Simryokoesimbot">@Simryokoesimbot</a></p>
    <p style="margin-top:10px;color:#ccc;">SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"SimRyoko eSIM" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `${flag} Your eSIM is Ready — ${productName}`,
    html
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. 等待付款确认邮件（升级版）
// ──────────────────────────────────────────────────────────────────────────────
async function sendPaymentPendingEmail({ to, productName, amount, walletAddress, orderId }) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    * { box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#f0f4ff; margin:0; padding:20px 0; }
    .wrap { max-width:600px; margin:0 auto; }
    .header { background:linear-gradient(135deg,#5A4FE8 0%,#9333EA 100%); padding:36px 32px; text-align:center; border-radius:20px 20px 0 0; }
    .header h1 { color:#fff; margin:0; font-size:24px; font-weight:800; }
    .header p { color:rgba(255,255,255,.8); margin:8px 0 0; font-size:14px; }
    .body { background:#fff; padding:32px; }
    .amount-box { background:linear-gradient(135deg,#f0f4ff,#e8eaff); border-radius:16px; padding:28px; text-align:center; margin:20px 0; border:2px solid #c4bdff; }
    .amount { font-size:42px; font-weight:900; color:#5A4FE8; font-variant-numeric:tabular-nums; }
    .amount-label { color:#777; font-size:13px; margin-top:4px; }
    .network-pill { display:inline-block; background:#ff6b35; color:#fff; padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; margin:16px 0 8px; letter-spacing:.3px; }
    .wallet-box { background:#0f0f23; color:#a8d8ea; padding:16px 18px; border-radius:10px; font-family:monospace; font-size:13px; word-break:break-all; letter-spacing:.3px; margin:8px 0 20px; }
    .copy-note { color:#777; font-size:12px; margin-top:-14px; margin-bottom:20px; }
    .steps { margin:24px 0; }
    .steps h3 { color:#1a1a2e; font-size:15px; font-weight:700; margin-bottom:14px; }
    .step { display:flex; gap:12px; margin-bottom:12px; align-items:flex-start; }
    .step-num { width:26px; height:26px; background:#5A4FE8; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; margin-top:2px; }
    .step-text { font-size:13.5px; color:#555; line-height:1.5; }
    .step-text strong { color:#1a1a2e; }
    .note { background:#fff8e1; border-left:4px solid #f59e0b; border-radius:0 12px 12px 0; padding:14px 16px; font-size:13px; color:#78350f; margin:20px 0; }
    .note ul { margin:8px 0 0; padding-left:18px; line-height:1.9; }
    .timeline { display:flex; justify-content:center; gap:0; margin:24px 0; }
    .tl-step { flex:1; text-align:center; position:relative; }
    .tl-step::after { content:'→'; position:absolute; right:-8px; top:12px; color:#ccc; font-size:16px; }
    .tl-step:last-child::after { display:none; }
    .tl-icon { font-size:22px; }
    .tl-label { font-size:11px; color:#888; margin-top:4px; }
    .wa-box { background:#f0fdf4; border-radius:14px; padding:18px; text-align:center; margin:20px 0; }
    .wa-box p { color:#166534; font-size:13px; margin:0 0 12px; }
    .wa-btn { display:inline-block; background:#25d366; color:#fff; text-decoration:none; padding:11px 26px; border-radius:12px; font-size:14px; font-weight:700; }
    .footer { background:#f9fafb; border-top:1px solid #eee; padding:20px 32px; text-align:center; border-radius:0 0 20px 20px; }
    .footer p { color:#bbb; font-size:12px; margin:4px 0; }
    .footer a { color:#5A4FE8; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>⏳ Payment Pending</h1>
    <p>Order confirmed — please complete your USDT payment</p>
  </div>
  <div class="body">
    <p style="color:#333;font-size:15px;">Hi! Your order for <strong>${productName}</strong> is reserved. Send the exact amount below to receive your eSIM.</p>

    <!-- Amount -->
    <div class="amount-box">
      <div class="amount">${amount} USDT</div>
      <div class="amount-label">Send exactly this amount</div>
    </div>

    <!-- Wallet -->
    <p style="font-weight:600;color:#333;margin-bottom:6px;">Send to this wallet:</p>
    <div class="network-pill">TRON TRC-20 Network Only</div>
    <div class="wallet-box">${walletAddress}</div>
    <p class="copy-note">⚠️ Do not send via ERC-20 or BEP-20 — funds will be lost</p>

    <!-- Timeline -->
    <div class="timeline">
      <div class="tl-step"><div class="tl-icon">💸</div><div class="tl-label">You send USDT</div></div>
      <div class="tl-step"><div class="tl-icon">🔍</div><div class="tl-label">Auto-verified (~5 min)</div></div>
      <div class="tl-step"><div class="tl-icon">📧</div><div class="tl-label">eSIM emailed</div></div>
      <div class="tl-step"><div class="tl-icon">✅</div><div class="tl-label">Ready to use!</div></div>
    </div>

    <!-- Steps -->
    <div class="steps">
      <h3>How to Pay</h3>
      <div class="step"><div class="step-num">1</div><div class="step-text">Open your crypto wallet (Binance, OKX, Trust Wallet, etc.)</div></div>
      <div class="step"><div class="step-num">2</div><div class="step-text">Send <strong>exactly ${amount} USDT</strong> on the <strong>TRC-20 (Tron) network</strong></div></div>
      <div class="step"><div class="step-num">3</div><div class="step-text">Paste the wallet address above — double check before confirming</div></div>
      <div class="step"><div class="step-num">4</div><div class="step-text">Your eSIM will be emailed within <strong>15 minutes</strong> of confirmation</div></div>
    </div>

    <!-- Notes -->
    <div class="note">
      <strong>📝 Important Notes</strong>
      <ul>
        <li>Send <strong>exactly ${amount} USDT</strong> — wrong amounts cannot be auto-matched</li>
        <li>TRC-20 network only (Tron chain)</li>
        <li>Order reference: <strong>${orderId}</strong></li>
        <li>eSIM QR code will be emailed to you within 15 minutes</li>
      </ul>
    </div>

    <!-- WhatsApp support -->
    <div class="wa-box">
      <p>🙋 Paid but haven't received your eSIM? We'll resolve it in under 30 minutes.</p>
      <a href="https://wa.me/19402382990?text=Hi%2C%20I%20sent%20payment%20for%20order%20${encodeURIComponent(orderId)}%20but%20haven't%20received%20my%20eSIM%20yet." class="wa-btn">💬 WhatsApp Support</a>
    </div>
  </div>

  <div class="footer">
    <p>📧 <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a> &nbsp;|&nbsp; 💬 <a href="https://wa.me/19402382990">WhatsApp +1 940 238 2990</a></p>
    <p style="margin-top:8px;color:#ddd;">SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"SimRyoko eSIM" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `⏳ Action Required: Send ${amount} USDT to get your eSIM`,
    html
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. 续费提醒邮件
// ──────────────────────────────────────────────────────────────────────────────
async function sendRenewalReminderEmail({ to, productName, daysLeft, expiryDate, renewUrl, price }) {
  const urgencyColor = daysLeft <= 1 ? '#e53e3e' : daysLeft <= 2 ? '#dd6b20' : '#d69e2e';
  const urgencyText = daysLeft <= 1 ? '🚨 Expiring Tomorrow!' : `⏰ Expiring in ${daysLeft} days`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family:-apple-system,sans-serif; background:#f5f5f5; margin:0; padding:20px 0; }
    .wrap { max-width:600px; margin:0 auto; }
    .header { background:linear-gradient(135deg,#f6d365 0%,#fda085 100%); padding:36px 32px; text-align:center; border-radius:20px 20px 0 0; }
    .header h1 { color:#fff; margin:0; font-size:24px; font-weight:800; }
    .body { background:#fff; padding:32px; border-radius:0 0 20px 20px; }
    .urgency { background:${urgencyColor}; color:#fff; padding:16px; border-radius:12px; text-align:center; font-size:18px; font-weight:700; margin-bottom:20px; }
    .plan-box { background:#f0f4ff; border-radius:12px; padding:20px; margin:16px 0; }
    .plan-name { font-size:17px; font-weight:700; color:#1a1a2e; }
    .expiry { color:#777; font-size:13px; margin-top:4px; }
    .renew-btn { display:block; background:#5A4FE8; color:#fff; text-decoration:none; padding:15px 32px; border-radius:12px; text-align:center; font-size:16px; font-weight:700; margin:24px 0 8px; }
    .price-note { text-align:center; color:#888; font-size:13px; margin-bottom:24px; }
    .footer { text-align:center; padding:20px; background:#f9fafb; font-size:12px; color:#bbb; border-top:1px solid #eee; }
    .footer a { color:#5A4FE8; text-decoration:none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header"><h1>📡 eSIM Renewal Reminder</h1></div>
  <div class="body">
    <div class="urgency">${urgencyText}</div>
    <p style="color:#555;font-size:14px;">Your eSIM plan is expiring soon. Renew now to avoid losing connectivity mid-trip.</p>
    <div class="plan-box">
      <div class="plan-name">📱 ${productName}</div>
      <div class="expiry">Expires: ${new Date(expiryDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
    </div>
    <a href="${renewUrl}" class="renew-btn">🔄 Renew My eSIM Now</a>
    ${price ? `<p class="price-note">Same plan from $${price.toFixed(2)}</p>` : ''}
  </div>
  <div class="footer">
    <p>Questions? <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a> | <a href="https://wa.me/19402382990">WhatsApp +1 940 238 2990</a></p>
    <p style="margin-top:6px;"><a href="${renewUrl}?unsubscribe=1" style="color:#ddd;">Unsubscribe from reminders</a></p>
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"SimRyoko eSIM" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to,
    subject: `${urgencyText} — ${productName}`,
    html
  });
}

// Generic raw email sender
async function sendRawEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || 'SimRyoko'}" <${process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com'}>`,
    to, subject, html
  });
}

module.exports = { sendEsimEmail, sendPaymentPendingEmail, sendRenewalReminderEmail, sendRawEmail };
