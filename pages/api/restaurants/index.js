import nextConnect from "next-connect";
import { connectToDatabase } from "../../../lib/db";
import { database } from "../../../middleware/database";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  let result;

  const { search, sort, order, limit, minReviewCount, noUnapproved } =
    req.query;

  const approvedMatch = noUnapproved
    ? {
        approved: true,
      }
    : undefined;

  let { rating, categories, price } = req.query;

  // convert category and price back to array, if they are not nullish
  categories = categories ? categories.split(",") : [];
  price = price ? price.split(",").map(Number) : [];

  const categoryMatch = categories.length
    ? { categories: { $in: categories } }
    : undefined;

  const priceMatch = price.length ? { priceRange: { $in: price } } : undefined;

  const ratingMatch =
    rating > 0 ? { avgRating: { $gte: Number(rating) } } : undefined;

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
        ...(approvedMatch && approvedMatch),
        ...(categoryMatch && categoryMatch),
        ...(priceMatch && priceMatch),
        ...(ratingMatch && ratingMatch),
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
});

// pages/api/restaurants.js

export default handler;

export const fetchTopRestaurants = async () => {
  const client = await connectToDatabase();
  const db = await client.db();

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
        reviewCount: { $gte: 0 },
        approved: true,
      },
    },
    {
      $sort: {
        avgRating: -1,
      },
    },
    {
      $limit: 10,
    },
  ];

  return db.collection("restaurants").aggregate(baseAggregaor).toArray();
};
