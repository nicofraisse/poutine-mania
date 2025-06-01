import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import { generateSlug } from "../../../lib/generateSlug";
import { sendVerificationEmail } from "../../../lib/sendVerificationEmail";
import crypto from "crypto";
import { isValidEmail } from "lib/isValidEmail";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  try {
    const { email, name, password, locale } = data;

    if (!email || !isValidEmail(email)) {
      res.status(422).json({
        messageKey: "backend.signup.invalidEmailFormat",
      });
      return;
    }
    if (!password || password.trim().length < 6) {
      res.status(422).json({
        messageKey: "backend.signup.passwordTooShort6Characters",
      });
      return;
    }

    const client = await connectToDatabase();

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      res.status(422).json({ messageKey: "backend.signup.emailTaken" });

      return;
    }

    const hashedPassword = await hashPassword(password);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const slug = await generateSlug(req.body.name, db, "users");

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
      slug,
    });

    const lang = locale === "fr" ? "fr" : "en";

    console.log("locale", locale, lang);
    await sendVerificationEmail(email, verificationToken, lang);

    res.status(201).json({
      messageKey: "backend.signup.success",
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default handler;
