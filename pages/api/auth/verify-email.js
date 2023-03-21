import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { token } = req.body;

  if (!token) {
    res.status(422).json({ message: "Token invalide." });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  const user = await db
    .collection("users")
    .findOne({ verificationToken: token });

  if (!user) {
    res.status(422).json({ message: "Token invalide." });
    client.close();
    return;
  }

  await db
    .collection("users")
    .updateOne(
      { _id: user._id },
      { $set: { emailVerified: true }, $unset: { verificationToken: "" } }
    );

  res.status(200).json({ message: "Email vérifié avec succès!" });
  client.close();
}

export default handler;
