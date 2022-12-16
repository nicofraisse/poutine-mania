import { connectToDatabase } from "../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  let result;

  const { search, sort, order, limit, minReviewCount } = req.query;

  const baseAggregaor = [
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        reviewCount: { $size: "$reviews" },
        avgRating: { $avg: "$reviews.finalRating" },
      },
    },
    {
      $match: {
        reviewCount: { $gte: minReviewCount ? Number(minReviewCount) : 0 },
      },
    },
    {
      $limit: limit ? Number(limit) : Number.MAX_SAFE_INTEGER,
    },
    {
      $sort: {
        [sort]: Number(order) || 1,
      },
    },
  ];

  if (search) {
    result = await db
      .collection("restaurants")
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: search,
              path: "name",
              fuzzy: {
                maxEdits: 1,
              },
            },
          },
        },
        ...baseAggregaor,
      ])
      .toArray();
  } else {
    result = await db
      .collection("restaurants")
      .aggregate(baseAggregaor)
      .toArray();
  }
  res.status(200).json(result);
};

export default handler;
