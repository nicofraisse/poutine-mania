let processedCount = 0;
let updatedCount = 0;
let errorCount = 0;

print("Starting mainPhotos backfill migration...");
print("=====================================");
// eslint-disable-next-line no-undef
db.restaurants.find({}).forEach(function (restaurant) {
  try {
    processedCount++;

    let currentMainPhotos = Array.isArray(restaurant.mainPhotos)
      ? restaurant.mainPhotos
      : [];

    if (currentMainPhotos.length >= 3) {
      if (processedCount % 100 === 0) {
        print(
          `Processed ${processedCount} restaurants (${restaurant.name} - already has ${currentMainPhotos.length} photos)`
        );
      }
      return;
    }

    let remainingSlots = 3 - currentMainPhotos.length;
    // eslint-disable-next-line no-undef
    let reviewsWithPhotos = db.reviews
      .find({
        restaurantId: restaurant._id,
        photos: { $exists: true, $ne: [], $not: { $size: 0 } },
      })
      .sort({ createdAt: -1 });

    let availablePhotoIds = [];
    reviewsWithPhotos.forEach(function (review) {
      if (Array.isArray(review.photos)) {
        review.photos.forEach(function (photoId) {
          if (typeof photoId === "string" && photoId.trim().length > 0) {
            if (
              availablePhotoIds.indexOf(photoId) === -1 &&
              currentMainPhotos.indexOf(photoId) === -1
            ) {
              availablePhotoIds.push(photoId);
            }
          }
        });
      }
    });

    if (availablePhotoIds.length === 0) {
      if (processedCount % 100 === 0) {
        print(
          `Processed ${processedCount} restaurants (${restaurant.name} - no new photos available)`
        );
      }
      return;
    }

    let photosToAdd = availablePhotoIds.slice(0, remainingSlots);

    let updatedMainPhotos = currentMainPhotos.concat(photosToAdd);
    // eslint-disable-next-line no-undef
    let updateResult = db.restaurants.updateOne(
      { _id: restaurant._id },
      {
        $set: {
          mainPhotos: updatedMainPhotos,
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount > 0) {
      updatedCount++;
      print(
        `✓ Updated ${restaurant.name}: added ${photosToAdd.length} photos (now has ${updatedMainPhotos.length}/3)`
      );
    }

    if (processedCount % 100 === 0) {
      print(
        `Progress: ${processedCount} restaurants processed, ${updatedCount} updated`
      );
    }
  } catch (error) {
    errorCount++;
    print(`✗ Error processing restaurant ${restaurant.name}: ${error.message}`);
  }
});

print("\n=====================================");
print("Migration completed!");
print(`Total restaurants processed: ${processedCount}`);
print(`Restaurants updated: ${updatedCount}`);
print(`Errors encountered: ${errorCount}`);
print("=====================================");

print("\nPost-migration statistics:");
// eslint-disable-next-line no-undef
let stats = db.restaurants
  .aggregate([
    {
      $project: {
        name: 1,
        mainPhotosCount: {
          $cond: {
            if: { $isArray: "$mainPhotos" },
            then: { $size: "$mainPhotos" },
            else: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$mainPhotosCount",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
  .toArray();

stats.forEach(function (stat) {
  print(`Restaurants with ${stat._id} main photos: ${stat.count}`);
});
