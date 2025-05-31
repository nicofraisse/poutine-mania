import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";
import formidable from "formidable";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { maybeUpdateRestaurantMainPhotos } from "../../../lib/restaurantMainPhotos.api";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      const form = new formidable.IncomingForm();
      form.multiples = true;

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(400).json({ error: "Error parsing the form data" });
          return;
        }

        try {
          const client = await connectToDatabase();
          const db = await client.db();

          const photos = [];
          for (const key in files) {
            if (key.startsWith("photos[")) {
              photos.push(files[key]);
            }
          }

          const cloudinaryPublicIds =
            photos.length > 0 ? await uploadToCloudinary(photos) : [];

          const {
            finalRating,
            friesRating,
            cheeseRating,
            sauceRating,
            portionRating,
            comment,
            restaurantId,
          } = fields;

          await db.collection("reviews").insertOne({
            finalRating: finalRating && Number(finalRating),
            friesRating: friesRating && Number(friesRating),
            cheeseRating: cheeseRating && Number(cheeseRating),
            sauceRating: sauceRating && Number(sauceRating),
            portionRating: portionRating && Number(portionRating),
            comment,
            restaurantId: new ObjectId(restaurantId),
            userId: new ObjectId(session.user._id),
            photos: cloudinaryPublicIds,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          if (cloudinaryPublicIds && cloudinaryPublicIds.length > 0) {
            const mainPhotosResult = await maybeUpdateRestaurantMainPhotos(
              db,
              restaurantId,
              cloudinaryPublicIds
            );

            if (process.env.NODE_ENV === "development") {
              console.log("Main photos update result:", mainPhotosResult);
            }
          }

          let updatedEatenlist = session.user.eatenlist || [];
          let updatedWatchlist = session.user.watchlist || [];

          if (!updatedEatenlist.includes(restaurantId)) {
            updatedEatenlist.push(restaurantId);
          }

          updatedWatchlist = updatedWatchlist.filter((r) => r !== restaurantId);

          await db.collection("users").updateOne(
            { _id: new ObjectId(session.user._id) },
            {
              $set: {
                eatenlist: updatedEatenlist,
                watchlist: updatedWatchlist,
              },
            }
          );

          // Get updated reviews data
          const data = await db.collection("reviews").find({}).toArray();

          res.status(200).json({
            data,
            message: "Review added successfully",
          });
        } catch (error) {
          console.error("Error processing review:", error);
          res.status(500).json({
            error: "Internal server error while processing review",
          });
        }
      });
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
