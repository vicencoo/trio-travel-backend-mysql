const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: 'Name, email and message are required' });
    }

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.AGENCY_EMAIL,
      subject: `Email nga ${name}`,
      html: `
        <h3>Mesazh i ri nga Trio Travel.</h3>
        <p><strong>Emri:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Numri i telefonit:</strong> ${phoneNumber || 'Nuk është dhënë'}</p>
        <hr />
        <p><strong>Mesazhi:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: 'Email u dërgua me sukses' });
  } catch (err) {
    console.error('Send email error', err);
    res.status(500).json({ message: 'Error while sending email to agency' });
  }
};
