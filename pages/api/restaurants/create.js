import nextConnect from "next-connect";
import { database } from "middleware/database";
import { generateSlug } from "../../../lib/generateSlug";
import { getServerSession } from "next-auth";

const handler = nextConnect();

handler.use(database);

handler.post(async (req, res) => {
  const db = req.db;
  const session = await getServerSession(req, res, authOptions);

  const slug = await generateSlug(req.body.name, db, "restaurants");

  const { insertedId } = await db.collection("restaurants").insertOne({
    name: req.body.name,
    website: req.body.website,
    priceRange: req.body.priceRange,
    succursales: req.body.succursales,
    categories: req.body.categories,
    createdAt: new Date(),
    approved: !!session.user.isAdmin,
    creator: session.user,
    slug,
  });

  const data = await db.collection("restaurants").findOne({ _id: insertedId });
  res.status(200).json({ restaurant: data });
});

export default handler;
