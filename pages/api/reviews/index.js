import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  const limit = /^\d+$/.test(req.query.limit) ? +req.query.limit : 5;
  const page = /^\d+$/.test(req.query.page) ? +req.query.page : 1;
  const skip = (page - 1) * limit;

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
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $unwind: "$user" },
    ])
    .toArray();

  res.status(200).json(data);
};

export default handler;
