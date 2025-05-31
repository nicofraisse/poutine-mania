import { connectToDatabase } from "../../../lib/db";
import { ObjectId } from "mongodb";
import formidable from "formidable";
import { uploadToCloudinary } from "../../../lib/uploadToCloudinary";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      const form = new formidable.IncomingForm();
      form.multiples = true; // Allow multiple files with the same field name

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(400).json({ error: "Error parsing the form data" });
          return;
        }
        const client = await connectToDatabase();
        const db = await client.db();

        const photos = [];
        for (const key in files) {
          if (key.startsWith("photos[")) {
            photos.push(files[key]);
          }
        }
        const publicIds = await uploadToCloudinary(photos);

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
          photos: publicIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const data = await db.collection("reviews").find({}).toArray();
        const restaurant = await db
          .collection("restaurants")
          .find({ _id: new ObjectId(restaurantId) });

        if (
          (publicIds && !restaurant.mainPhotos) ||
          restaurant?.mainPhotos?.length < 3
        ) {
          const updatedMainPhotos = restaurant?.mainPhotos || [];
          publicIds.forEach((photo) => {
            if (updatedMainPhotos.length < 3) {
              updatedMainPhotos.push(photo);
            }
          });
          await db.collection("restaurants").updateOne(
            { _id: ObjectId(restaurantId) },
            {
              $set: {
                lastReviewDate: new Date(),
                mainPhotos: updatedMainPhotos,
              },
            }
          );
        }

        let updatedEatenlist = session.user.eatenlist;
        let updatedWatchlist = session.user.watchlist;

        if (!updatedEatenlist?.includes(restaurantId)) {
          updatedEatenlist.push(restaurantId);
        }

        updatedWatchlist = updatedWatchlist.filter((r) => r !== restaurantId);

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
      });
    } else {
      res.status(403).json("unauthorized");
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
