/**
 * Gets the primary main photo for a restaurant (index 0)
 * This is used for thumbnails, SEO, and primary display
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {string|null} - Photo ID or null if no main photo exists
 */
export const getMainPhoto = (restaurant) => {
  try {
    if (!restaurant) {
      return null;
    }

    if (
      !Array.isArray(restaurant.mainPhotos) ||
      restaurant.mainPhotos.length === 0
    ) {
      return null;
    }

    return restaurant.mainPhotos[0] || null;
  } catch (error) {
    console.error("Error getting main photo:", error);
    return null;
  }
};

/**
 * Gets all main photos for a restaurant (up to 3)
 * This is used for restaurant headers and gallery displays
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {Array} - Array of photo IDs (empty array if none exist)
 */
export const getMainPhotos = (restaurant) => {
  try {
    if (!restaurant) {
      return [];
    }

    if (!Array.isArray(restaurant.mainPhotos)) {
      return [];
    }

    return [...restaurant.mainPhotos];
  } catch (error) {
    console.error("Error getting main photos:", error);
    return [];
  }
};

/**
 * Checks if a restaurant has any main photos
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {boolean} - True if restaurant has at least one main photo
 */
export const hasMainPhotos = (restaurant) => {
  const mainPhotos = getMainPhotos(restaurant);
  return mainPhotos.length > 0;
};

/**
 * Gets the count of main photos for a restaurant
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {number} - Number of main photos (0-3)
 */
export const getMainPhotosCount = (restaurant) => {
  const mainPhotos = getMainPhotos(restaurant);
  return mainPhotos.length;
};

/**
 * Checks if a restaurant can accept more main photos
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {boolean} - True if restaurant can accept more main photos
 */
export const canAddMoreMainPhotos = (restaurant) => {
  const count = getMainPhotosCount(restaurant);
  return count < 3;
};

/**
 * Gets how many more main photos can be added to a restaurant
 *
 * @param {Object} restaurant - Restaurant object
 * @returns {number} - Number of remaining slots (0-3)
 */
export const getRemainingMainPhotoSlots = (restaurant) => {
  const count = getMainPhotosCount(restaurant);
  return Math.max(0, 3 - count);
};
