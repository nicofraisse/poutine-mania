import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db(); // Get fresh db reference inside try block
    const session = await getServerSession(req, res, authOptions);

    // Validate request
    if (!session || session.user._id.toString() !== req.query.id) {
      return res.status(403).json({ message: "unauthorized" });
    }
    if (!req.body.type || !["add", "remove"].includes(req.body.type)) {
      return res
        .status(400)
        .json({ message: "Missing or wrong type (add or remove)" });
    }
    if (!req.body.restaurantId) {
      return res.status(400).json({ message: "Missing restaurant id" });
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
  } catch (error) {
    console.error("Error updating watchlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
