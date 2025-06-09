import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import { database } from "middleware/database";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

const handler = nextConnect();
handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;
  const restaurants = await db
    .collection("restaurants")
    .find({ creatorId: new ObjectId(req.query.id) })
    .project({ name: 1, slug: 1, approved: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  res.status(200).json(restaurants);
});

export default isAdmin(handler);
