import { ObjectId } from "mongodb";
import { connectToDatabase } from "lib/db";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  const deletedReview = await db
    .collection("reviews")
    .deleteOne({ _id: ObjectId(req.query.id) });

  const user = await db
    .collection("users")
    .findOne({ _id: ObjectId(req.query.userId) });

  let updatedEatenlist = user.eatenlist;

  if (req.query.deleteFromEatenlist === "true") {
    console.log("in here");
    updatedEatenlist = updatedEatenlist.filter(
      (r) => r !== req.query.restaurantId
    );
  }

  await db.collection("users").updateOne(
    { _id: ObjectId(req.query.userId) },
    {
      $set: {
        eatenlist: updatedEatenlist,
      },
    }
  );
  // console.log("DELETED", deletedReview);
  res.status(200).json(deletedReview);
};

export default handler;
