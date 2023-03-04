import { connectToDatabase } from "../../../../lib/db";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  const data = await db
    .collection("reviews")
    .aggregate([
      {
        $match: {
          userId: new ObjectId(req.query.id),
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
};

export default handler;
