import nextConnect from "next-connect";
import { database } from "middleware/database";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const restaurants = await db
    .collection("restaurants")
    .find({ approved: true })
    .toArray();

  const slugs = restaurants.map((r) => r.slug);

  res.status(200).json(slugs);
});

export default handler;
