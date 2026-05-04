const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

const app = express();
const PORT = process.env.PORT || 8080;
const resend = new Resend(process.env.RESEND_API_KEY);

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/countries', (req, res) => res.sendFile(path.join(__dirname, 'public', 'countries.html')));
app.get('/courses', (req, res) => res.sendFile(path.join(__dirname, 'public', 'courses.html')));
app.get('/success-stories', (req, res) => res.sendFile(path.join(__dirname, 'public', 'success-stories.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// WhatsApp redirect
app.get('/whatsapp', (req, res) => {
  const msg = req.query.msg || 'Hello! I am interested in studying abroad and would like to know more about your services.';
  res.redirect(`https://wa.me/923144441280?text=${encodeURIComponent(msg)}`);
});

// Inquiry API
app.post('/api/inquiry', inquiryLimiter, async (req, res) => {
  const { name, email, phone, age, degree, field, country, year, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email and phone are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  const adminHTML = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d8cc;border-radius:8px;overflow:hidden;">
      <div style="background:#1b545d;padding:24px;text-align:center;">
        <h2 style="color:#c8a36f;margin:0;font-size:22px;">New Student Inquiry</h2>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Solutions 360 — Study Abroad Consultancy</p>
      </div>
      <div style="padding:28px;background:#f8f5f0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:10px;color:#5a7a7e;width:140px;font-weight:600;">Full Name</td><td style="padding:10px;color:#1a2e31;">${name}</td></tr>
          <tr style="background:#fff;"><td style="padding:10px;color:#5a7a7e;font-weight:600;">Email</td><td style="padding:10px;color:#1a2e31;">${email}</td></tr>
          <tr><td style="padding:10px;color:#5a7a7e;font-weight:600;">Phone</td><td style="padding:10px;color:#1a2e31;">${phone}</td></tr>
          <tr style="background:#fff;"><td style="padding:10px;color:#5a7a7e;font-weight:600;">Age Range</td><td style="padding:10px;color:#1a2e31;">${age || 'N/A'}</td></tr>
          <tr><td style="padding:10px;color:#5a7a7e;font-weight:600;">Degree Level</td><td style="padding:10px;color:#1a2e31;">${degree || 'N/A'}</td></tr>
          <tr style="background:#fff;"><td style="padding:10px;color:#5a7a7e;font-weight:600;">Field of Study</td><td style="padding:10px;color:#1a2e31;">${field || 'N/A'}</td></tr>
          <tr><td style="padding:10px;color:#5a7a7e;font-weight:600;">Preferred Country</td><td style="padding:10px;color:#1a2e31;">${country || 'N/A'}</td></tr>
          <tr style="background:#fff;"><td style="padding:10px;color:#5a7a7e;font-weight:600;">Target Year</td><td style="padding:10px;color:#1a2e31;">${year || 'N/A'}</td></tr>
          ${message ? `<tr><td style="padding:10px;color:#5a7a7e;font-weight:600;vertical-align:top;">Message</td><td style="padding:10px;color:#1a2e31;">${message}</td></tr>` : ''}
        </table>
      </div>
      <div style="padding:16px 28px;background:#1b545d;text-align:center;">
        <a href="https://wa.me/923144441280?text=Hi ${encodeURIComponent(name)}" style="background:#c8a36f;color:#1b545d;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;">Reply on WhatsApp</a>
      </div>
    </div>`;

  const studentHTML = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d8cc;border-radius:8px;overflow:hidden;">
      <div style="background:#1b545d;padding:32px;text-align:center;">
        <h2 style="color:#c8a36f;margin:0;font-size:26px;">Solutions 360</h2>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Study Abroad Consultancy</p>
      </div>
      <div style="padding:32px;background:#f8f5f0;">
        <h3 style="color:#1b545d;margin:0 0 16px;">Hi ${name}, we received your inquiry!</h3>
        <p style="color:#5a7a7e;font-size:14px;line-height:1.8;">Thank you for reaching out to Solutions 360. Our team will review your details and get back to you within <strong>24 hours</strong>.</p>
        <p style="color:#5a7a7e;font-size:14px;line-height:1.8;">For a quicker response, feel free to reach us directly on WhatsApp.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="https://wa.me/923144441280" style="background:#1b545d;color:#c8a36f;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Chat on WhatsApp</a>
        </div>
        <p style="color:#5a7a7e;font-size:13px;border-top:1px solid #e0d8cc;padding-top:16px;margin-top:8px;">📞 +92 314 444 1280 &nbsp;|&nbsp; 🕐 Mon–Sat 11AM–6PM</p>
      </div>
    </div>`;

  try {
    await transporter.sendMail({
      from: '"Solutions 360" <solution360int@gmail.com>',
      to: ['solution360int@gmail.com', 'tahirarmie@gmail.com'],
      subject: `New Inquiry from ${name} — Solutions 360`,
      html: adminHTML
    });

    await transporter.sendMail({
      from: '"Solutions 360" <solution360int@gmail.com>',
      to: email,
      subject: 'We received your inquiry — Solutions 360',
      html: studentHTML
    });

    res.json({ success: true, message: 'Inquiry submitted! We will contact you within 24 hours.' });
  } catch (err) {
    console.error('Resend error:', err.message);
    res.json({ success: true, message: 'Inquiry received! We will contact you within 24 hours.' });
  }
});

app.listen(PORT, () => console.log(`Solutions 360 running at http://localhost:${PORT}`));
