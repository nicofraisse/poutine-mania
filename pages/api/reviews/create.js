import { connectToDatabase } from "../../../lib/db";
import { getSession } from "next-auth/client";
import { ObjectId } from "mongodb";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });
  if (session) {
    await db.collection("reviews").insertOne({
      finalRating: req.body.finalRating,
      friesRating: req.body.friesRating,
      cheeseRating: req.body.cheeseRating,
      sauceRating: req.body.sauceRating,
      portionRating: req.body.portionRating,
      // serviceRating: req.body.serviceRating,
      // title: req.body.title,
      comment: req.body.comment,
      restaurantId: new ObjectId(req.body.restaurantId),
      userId: new ObjectId(session.user._id),
      photos: req.body.photos,
      createdAt: new Date(),
    });

    const data = await db.collection("reviews").find({}).toArray();
    const restaurant = await db
      .collection("restaurants")
      .find({ _id: new ObjectId(req.body.restaurantId) });

    if (
      (req.body.photos && !restaurant.mainPhotos) ||
      restaurant?.mainPhotos?.length < 3
    ) {
      const updatedMainPhotos = restaurant?.mainPhotos || [];
      req.body.photos.forEach((photo) => {
        if (updatedMainPhotos.length < 3) {
          updatedMainPhotos.push(photo);
        }
      });
      await db.collection("restaurants").updateOne(
        { _id: ObjectId(req.body.restaurantId) },
        {
          $set: {
            mainPhotos: updatedMainPhotos,
          },
        }
      );
    }

    // Create updated eatenlist
    let updatedEatenlist = session.user.eatenlist;
    let updatedWatchlist = session.user.watchlist;

    if (!updatedEatenlist.includes(req.body.restaurantId)) {
      updatedEatenlist.push(req.body.restaurantId);
    }

    updatedWatchlist = updatedWatchlist.filter(
      (r) => r !== req.body.restaurantId
    );

    // Update user's eatenlist
    await db.collection("users").updateOne(
      { _id: ObjectId(session.user._id) },
      {
        $set: {
          eatenlist: updatedEatenlist,
          watchlist: updatedWatchlist,
        },
      }
    );

    res.status(200).json({ data });
  } else {
    res.status(403).json("unauthorized");
  }
};

export default handler;
