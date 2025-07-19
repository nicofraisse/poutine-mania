import nextConnect from "next-connect";
import { database } from "middleware/database";
import { isAdmin } from "../../../lib/middleware/isAdmin";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
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
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "userId",
          as: "connectedAccounts",
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "creatorId",
          as: "createdRestaurants",
        },
      },
      {
        $addFields: {
          eatenlistCount: { $size: "$eatenlist" },
          watchlistCount: { $size: "$watchlist" },
          reviewCount: { $size: "$userReviews" },
          connectedAccount: { $arrayElemAt: ["$connectedAccounts", 0] },
          restaurantsCreatedCount: { $size: "$createdRestaurants" },
        },
      },
      {
        $project: {
          userReviews: 0,
          connectedAccounts: 0,
          createdRestaurants: 0,
          "connectedAccount.refreshToken": 0,
          "connectedAccount.accessToken": 0,
          "connectedAccount.accessTokenExpires": 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
    .toArray();

  res.status(200).json(users);
});

export default isAdmin(handler);
