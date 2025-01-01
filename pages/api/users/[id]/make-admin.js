import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "lib/db";
import nextConnect from "next-connect";
import { database } from "middleware/database";

const handler = nextConnect();
handler.use(database);

handler.post(async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  try {
    if (session?.user.isAdmin) {
      const updatedUser = await db.collection("users").updateOne(
        { _id: ObjectId(req.query.id) },
        {
          $set: {
            isAdmin: req.body.isAdmin,
          },
        }
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(403).json("unauthorized");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

export default handler;
