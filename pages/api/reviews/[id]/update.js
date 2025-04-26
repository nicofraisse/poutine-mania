import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import formidable from "formidable";
import { connectToDatabase } from "../../../../lib/db";
import { authOptions } from "../../auth/[...nextauth]";
import { uploadToCloudinary } from "../../../../lib/uploadToCloudinary";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // 1. Auth guard
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const { userId: sessionUserId, isAdmin } = session.user;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Parse form
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error parsing form data" });
    }

    const client = await connectToDatabase();
    const db = client.db();

    try {
      // 3. Load the review and check ownership/admin
      const reviewId = new ObjectId(req.query.id);
      const review = await db.collection("reviews").findOne({ _id: reviewId });

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      const ownerId = review.userId.toString();
      if (!isAdmin && ownerId !== sessionUserId.toString()) {
        return res.status(403).json({ error: "Not allowed" });
      }

      // 4. Handle file uploads
      const photosToUpload = Object.keys(files)
        .filter((k) => k.startsWith("photos["))
        .map((k) => files[k]);

      const existingPublicIds = Array.from(
        { length: 5 },
        (_, i) => fields[`photos[${i}]`]
      ).filter(Boolean);
      const newPublicIds = await uploadToCloudinary(photosToUpload);

      // 5. Build update doc
      const {
        finalRating,
        friesRating,
        cheeseRating,
        sauceRating,
        portionRating,
        comment,
      } = fields;

      const updateDoc = {
        finalRating: finalRating ? Number(finalRating) : undefined,
        friesRating: friesRating ? Number(friesRating) : undefined,
        cheeseRating: cheeseRating ? Number(cheeseRating) : undefined,
        sauceRating: sauceRating ? Number(sauceRating) : undefined,
        portionRating: portionRating ? Number(portionRating) : undefined,
        comment: comment || "",
        photos: [...existingPublicIds, ...newPublicIds],
      };

      // 6. Update
      const result = await db
        .collection("reviews")
        .updateOne({ _id: reviewId }, { $set: updateDoc });

      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    } finally {
      client.close();
    }
  });
}
