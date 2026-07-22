const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

const ADMIN_RECIPIENTS = ['solution360int@gmail.com', 'tahirarmie@gmail.com'];

if (!process.env.BREVO_API_KEY) {
  console.error('WARNING: BREVO_API_KEY is not set. Inquiry emails will fail.');
}

/* ------------------------------------------------------------------
   Escape anything a visitor typed before it goes into an HTML email.
   Without this, a submitted name containing markup is rendered as
   live HTML in your inbox.
   ------------------------------------------------------------------ */
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function clip(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

/* ------------------------------------------------------------------
   sendEmail now actually reports failure. The previous version
   resolved on ANY response, so a rejected API key looked identical
   to a delivered email.
   ------------------------------------------------------------------ */
function sendEmail(to, subject, html) {
  return new Promise((resolve, reject) => {
    const toArray = Array.isArray(to) ? to.map(e => ({ email: e })) : [{ email: to }];
    const data = JSON.stringify({
      sender: { name: 'Solutions 360', email: 'solution360int@gmail.com' },
      to: toArray,
      subject: subject,
      htmlContent: html
    });

    const req = https.request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      timeout: 15000,
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.statusCode);
        } else {
          reject(new Error(`Brevo responded ${res.statusCode}: ${body.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => { req.destroy(new Error('Brevo request timed out')); });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

/* ------------------------------------------------------------------
   extensions: ['html'] makes /team resolve to public/team.html.
   This covers every page, including any you add later, so the
   individual app.get() page routes are no longer needed.
   ------------------------------------------------------------------ */
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'],
  maxAge: '30d',
  setHeaders: (res, filePath) => {
    // Never cache markup, styles or scripts — otherwise a deploy can
    // sit invisible behind a stale browser cache for days.
    // Images and fonts keep the long cache; they are versioned by name.
    if (/\.(html|css|js|json|webmanifest|xml|txt)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later, or message us on WhatsApp.' }
});

// WhatsApp redirect
app.get('/whatsapp', (req, res) => {
  const msg = clip(req.query.msg, 300) ||
    'Hello! I am interested in studying abroad and would like to know more about your services.';
  res.redirect(`https://wa.me/923144441280?text=${encodeURIComponent(msg)}`);
});

// Inquiry API
app.post('/api/inquiry', inquiryLimiter, async (req, res) => {
  const name    = clip(req.body.name, 120);
  const email   = clip(req.body.email, 160);
  const phone   = clip(req.body.phone, 40);
  const age     = clip(req.body.age, 40);
  const degree  = clip(req.body.degree, 60);
  const field   = clip(req.body.field, 80);
  const country = clip(req.body.country, 80);
  const year    = clip(req.body.year, 20);
  const message = clip(req.body.message, 2000);

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email and phone are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'That email address does not look right.' });
  }

  const row = (label, value, alt) => `
    <tr${alt ? ' style="background:#fff;"' : ''}>
      <td style="padding:10px;color:#5a7a7e;width:140px;font-weight:600;">${label}</td>
      <td style="padding:10px;color:#1a2e31;">${esc(value) || 'N/A'}</td>
    </tr>`;

  const adminHTML = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d8cc;border-radius:8px;overflow:hidden;">
      <div style="background:#1b545d;padding:24px;text-align:center;">
        <h2 style="color:#c8a36f;margin:0;font-size:22px;">New Student Inquiry</h2>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Solutions 360 — Study Abroad Consultancy</p>
      </div>
      <div style="padding:28px;background:#f8f5f0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row('Full Name', name, false)}
          ${row('Email', email, true)}
          ${row('Phone', phone, false)}
          ${row('Age Range', age, true)}
          ${row('Degree Level', degree, false)}
          ${row('Field of Study', field, true)}
          ${row('Preferred Country', country, false)}
          ${row('Target Year', year, true)}
          ${message ? `<tr><td style="padding:10px;color:#5a7a7e;font-weight:600;vertical-align:top;">Message</td><td style="padding:10px;color:#1a2e31;">${esc(message).replace(/\n/g, '<br>')}</td></tr>` : ''}
        </table>
      </div>
      <div style="padding:16px 28px;background:#1b545d;text-align:center;">
        <a href="https://wa.me/923144441280?text=${encodeURIComponent('Hi ' + name)}" style="background:#c8a36f;color:#1b545d;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;">Reply on WhatsApp</a>
      </div>
    </div>`;

  const studentHTML = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d8cc;border-radius:8px;overflow:hidden;">
      <div style="background:#1b545d;padding:32px;text-align:center;">
        <h2 style="color:#c8a36f;margin:0;font-size:26px;">Solutions 360</h2>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Study Abroad Consultancy</p>
      </div>
      <div style="padding:32px;background:#f8f5f0;">
        <h3 style="color:#1b545d;margin:0 0 16px;">Hi ${esc(name)}, we received your inquiry</h3>
        <p style="color:#5a7a7e;font-size:14px;line-height:1.8;">Thank you for reaching out to Solutions 360. Our team will review your details and get back to you within <strong>24 hours</strong>.</p>
        <p style="color:#5a7a7e;font-size:14px;line-height:1.8;">For a quicker response, feel free to reach us directly on WhatsApp.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="https://wa.me/923144441280" style="background:#1b545d;color:#c8a36f;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Chat on WhatsApp</a>
        </div>
        <p style="color:#5a7a7e;font-size:13px;border-top:1px solid #e0d8cc;padding-top:16px;margin-top:8px;">+92 314 444 1280 &nbsp;|&nbsp; Mon&ndash;Sat, 11:00 AM &ndash; 6:00 PM</p>
      </div>
    </div>`;

  /* ----------------------------------------------------------------
     The admin email is the lead. If it fails, say so honestly and
     point the visitor at WhatsApp — never report success for a
     message that was never delivered.
     ---------------------------------------------------------------- */
  try {
    await sendEmail(ADMIN_RECIPIENTS, `New Inquiry from ${name} — Solutions 360`, adminHTML);
  } catch (err) {
    console.error('[inquiry] ADMIN EMAIL FAILED — lead may be lost:', err.message);
    console.error('[inquiry] payload:', JSON.stringify({ name, email, phone, age, degree, field, country, year, message }));
    return res.status(502).json({
      success: false,
      message: 'We could not send that through. Please message us on WhatsApp at +92 314 444 1280 so we do not miss you.'
    });
  }

  // Confirmation to the student is a nicety — never fail the request over it.
  sendEmail(email, 'We received your inquiry — Solutions 360', studentHTML)
    .catch(err => console.error('[inquiry] student confirmation failed:', err.message));

  res.json({ success: true, message: 'Inquiry sent. We will contact you within 24 hours.' });
});

// 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), err => {
    if (err) res.status(404).send('Page not found.');
  });
});

app.listen(PORT, () => console.log(`Solutions 360 running at http://localhost:${PORT}`));
