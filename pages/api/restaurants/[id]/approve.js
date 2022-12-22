import { ObjectId } from "mongodb";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  try {
    if (session?.user.isAdmin) {
      const updatedRestaurant = await db.collection("restaurants").updateOne(
        { _id: ObjectId(req.query.id) },
        {
          $set: {
            approved: req.body.approved,
          },
        }
      );
      res.status(200).json(updatedRestaurant);
    } else {
      res.status(403).json("unauthorized");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export default handler;
