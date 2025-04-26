import { ObjectId } from "mongodb";
import { connectToDatabase } from "lib/db";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db();

  const deletedRestaurant = await db
    .collection("restaurants")
    .deleteOne({ _id: new ObjectId(req.query.id) });

  client.close();
  return res.status(200).json(deletedRestaurant);
}

export default isAdmin(handler);
