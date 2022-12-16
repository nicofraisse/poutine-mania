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
    res.status(200).json({ data });
  } else {
    res.status(403).json("unauthorized");
  }
};

export default handler;
