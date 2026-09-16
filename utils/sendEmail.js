const nodemailer = require("nodemailer");

async function sendEmail(to, subject, html, from = process.env.EMAIL_USER) {
  try {
    console.log("Sending Insurance reminder started");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email credentials missing");
      return;
    }
    console.log("Started authentication...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log("Passed authentication and start sendin email");

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log("Sendin email finished!!!");
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

module.exports = sendEmail;
