const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Aplicativo Scanner" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = { sendEmail };
