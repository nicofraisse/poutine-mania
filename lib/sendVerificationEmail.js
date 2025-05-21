import nodemailer from "nodemailer";

export async function sendVerificationEmail(email, token, locale = "fr") {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationLink = `${process.env.NEXTAUTH_URL}/${locale}/verify-email?token=${token}&email=${email}`;

  const emailContent = {
    fr: {
      subject: "Poutine Mania: Vérification d'addresse courriel",
      text: `Veuillez confirmer votre courriel en cliquant sur ce lien: ${verificationLink}`,
      html: `Veuillez confirmer votre courriel en cliquant sur ce lien: <a href="${verificationLink}">${verificationLink}</a>`,
    },
    en: {
      subject: "Poutine Mania: Email Verification",
      text: `Please confirm your email by clicking on this link: ${verificationLink}`,
      html: `Please confirm your email by clicking on this link: <a href="${verificationLink}">${verificationLink}</a>`,
    },
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    ...emailContent[locale],
  };

  console.log("Sending email:", mailOptions);

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email, username, locale = "fr") {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailContent = {
    fr: {
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
        </div>`,
    },
    en: {
      subject: "Welcome to Poutine Mania: the poutine adventure begins!",
      html: `
        <div style="max-width: 800px">
          <p>Hello {username},</p>
          <p>
            Thank you for signing up on <a href="https://poutinemania.ca/en">Poutine Mania</a>, the gathering place for all poutine enthusiasts in Quebec.
            Log in now to discover amazing spots, rate your favorite poutines, and share your latest culinary experiences!
          </p>
          <a href="https://poutinemania.ca/en?connexion=1">Log in</a>
          <p>
            Happy poutine hunting!
          </p>
          <p>
            Poutine-ly yours,
            <br/>
            The Poutine Mania Team
          </p>
        </div>`,
    },
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    ...emailContent[locale],
  };

  await transporter.sendMail(mailOptions);
}
