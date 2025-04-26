import { connectToDatabase } from "../../../lib/db";
import { lookupPublicUser, mapToPublicUser } from "../../../lib/publicUser";
import { unwind } from "../../../lib/unwind";

async function handler(req, res) {
  const client = await connectToDatabase();
  const db = client.db();

  const limit = /^\d+$/.test(req.query.limit) ? +req.query.limit : 5;
  const page = /^\d+$/.test(req.query.page) ? +req.query.page : 1;
  const skip = (page - 1) * limit;

  const reviews = await db
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
      lookupPublicUser(),
      unwind("$user"),
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])
    .toArray();

  const cleaned = reviews.map((review) => ({
    ...review,
    restaurants: review.restaurants.map((restaurant) => ({
      ...restaurant,
      creator: mapToPublicUser(restaurant.creator),
    })),
  }));

  res.status(200).json(cleaned);
}

export default handler;
