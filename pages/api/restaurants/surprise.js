import nextConnect from "next-connect";
import { database } from "middleware/database";
import { getPublicUser } from "../../../lib/publicUser";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const restaurant = await db
    .collection("restaurants")
    .aggregate([{ $sample: { size: 1 } }])
    .next();

  const cleaned = {
    ...restaurant,
    creator: getPublicUser(restaurant.creator),
  };

  res.status(200).json(cleaned);
});

export default handler;
