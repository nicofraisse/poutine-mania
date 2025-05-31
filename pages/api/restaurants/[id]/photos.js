import { connectToDatabase } from "../../../../lib/db";
import { ObjectId } from "mongodb";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = await client.db();

    const { id } = req.query;

    // Validate restaurant ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    // Check if restaurant exists
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(id) });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Get all reviews with photos for this restaurant
    const reviews = await db
      .collection("reviews")
      .find(
        {
          restaurantId: new ObjectId(id),
          photos: { $exists: true, $not: { $size: 0 } },
        },
        {
          projection: {
            photos: 1,
            userId: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const userIdStrings = Array.from(
      new Set(reviews.map((review) => review.userId.toString()))
    );

    // Convert each unique string back into an ObjectId exactly once
    const userObjectIds = userIdStrings.map(
      (idString) => new ObjectId(idString)
    );

    console.log(userIdStrings, userObjectIds);

    // Now query the users collection using those IDs
    const users = await db
      .collection("users")
      .find({ _id: { $in: userObjectIds } })
      .toArray();

    console.log("Users found:", users);

    // Create a map for quick user lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user.name;
      return acc;
    }, {});

    // Flatten all photos with reviewer info
    const allPhotos = [];
    reviews.forEach((review) => {
      if (review.photos && Array.isArray(review.photos)) {
        review.photos.forEach((photoId) => {
          allPhotos.push({
            id: photoId,
            reviewId: review._id,
            reviewerName: userMap[review.userId.toString()] || "Unknown User",
            createdAt: review.createdAt,
          });
        });
      }
    });

    res.status(200).json({
      photos: allPhotos,
      totalCount: allPhotos.length,
      currentMainPhotos: restaurant.mainPhotos || [],
    });
  } catch (error) {
    console.error("Error fetching restaurant photos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default isAdmin(handler);
