import { ObjectId } from "mongodb";

// ==========================================
// SERVER-SIDE FUNCTIONS ONLY
// ==========================================

/**
 * Updates the main photos for a restaurant following the business rules:
 * - Maximum 3 main photos
 * - Never shift existing photos (preserve order)
 * - Only add photos if current count < 3
 *
 * @param {Object} db - MongoDB database instance
 * @param {string} restaurantId - Restaurant ID
 * @param {Array} newPhotoIds - Array of new photo IDs to potentially add
 * @returns {Object} - { success: boolean, addedCount: number, currentMainPhotos: Array }
 */
export const maybeUpdateRestaurantMainPhotos = async (
  db,
  restaurantId,
  newPhotoIds
) => {
  try {
    // Input validation
    if (!db || !restaurantId || !newPhotoIds || !Array.isArray(newPhotoIds)) {
      return {
        success: false,
        addedCount: 0,
        currentMainPhotos: [],
        error: "Invalid input parameters",
      };
    }

    // Get current restaurant data
    const restaurant = await db
      .collection("restaurants")
      .findOne({ _id: new ObjectId(restaurantId) });

    if (!restaurant) {
      return {
        success: false,
        addedCount: 0,
        currentMainPhotos: [],
        error: "Restaurant not found",
      };
    }

    // Get current main photos (ensure it's an array)
    const currentMainPhotos = Array.isArray(restaurant.mainPhotos)
      ? restaurant.mainPhotos
      : [];

    // If already at max capacity (3 photos), don't add any more (this is expected behavior)
    if (currentMainPhotos.length >= 3) {
      return {
        success: true,
        addedCount: 0,
        currentMainPhotos: currentMainPhotos,
      };
    }

    // Calculate how many photos we can add
    const remainingSlots = 3 - currentMainPhotos.length;
    const photosToAdd = newPhotoIds.slice(0, remainingSlots);

    // Create the updated main photos array (preserve existing order, append new ones)
    const updatedMainPhotos = [...currentMainPhotos, ...photosToAdd];

    // Update the restaurant document
    await db.collection("restaurants").updateOne(
      { _id: new ObjectId(restaurantId) },
      {
        $set: {
          mainPhotos: updatedMainPhotos,
          lastReviewDate: new Date(),
        },
      }
    );

    return {
      success: true,
      addedCount: photosToAdd.length,
      currentMainPhotos: updatedMainPhotos,
    };
  } catch (error) {
    console.error("Error updating restaurant main photos:", error);
    return {
      success: false,
      addedCount: 0,
      currentMainPhotos: [],
      error: error.message,
    };
  }
};

/**
 * Gets the current main photos for a restaurant from the database
 *
 * @param {Object} db - MongoDB database instance
 * @param {string} restaurantId - Restaurant ID
 * @returns {Array} - Array of main photo IDs (up to 3)
 */
export const getRestaurantMainPhotosFromDB = async (db, restaurantId) => {
  try {
    if (!db || !restaurantId) {
      return [];
    }

    const restaurant = await db
      .collection("restaurants")
      .findOne(
        { _id: new ObjectId(restaurantId) },
        { projection: { mainPhotos: 1 } }
      );

    return Array.isArray(restaurant?.mainPhotos) ? restaurant.mainPhotos : [];
  } catch (error) {
    console.error("Error getting restaurant main photos from DB:", error);
    return [];
  }
};
