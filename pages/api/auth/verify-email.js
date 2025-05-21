import { connectToDatabase } from "../../../lib/db";
import { sendWelcomeEmail } from "../../../lib/sendVerificationEmail";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { token, locale } = req.body;

  if (!token) {
    res.status(422).json({ messageKey: "backend.verifyEmail.invalidToken" });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ verificationToken: token });

  if (!user) {
    res.status(422).json({ messageKey: "backend.verifyEmail.invalidToken" });
    client.close();
    return;
  }

  await db
    .collection("users")
    .updateOne(
      { _id: user._id },
      { $set: { emailVerified: true }, $unset: { verificationToken: "" } }
    );

  res.status(200).json({ messageKey: "backend.verifyEmail.success" });
  const lang = locale === "en" ? "en" : "fr";
  await sendWelcomeEmail(user.email, user.name, lang);
  client.close();
}

export default handler;
