const _ = require("lodash");

const generateSlug = async (name, db, collection) => {
  let slug = _.kebabCase(_.deburr(name));

  let existingItem = await db.collection(collection).findOne({ slug: slug });

  if (existingItem) {
    let counter = 2;

    // Keep incrementing counter until a unique slug is found
    while (
      await db.collection(collection).findOne({ slug: `${slug}-${counter}` })
    ) {
      counter++;
    }

    slug = `${slug}-${counter}`;
  }

  return slug;
};

module.exports = { generateSlug };
