const _ = require("lodash");

const generateRestaurantSlug = async (restaurantName, db) => {
  let slug = _.kebabCase(_.deburr(restaurantName));

  let existingRestaurant = await db
    .collection("restaurants")
    .findOne({ slug: slug });

  if (existingRestaurant) {
    let counter = 2;

    // Keep incrementing counter until a unique slug is found
    while (
      await db.collection("restaurants").findOne({ slug: `${slug}-${counter}` })
    ) {
      counter++;
    }

    slug = `${slug}-${counter}`;
  }

  return slug;
};

module.exports = { generateRestaurantSlug };
