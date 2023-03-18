import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../lib/db";
import formidable from "formidable";
import { uploadToCloudinary } from "../../../../lib/uploadToCloudinary";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      const {
        finalRating,
        friesRating,
        cheeseRating,
        sauceRating,
        portionRating,
        comment,
      } = fields;

      if (err) {
        res.status(400).json({ error: "Error parsing the form data" });
        return;
      }

      const client = await connectToDatabase();
      const db = await client.db();

      // Check if new photos are provided
      console.log(fields);
      const photos = [];
      for (const key in files) {
        console.log({ key });
        if (key.startsWith("photos[")) {
          console.log("pushing", key);
          photos.push(files[key]);
        }
      }

      const alreadyUploadedPublicIds = Array.from(
        { length: 5 },
        (_, i) => fields[`photos[${i}]`]
      ).filter(Boolean);

      const newPublicIds = await uploadToCloudinary(photos);

      console.log("new", newPublicIds);

      // ... Rest of the handler code
      const updatedReview = await db.collection("reviews").updateOne(
        { _id: ObjectId(req.query.id) },
        {
          $set: {
            finalRating: finalRating && Number(finalRating),
            friesRating: friesRating && Number(friesRating),
            cheeseRating: cheeseRating && Number(cheeseRating),
            sauceRating: sauceRating && Number(sauceRating),
            portionRating: portionRating && Number(portionRating),
            comment: comment,
            photos: [...alreadyUploadedPublicIds, ...newPublicIds],
          },
        }
      );
      res.status(200).json(updatedReview);
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export const config = {
  api: {
    bodyParser: false, // required to parse multipart/form-data
  },
};

export default handler;
