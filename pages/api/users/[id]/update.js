import formidable from "formidable";
import { getSession } from "next-auth/client";
import { uploadToCloudinary } from "lib/uploadToCloudinary";
import { ObjectId } from "mongodb";
import nextConnect from "next-connect";
import { database } from "middleware/database";

const handler = nextConnect();
handler.use(database);

handler.patch(async (req, res) => {
  if (req.method !== "PATCH") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const userId = ObjectId(req.query.id);

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    const db = req.db;

    if (err) {
      res.status(500).json({ message: "Failed to parse form data" });
      return;
    }

    const { name, bio } = fields;

    const photos = [];
    for (const key in files) {
      if (key.startsWith("avatar")) {
        photos.push(files[key]);
      }
    }

    let newPublicIds = [];
    if (photos.length > 0) {
      newPublicIds = await uploadToCloudinary(photos);
    }

    const usersCollection = db.collection("users");

    try {
      await usersCollection.updateOne(
        { _id: userId },
        {
          $set: {
            name: name,
            bio: bio || "",
            image: newPublicIds[0],
          },
        }
      );

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating the user" });
    }
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
