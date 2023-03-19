// lib/sendVerificationEmail.js
import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
    html: `Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
}