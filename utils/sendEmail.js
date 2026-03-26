const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html, from = process.env.EMAIL_USER) {
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
