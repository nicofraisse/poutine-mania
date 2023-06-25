const { MongoClient, ObjectId } = require("mongodb");
const { generateRestaurantSlug } = require("../lib/generateRestaurantSlug");

async function createSlugsForAllRestaurants() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@poutinemania-dev-cluste.x1igu6q.mongodb.net/poutinemania-dev?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const db = client.db("poutinemania-dev");

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
  } catch (error) {
    console.error(
      "An error occurred while creating/updating the slugs: ",
      error
    );
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

createSlugsForAllRestaurants();
