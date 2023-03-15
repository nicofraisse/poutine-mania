import { ObjectId } from "mongodb";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  // Validate request
  if (!session.user || session.user._id !== req.query.id) {
    res.status(403).json("unauthorized");
  }
  if (!req.body.type || !["add", "remove"].includes(req.body.type)) {
    res.status(400).json("Missing or wrong type (add or remove)");
  }
  if (!req.body.restaurantId) {
    res.status(400).json("Missing restaurant id");
  }

  // Create updated eatenlist
  let updatedEatenlist = session.user.eatenlist;
  let updatedWatchlist = session.user.watchlist
    ? [...session.user.watchlist]
    : [];
  if (req.body.type === "add") {
    updatedEatenlist.push(req.body.restaurantId);
    updatedWatchlist = updatedWatchlist.filter(
      (r) => r !== req.body.restaurantId
    );
  } else if (req.body.type === "remove") {
    updatedEatenlist = updatedEatenlist.filter(
      (r) => r !== req.body.restaurantId
    );
  }

  // Update user's eatenlist
  const updatedUser = await db.collection("users").updateOne(
    { _id: ObjectId(req.query.id) },
    {
      $set: {
        eatenlist: updatedEatenlist,
        watchlist: updatedWatchlist,
      },
    }
  );

  res.status(200).json(updatedUser);
};

export default handler;
