import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/db";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  try {
    const updatedRestaurant = await db.collection("restaurants").updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          approved: req.body.approved,
        },
      }
    );
    res.status(200).json(updatedRestaurant);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export default isAdmin(handler);
