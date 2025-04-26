import { connectToDatabase } from "../../../../lib/db";
import { mapToPublicUser } from "../../../../lib/publicUser";

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

const handler = async (req, res) => {
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

  const data = await db
    .collection("restaurants")
    .aggregate([
      { $match: { slug: req.query.id } },
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
        },
      },
      {
        $addFields: avgSection,
      },
    ])
    .toArray();

  const restaurant = data[0];

  const cleaned = {
    ...restaurant,
    creator: mapToPublicUser(restaurant.creator),
  };

  res.status(200).json(cleaned);
};

export default handler;
