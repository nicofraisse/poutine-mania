import nextConnect from "next-connect";
import database from "middleware/database";
import { ObjectId } from "mongodb";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.query.id) });

  // Migrate
  if (!user.watchlist) {
    await db.collection("users").updateOne(
      { _id: ObjectId(req.query.id) },
      {
        $set: {
          watchlist: [],
        },
      }
    );
  }

  const restaurants = await db
    .collection("restaurants")
    .find({ _id: { $in: user.watchlist?.map((id) => new ObjectId(id)) } })
    .toArray();

  res.status(200).json(restaurants);
});

export default handler;
