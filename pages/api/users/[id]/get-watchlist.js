import { connectToDatabase } from "../../../../lib/db";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

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
};

export default handler;
