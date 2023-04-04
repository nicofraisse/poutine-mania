import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  const skip =
    req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;

  const data = await db
    .collection("reviews")
    .aggregate([
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurants",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 5,
      },

      {
        $unwind: "$user",
      },
    ])
    .toArray();

  res.status(200).json(data);
};

export default handler;
