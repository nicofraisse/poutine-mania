import nextConnect from "next-connect";
import { connectToDatabase } from "../../../lib/db";
import { database } from "../../../middleware/database";

const getAvgSection = (field) => ({
  $avg: {
    $map: {
      input: {
        $filter: {
          input: "$reviews",
          as: "review",
          cond: {
            $and: [
              { $ne: [`$$review.${field}`, null] },
              { $ne: [`$$review.${field}`, NaN] },
            ],
          },
        },
      },
      as: "review",
      in: {
        $convert: {
          input: `$$review.${field}`,
          to: "double",
          onError: "$$REMOVE",
          onNull: "$$REMOVE",
        },
      },
    },
  },
});

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

  // Define rating fields like in the restaurant ID endpoint
  const ratingFields = [
    "finalRating",
    "friesRating",
    "cheeseRating",
    "sauceRating",
    "portionRating",
  ];

  // Create the avgSection object
  const avgSection = ratingFields.reduce(
    (acc, field) => ({
      ...acc,
      [`avg${field.charAt(0).toUpperCase() + field.slice(1)}`]:
        getAvgSection(field),
    }),
    {}
  );

  const baseAggregator = [
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
        // Keep the original avgRating for compatibility
        avgRating: { $avg: "$reviews.finalRating" },
      },
    },
    {
      // Add the detailed average ratings
      $addFields: avgSection,
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
        ...baseAggregator,
      ])
      .toArray();
  } else {
    result = await db
      .collection("restaurants")
      .aggregate(baseAggregator)
      .toArray();
  }
  res.status(200).json(result);
});

export default handler;

export const fetchTopRestaurants = async () => {
  const client = await connectToDatabase();
  const db = await client.db();

  // Define rating fields
  const ratingFields = [
    "finalRating",
    "friesRating",
    "cheeseRating",
    "sauceRating",
    "portionRating",
  ];

  // Create the avgSection object
  const avgSection = ratingFields.reduce(
    (acc, field) => ({
      ...acc,
      [`avg${field.charAt(0).toUpperCase() + field.slice(1)}`]:
        getAvgSection(field),
    }),
    {}
  );

  const baseAggregator = [
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
      // Add the detailed average ratings
      $addFields: avgSection,
    },
    {
      $match: {
        reviewCount: { $gte: 2 },
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

  return db.collection("restaurants").aggregate(baseAggregator).toArray();
};
