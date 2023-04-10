import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import database from "middleware/database";
import _ from "lodash";

const handler = nextConnect();
handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.query.id) });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Get all user reviews
  const reviews = await db
    .collection("reviews")
    .find({ userId: new ObjectId(req.query.id) })
    .sort({ createdAt: -1 })
    .toArray();

  const groupedReviews = _.groupBy(reviews, "restaurantId");
  const averageRatings = _.map(
    groupedReviews,
    (restaurantReviews, restaurantId) => {
      const averageFinalRating = _.meanBy(restaurantReviews, "finalRating");
      return { restaurantId, averageFinalRating };
    }
  );

  const favoriteReview = _.maxBy(averageRatings, "averageFinalRating");
  const leastFavoriteReview = _.minBy(averageRatings, "averageFinalRating");

  const lastEatenReview = reviews[0];

  const neededRestaurantIds = _.uniq(
    [favoriteReview, leastFavoriteReview, lastEatenReview].map(
      (review) => review && new ObjectId(review.restaurantId)
    )
  ).filter(Boolean);

  const neededRestaurants = await db
    .collection("restaurants")
    .find({ _id: { $in: neededRestaurantIds } })
    .toArray();

  const findRestaurantById = (id) =>
    neededRestaurants.find(
      (restaurant) => restaurant._id.toString() === id.toString()
    );

  const favoriteRestaurant = favoriteReview
    ? {
        name: findRestaurantById(favoriteReview.restaurantId).name,
        finalRating: favoriteReview.averageFinalRating,
      }
    : null;

  const leastFavoriteRestaurant = leastFavoriteReview
    ? {
        name: findRestaurantById(leastFavoriteReview.restaurantId).name,
        finalRating: leastFavoriteReview.averageFinalRating,
      }
    : null;

  const lastEatenRestaurant = lastEatenReview
    ? {
        name: findRestaurantById(lastEatenReview.restaurantId).name,
        date: lastEatenReview.createdAt,
      }
    : null;

  user.profileStats = {
    favoriteRestaurant,
    leastFavoriteRestaurant,
    lastEatenRestaurant,
  };

  res.status(200).json(user);
});

export default handler;
