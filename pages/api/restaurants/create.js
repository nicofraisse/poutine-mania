import { connectToDatabase } from "../../../lib/db";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();
  const session = await getSession({ req });

  const { insertedId } = await db.collection("restaurants").insertOne({
    name: req.body.name,
    website: req.body.website,
    priceRange: req.body.priceRange,
    succursales: req.body.succursales,
    categories: req.body.categories,
    createdAt: new Date(),
    approved: !!session.user.isAdmin,
  });

  const data = await db.collection("restaurants").findOne({ _id: insertedId });
  res.status(200).json(data);
};

export default handler;
