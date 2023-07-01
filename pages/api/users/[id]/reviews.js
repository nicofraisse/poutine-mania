import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import { database } from "middleware/database";

const handler = nextConnect();
handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const user = await db.collection("users").findOne({ slug: req.query.id });

  const data = await db
    .collection("reviews")
    .aggregate([
      {
        $match: {
          userId: new ObjectId(user._id),
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurants",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray();

  const results = data.filter((d) => d.restaurants.length !== 0);
  res.status(200).json(results);
});

export default handler;
