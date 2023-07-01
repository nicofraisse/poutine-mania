const { MongoClient, ObjectId } = require("mongodb");
const { generateSlug } = require("../lib/generateSlug");

async function createSlugsForAllUsers() {
  const client = await MongoClient.connect("process.env.MONGO_URI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.DB_NAME);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Connect to the correct database

    // Fetch all the users
    const users = await db.collection("users").find().toArray();

    // Iterate over each user and create/update the slug
    for (let user of users) {
      const slug = await generateSlug(user.name, db, "users");

      // Then update the current user with the new slug
      await db
        .collection("users")
        .updateOne({ _id: ObjectId(user._id) }, { $set: { slug: slug } });
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

createSlugsForAllUsers();
