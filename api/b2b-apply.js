const { sendRawEmail } = require('./_email');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, company, email, whatsapp, btype, volume, notes } = req.body;

    if (!name || !company || !email || !btype) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Send notification email to admin
    await sendRawEmail({
      to: process.env.FROM_EMAIL || 'xilixi@xigrocoltd.com',
      subject: `🤝 New B2B Partner Application — ${company}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h2 style="color:#6C63FF">New Partner Application</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:24px">
            <tr><td style="padding:10px 0;color:#999;font-size:13px;width:140px">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px">Company</td><td style="padding:10px 0;font-weight:600">${company}</td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px">Email</td><td style="padding:10px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px">WhatsApp</td><td style="padding:10px 0">${whatsapp || 'Not provided'}</td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px">Business Type</td><td style="padding:10px 0">${btype}</td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px">Monthly Volume</td><td style="padding:10px 0">${volume || 'Not specified'}</td></tr>
            <tr><td style="padding:10px 0;color:#999;font-size:13px;vertical-align:top">Notes</td><td style="padding:10px 0">${(notes || 'None').replace(/\n/g, '<br>')}</td></tr>
          </table>
          <div style="margin-top:32px;padding:16px;background:#f0f0ff;border-radius:8px">
            <p style="margin:0;font-size:13px;color:#666">Reply to this email or contact via WhatsApp to approve the application.</p>
          </div>
        </div>
      `
    });

    // Send confirmation to applicant
    await sendRawEmail({
      to: email,
      subject: `Your SimRyoko Partner Application — ${company}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:linear-gradient(135deg,#6C63FF,#764ba2);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px">
            <h1 style="color:white;margin:0;font-size:28px">Application Received! 🎉</h1>
          </div>
          <p>Hi ${name},</p>
          <p>Thank you for applying to the <strong>SimRyoko Partner Program</strong>. We've received your application for <strong>${company}</strong>.</p>
          <p>Our team will review it and get back to you within <strong>24 hours</strong>.</p>
          <p>In the meantime, if you have any questions:</p>
          <ul style="color:#555;line-height:2">
            <li>📧 Email: <a href="mailto:xilixi@xigrocoltd.com">xilixi@xigrocoltd.com</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/19402382990">+1 940-238-2990</a></li>
          </ul>
          <p style="color:#999;font-size:13px;margin-top:32px">SimRyoko — Powered by Xigro Co Limited, Hong Kong</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('B2B apply error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
