import nextConnect from "next-connect";
import { database } from "middleware/database";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const slug = req.query?.slug;
  const restaurant = await db.collection("restaurants").findOne({ slug: slug });

  res.json({ restaurantName: restaurant.name });
});

export default handler;
