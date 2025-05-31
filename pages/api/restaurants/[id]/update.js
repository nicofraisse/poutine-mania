import { connectToDatabase } from "../../../../lib/db";
import { isAdmin } from "../../../../lib/middleware/isAdmin";
import { normalizeUrl } from "../../../../lib/normalizeUrl";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = await client.db();

    if (req.body.website && !normalizeUrl(req.body.website)) {
      return res.status(400).json({ error: "L'URL du site est invalide" });
    }

    const updateData = {
      name: req.body.name,
      website: req.body.website,
      priceRange: req.body.priceRange,
      succursales: req.body.succursales,
      categories: req.body.categories,
      updatedAt: new Date(),
    };

    if (req.body.mainPhotos !== undefined) {
      if (Array.isArray(req.body.mainPhotos)) {
        const validMainPhotos = req.body.mainPhotos
          .slice(0, 3)
          .filter(
            (photo) => typeof photo === "string" && photo.trim().length > 0
          );

        updateData.mainPhotos = validMainPhotos;
      } else {
        return res.status(400).json({ error: "mainPhotos must be an array" });
      }
    }

    const updatedRestaurant = await db
      .collection("restaurants")
      .updateOne({ slug: req.query.id }, { $set: updateData });

    if (updatedRestaurant.matchedCount === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({
      success: true,
      modifiedCount: updatedRestaurant.modifiedCount,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default isAdmin(handler);
