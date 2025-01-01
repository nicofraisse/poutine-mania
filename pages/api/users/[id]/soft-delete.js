import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/db";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getServerSession(req, res, authOptions);

  if (session.user._id.toString() === req.query.id) {
    const updatedUser = await db.collection("users").updateOne(
      { _id: ObjectId(session.user._id) },
      {
        $set: {
          deletedAt: new Date(),
        },
      }
    );
    res.status(200).json(updatedUser);
  } else {
    res.status(401).json("Accès non autorisé");
  }
};

export default handler;
