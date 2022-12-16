import { connectToDatabase } from "../../../../lib/db";
import { getSession } from "next-auth/client";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  const data = await db
    .collection("reviews")
    .aggregate([
      {
        $match: {
          restaurantId: new ObjectId(req.query.id),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "userId",
                as: "reviews",
              },
            },
          ],
        },
      },

      { $unwind: "$user" },
    ])
    .toArray();

  res.status(200).json(data);
};

export default handler;
