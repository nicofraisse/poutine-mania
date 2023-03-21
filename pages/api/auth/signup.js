import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import { sendVerificationEmail } from "../../../lib/sendVerificationEmail";
import crypto from "crypto";
import { isValidEmail } from "lib/isValidEmail";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  try {
    const { email, name, password } = data;

    if (!email || !isValidEmail(email)) {
      res.status(422).json({
        message: "Le format de l'adresse courriel est invalide.",
      });
      return;
    }
    if (!password || password.trim().length < 6) {
      res.status(422).json({
        message: "Le mot de passe doit faire au moins 6 caractères.",
      });
      return;
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      res.status(422).json({ message: "Ce courriel est déjà utilisé!" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    // Create a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db.collection("users").insertOne({
      email: email,
      name: name,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      eatenlist: [],
      watchlist: [],
      emailVerified: false,
      verificationToken: verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "Utilisateur créé! Vérifiez votre e-mail pour confirmer votre compte.",
    });
    client.close();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default handler;
