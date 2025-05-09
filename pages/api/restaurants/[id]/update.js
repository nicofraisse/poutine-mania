import { connectToDatabase } from "lib/db";
import { isAdmin } from "../../../../lib/middleware/isAdmin";

const handler = async (req, res) => {
  const client = await connectToDatabase();
  const db = await client.db();

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
