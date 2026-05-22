// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// async function sendEmail(to, subject, html, from = process.env.EMAIL_USER) {
//   await transporter.sendMail({
//     from,
//     to,
//     subject,
//     html,
//   });
// }

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html, from = process.env.EMAIL_USER) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log("Email credentials missing");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (err) {
    // console.log("Email send failed:", err.message);
    console.log("Email send failed:");
  }
}

module.exports = sendEmail;
