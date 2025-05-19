import { connectToDatabase } from "lib/db";
import { isAdmin } from "../../../../lib/middleware/isAdmin";
import { normalizeUrl } from "../../../../lib/normalizeUrl";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

  if (req.body.website && !normalizeUrl(req.body.website)) {
    return res.status(400).json({ error: "L'URL du site est invalide" });
  }

  const updatedRestaurant = await db.collection("restaurants").updateOne(
    { slug: req.query.id },
    {
      $set: {
        name: req.body.name,
        website: req.body.website,
        priceRange: req.body.priceRange,
        succursales: req.body.succursales,
        categories: req.body.categories,
        updatedAt: new Date(),
      },
    }
  );
  res.status(200).json(updatedRestaurant);
};

export default isAdmin(handler);
