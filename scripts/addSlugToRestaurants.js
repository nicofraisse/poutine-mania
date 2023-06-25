const { MongoClient, ObjectId } = require("mongodb");
const { generateRestaurantSlug } = require("../lib/generateRestaurantSlug");

async function createSlugsForAllRestaurants() {
  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.DB_NAME);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Connect to the correct database

    // Fetch all the restaurants
    const restaurants = await db.collection("restaurants").find().toArray();

    // Iterate over each restaurant and create/update the slug
    for (let restaurant of restaurants) {
      const slug = await generateRestaurantSlug(restaurant.name, db);

      // Then update the current restaurant with the new slug
      await db
        .collection("restaurants")
        .updateOne({ _id: ObjectId(restaurant._id) }, { $set: { slug: slug } });
    }

    console.log("Slug creation/update process completed!");
    await client.close();
  } catch (error) {
    console.error(
      "An error occurred while creating/updating the slugs: ",
      error
    );
    await client.close();
  }
}

createSlugsForAllRestaurants();
