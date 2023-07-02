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

  const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${email}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Poutine Mania: Vérification d'addresse courriel",
    text: `Veuillez confirmer votre courriel en cliquant sur ce lien: ${verificationLink}`,
    html: `Veuillez confirmer votre courriel en cliquant sur ce lien: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email, username) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Bienvenue sur Poutine Mania: l'aventure poutinesque commence !",
    html: `
     <div style="max-width: 800px">
        <p>Salut ${username},</p>
        <p>
          Merci de t'être inscrit sur <a href="https://poutinemania.ca/">Poutine Mania</a>, le rendez-vous de tous les passionnés de poutine au Québec.
          Connecte-toi dès maintenant pour découvrir des spots incroyables, évaluer tes poutines préférées et partager tes dernières expériences culinaires!
        </p>
        <a href="https://poutinemania.ca?connexion=1">Connexion</a>
        <p>
          Bonnes découvertes gourmandes !
        </p>
        <p>
          Poutinement,
          <br/>
          L'équipe de Poutine Mania
        </p>
     </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
