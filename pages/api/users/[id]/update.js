import formidable from "formidable";
import { uploadToCloudinary } from "lib/uploadToCloudinary";
import nextConnect from "next-connect";
import { database } from "middleware/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export const config = { api: { bodyParser: false } };

const handler = nextConnect();
handler.use(database);

handler.patch(async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 1) Authenticate
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const db = req.db;
  const slug = req.query.id;

  // 2) Load the target user
  const target = await db.collection("users").findOne({ slug });
  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  // 3) must be admin OR editing your own profile
  const youAreOwner = session.user.userId === target._id.toString();
  if (!session.user.isAdmin && !youAreOwner) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // 4) Parse multipart
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Failed to parse form data" });
    }

    const { name, bio, avatar: avatarStringKey } = fields;

    // 5) Handle avatar upload
    let newPublicIds = [];
    if (avatarStringKey && avatarStringKey !== "null") {
      newPublicIds.push(avatarStringKey);
    } else {
      const photos = Object.keys(files)
        .filter((k) => k.startsWith("avatar"))
        .map((k) => files[k]);
      if (photos.length > 0) {
        newPublicIds = await uploadToCloudinary(photos);
      }
    }

    // 6) Update only safe fields
    try {
      await db.collection("users").updateOne(
        { slug },
        {
          $set: {
            name,
            bio: bio || "",
            image: newPublicIds[0] || target.image,
          },
        }
      );
      res.status(200).json({ message: "User updated successfully" });
    } catch {
      res.status(500).json({ message: "Error updating the user" });
    }
  });
});

export default handler;
