import nextConnect from "next-connect";
import { database } from "middleware/database";
import { getSession } from "next-auth/client";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const session = await getSession({ req });

  if (!session?.user || !session.user.isAdmin) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const users = await req.db
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "userId",
          as: "userReviews",
        },
      },
      {
        $addFields: {
          eatenlistCount: { $size: "$eatenlist" },
          watchlistCount: { $size: "$watchlist" },
          reviewCount: { $size: "$userReviews" },
        },
      },
      {
        $project: {
          userReviews: 0,
        },
      },
    ])
    .toArray();

  res.status(200).json(users);
});

export default handler;
