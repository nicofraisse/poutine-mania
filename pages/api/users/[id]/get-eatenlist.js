import { ObjectId } from "mongodb";
import { database } from "middleware/database";
import nextConnect from "next-connect";
import { mapToPublicUser } from "../../../../lib/publicUser";

const handler = nextConnect();

handler.use(database);

handler.get(async (req, res) => {
  const db = req.db;

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.query.id) });

  const restaurants = await db
    .collection("restaurants")
    .find({ _id: { $in: user.eatenlist?.map((id) => new ObjectId(id)) } })
    .toArray();

  const reviews = await db
    .collection("reviews")
    .find({
      userId: user._id,
      restaurantId: { $in: user.eatenlist?.map((id) => new ObjectId(id)) },
    })
    .toArray();

  const result = restaurants.map((restaurant) => {
    const userRestaurantReviews = reviews.filter(
      (review) => review.restaurantId.toString() === restaurant._id.toString()
    );
    return { ...restaurant, reviews: userRestaurantReviews };
  });

  const cleaned = result.map((restaurant) => ({
    ...restaurant,
    creator: mapToPublicUser(restaurant.creator),
  }));

  res.status(200).json(cleaned);
});

export default handler;
