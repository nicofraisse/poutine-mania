import { ObjectId } from "mongodb";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../../lib/db";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });
  // Validate request
  if (!session || session.user._id !== req.query.id) {
    res.status(403).json({ message: "unauthorized" });
    return;
  }
  if (!req.body.type || !["add", "remove"].includes(req.body.type)) {
    res.status(400).json({ message: "Missing or wrong type (add or remove)" });
    return;
  }
  if (!req.body.restaurantId) {
    res.status(400).json({ message: "Missing restaurant id" });
    return;
  }

  // Create updated watchlist
  let updatedEatenlist = session.user.eatenlist;

  let updatedWatchlist = session.user.watchlist
    ? [...session.user.watchlist]
    : [];
  if (req.body.type === "add") {
    updatedEatenlist = updatedEatenlist.filter(
      (r) => r !== req.body.restaurantId
    );
    updatedWatchlist.push(req.body.restaurantId);
  } else if (req.body.type === "remove") {
    updatedWatchlist = updatedWatchlist.filter(
      (r) => r !== req.body.restaurantId
    );
  }

  // Update user's watchlist
  const updatedUser = await db.collection("users").updateOne(
    { _id: ObjectId(req.query.id) },
    {
      $set: {
        watchlist: updatedWatchlist,
        eatenlist: updatedEatenlist,
      },
    }
  );

  res.status(200).json(updatedUser);
};

export default handler;
