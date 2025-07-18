import nextConnect from "next-connect";
import { database } from "middleware/database";
import { isAdmin } from "../../../lib/middleware/isAdmin";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    newUsers,
    totalRestaurants,
    newRestaurants,
    totalReviews,
    newReviews,
    approvedRestaurants,
    pendingRestaurants,
  ] = await Promise.all([
    req.db.collection("users").countDocuments(),
    req.db
      .collection("users")
      .countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    req.db.collection("restaurants").countDocuments(),
    req.db
      .collection("restaurants")
      .countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    req.db.collection("reviews").countDocuments(),
    req.db
      .collection("reviews")
      .countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    req.db.collection("restaurants").countDocuments({ approved: true }),
    req.db.collection("restaurants").countDocuments({ approved: false }),
  ]);

  const stats = {
    users: {
      total: totalUsers,
      newLast7Days: newUsers,
    },
    restaurants: {
      total: totalRestaurants,
      newLast7Days: newRestaurants,
      approved: approvedRestaurants,
      pending: pendingRestaurants,
    },
    reviews: {
      total: totalReviews,
      newLast7Days: newReviews,
    },
  };

  res.status(200).json(stats);
});

export default isAdmin(handler);
