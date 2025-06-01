import { ObjectId } from "mongodb";
import { database } from "middleware/database";
import nextConnect from "next-connect";
import { mapToPublicUser } from "../../../../lib/publicUser";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  try {
    // Find user by ID or slug
    let user;
    if (ObjectId.isValid(req.query.id)) {
      user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(req.query.id) });
    } else {
      user = await db.collection("users").findOne({ slug: req.query.id });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all restaurant IDs from both lists
    const eatenIds = user.eatenlist?.map((id) => new ObjectId(id)) || [];
    const watchIds = user.watchlist?.map((id) => new ObjectId(id)) || [];
    const allRestaurantIds = [...new Set([...eatenIds, ...watchIds])];

    if (allRestaurantIds.length === 0) {
      return res.status(200).json([]);
    }

    // Fetch all restaurants
    const restaurants = await db
      .collection("restaurants")
      .find({
        _id: { $in: allRestaurantIds },
        approved: true,
      })
      .toArray();

    // Fetch all reviews by this user for these restaurants
    const reviews = await db
      .collection("reviews")
      .find({
        userId: user._id,
        restaurantId: { $in: allRestaurantIds },
      })
      .toArray();

    // Create a map of restaurantId to review for quick lookup
    const reviewMap = reviews.reduce((acc, review) => {
      acc[review.restaurantId.toString()] = review;
      return acc;
    }, {});

    // Create a set for quick lookup
    const eatenSet = new Set(user.eatenlist || []);
    const watchSet = new Set(user.watchlist || []);

    // Map restaurants with additional data
    const result = restaurants.map((restaurant) => {
      const restaurantIdStr = restaurant._id.toString();
      const review = reviewMap[restaurantIdStr];

      return {
        ...restaurant,
        isInEatenList: eatenSet.has(restaurantIdStr),
        isInWatchlist: watchSet.has(restaurantIdStr),
        ...(review && { review }),
        creator: mapToPublicUser(restaurant.creator),
      };
    });

    // Calculate average ratings if restaurants have reviews
    const enrichedResult = await Promise.all(
      result.map(async (restaurant) => {
        // Get all reviews for this restaurant to calculate average rating
        const allReviews = await db
          .collection("reviews")
          .find({ restaurantId: restaurant._id })
          .toArray();

        if (allReviews.length > 0) {
          const avgRating =
            allReviews.reduce((sum, r) => sum + r.finalRating, 0) /
            allReviews.length;
          return {
            ...restaurant,
            avgFinalRating: avgRating,
            reviewCount: allReviews.length,
          };
        }

        return {
          ...restaurant,
          avgFinalRating: 0,
          reviewCount: 0,
        };
      })
    );

    res.status(200).json(enrichedResult);
  } catch (error) {
    console.error("Error in map API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default handler;
