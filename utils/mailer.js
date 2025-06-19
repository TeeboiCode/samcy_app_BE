const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
};
