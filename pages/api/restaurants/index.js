import nextConnect from "next-connect";
import { connectToDatabase } from "../../../lib/db";
import { database } from "../../../middleware/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = session?.user?.isAdmin;

  const { search, sort, order, limit, minReviewCount, noUnapproved } =
    req.query;
  const approvedMatch = noUnapproved ? { approved: true } : undefined;
  let { rating, categories, price } = req.query;
  categories = categories ? categories.split(",") : [];
  price = price ? price.split(",").map(Number) : [];
  const categoryMatch = categories.length
    ? { categories: { $in: categories } }
    : undefined;
  const priceMatch = price.length ? { priceRange: { $in: price } } : undefined;
  const ratingMatch =
    rating > 0 ? { avgRating: { $gte: Number(rating) } } : undefined;

  const ratingFields = [
    "finalRating",
    "friesRating",
    "cheeseRating",
    "sauceRating",
    "portionRating",
  ];
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
  ];

  const sortStage = {
    $sort: {
      [sort]: Number(order) || 1,
    },
  };

  const userLookupStage = {
    $lookup: {
      from: "users",
      localField: "creatorId",
      foreignField: "_id",
      as: "creator",
    },
  };
  const unwindCreatorStage = {
    $unwind: {
      path: "$creator",
      preserveNullAndEmptyArrays: true,
    },
  };

  let result;
  if (search) {
    result = await db
      .collection("restaurants")
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: search,
              path: "name",
              fuzzy: { maxEdits: 1 },
            },
          },
        },
        ...baseAggregator,
        userLookupStage,
        unwindCreatorStage,
      ])
      .toArray();
  } else {
    result = await db
      .collection("restaurants")
      .aggregate([
        ...baseAggregator,
        sortStage,
        userLookupStage,
        unwindCreatorStage,
      ])
      .toArray();
  }
  // eslint-disable-next-line no-unused-vars
  const output = isAdmin ? result : result.map(({ creator, ...rest }) => rest);

  res.status(200).json(output);
});

export default handler;

export const fetchTopRestaurants = async () => {
  const client = await connectToDatabase();
  const db = await client.db();

  const ratingFields = [
    "finalRating",
    "friesRating",
    "cheeseRating",
    "sauceRating",
    "portionRating",
  ];

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
      $addFields: avgSection,
    },
    {
      $match: {
        reviewCount: { $gte: 3 },
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
