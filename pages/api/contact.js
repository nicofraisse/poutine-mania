import nodemailer from "nodemailer";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { name, email, message, userEmail, userId } = req.body;

  if (!message || message.trim().length < 10) {
    res.status(400).json({
      message: "Message is required and must be at least 10 characters long",
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const senderInfo = [];
    if (name) senderInfo.push(`Name: ${name}`);
    if (email) senderInfo.push(`Email: ${email}`);
    if (userEmail) senderInfo.push(`User Email: ${userEmail}`);
    if (userId) senderInfo.push(`User ID: ${userId}`);

    const emailBody = `
Contact Form Submission from Poutine Mania

${senderInfo.join("\n")}

Message:
${message}

---
Sent from: ${process.env.NEXTAUTH_URL}
Timestamp: ${new Date().toISOString()}
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to:
        process.env.CONTACT_EMAIL ||
        process.env.EMAIL_FROM ||
        "cyys100@gmail.com",
      subject: `Contact Form: ${name || "Anonymous"} - Poutine Mania`,
      text: emailBody,
      replyTo: email || userEmail || undefined,
    };

    console.log("Sending contact email:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.replyTo,
    });

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}

export default handler;
