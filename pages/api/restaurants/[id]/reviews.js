import { connectToDatabase } from "../../../../lib/db";
import { ObjectId } from "mongodb";
import { PUBLIC_USER_PROJECTION } from "../../../../lib/publicUser";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = client.db();

  const reviews = await db
    .collection("reviews")
    .aggregate([
      { $match: { restaurantId: new ObjectId(req.query.id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          let: { uid: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
            {
              $project: PUBLIC_USER_PROJECTION,
            },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "userId",
                as: "reviews",
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
    ])
    .toArray();

  res.status(200).json(reviews);
};

export default handler;
