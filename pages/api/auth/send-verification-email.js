import { connectToDatabase } from "../../../lib/db";
import { sendVerificationEmail } from "../../../lib/sendVerificationEmail";
import crypto from "crypto";

const createNewValidationToken = async (userId, db) => {
  // Create a new verification token
  const newToken = crypto.randomBytes(32).toString("hex");

  // Update the user's verification token in the database
  await db
    .collection("users")
    .updateOne({ _id: userId }, { $set: { verificationToken: newToken } });

  return newToken;
};

async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email } = req.body;

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Courriel invalide" });
      client.close();
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({ message: "Email already validated" });
      client.close();
      return;
    }

    // Create a new validation token and update it in the database
    const newToken = await createNewValidationToken(user._id, db);

    // Send the new validation email with the updated token
    await sendVerificationEmail(user.email, newToken);

    res.status(200).json({ message: "Validation email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
}

export default handler;
