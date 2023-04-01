import nextConnect from "next-connect";
import database from "middleware/database";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const restaurant = await db
    .collection("restaurants")
    .aggregate([{ $sample: { size: 1 } }])
    .next();

  res.status(200).json(restaurant);
});

export default handler;
