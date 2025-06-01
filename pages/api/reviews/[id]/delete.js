import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "../../../../lib/db";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const client = await connectToDatabase();
  const db = client.db();

  const reviewId = new ObjectId(req.query.id);
  const review = await db.collection("reviews").findOne({ _id: reviewId });

  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  const ownerId = review.userId;

  if (
    !session.user.isAdmin &&
    ownerId.toString() !== session.user._id.toString()
  ) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const deletedReview = await db
    .collection("reviews")
    .deleteOne({ _id: reviewId });

  const userObjId = new ObjectId(ownerId);
  const user = await db.collection("users").findOne({ _id: userObjId });

  let updatedEatenlist = user.eatenlist || [];
  if (req.query.deleteFromEatenlist === "true") {
    updatedEatenlist = updatedEatenlist.filter(
      (r) => r !== req.query.restaurantId
    );
  }

  await db
    .collection("users")
    .updateOne({ _id: userObjId }, { $set: { eatenlist: updatedEatenlist } });

  res.status(200).json(deletedReview);
}
