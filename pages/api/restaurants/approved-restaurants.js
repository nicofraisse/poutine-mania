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

  res.status(200).json(restaurants);
});

export default handler;
