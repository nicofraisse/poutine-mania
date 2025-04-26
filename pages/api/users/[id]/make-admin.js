import { ObjectId } from "mongodb";
import { connectToDatabase } from "lib/db";
import nextConnect from "next-connect";
import { database } from "middleware/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

const handler = nextConnect();
handler.use(database);

handler.post(async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getServerSession(req, res, authOptions);

  try {
    const updatedUser = await db.collection("users").updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          isAdmin: req.body.isAdmin,
        },
      }
    );
    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

export default isAdmin(handler);
