import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const data = await db
    .collection("restaurants")
    .aggregate([
      { $match: { slug: req.query.id } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "b",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          avgRating: { $avg: "$reviews.finalRating" },
          avgFriesRating: { $avg: "$reviews.friesRating" },
          avgCheeseRating: { $avg: "$reviews.cheeseRating" },
          avgSauceRating: { $avg: "$reviews.sauceRating" },
          avgPortionRating: { $avg: "$reviews.portionRating" },
          // avgServiceRating: { $avg: "$reviews.serviceRating" },
        },
      },
    ])
    .toArray();
  res.status(200).json(data[0]);
};

export default handler;
