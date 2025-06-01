import { connectToDatabase } from "../../../lib/db";
import { sendVerificationEmail } from "../../../lib/sendVerificationEmail";
import crypto from "crypto";

const createNewValidationToken = async (userId, db) => {
  const newToken = crypto.randomBytes(32).toString("hex");

  await db
    .collection("users")
    .updateOne({ _id: userId }, { $set: { verificationToken: newToken } });

  return newToken;
};

async function handler(req, res) {
  if (req.method !== "PUT") {
    res
      .status(405)
      .json({ messageKey: "backend.sendVerificationEmail.methodNotAllowed" });
    return;
  }

  const { email, locale } = req.body;

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      res
        .status(404)
        .json({ messageKey: "backend.sendVerificationEmail.invalidToken" });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({
        messageKey: "backend.sendVerificationEmail.emailAlreadyVerified",
      });
      return;
    }

    const newToken = await createNewValidationToken(user._id, db);

    const lang = locale === "en" ? "en" : "fr";
    await sendVerificationEmail(user.email, newToken, lang);

    res
      .status(200)
      .json({ messageKey: "backend.sendVerificationEmail.emailSent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default handler;
