import { MongoClient } from "mongodb";

async function createIndexes() {
  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(process.env.DB_NAME);

  // For pages/api/restaurants/index.js
  await db.collection("restaurants").createIndex({ name: "text" });
  await db.collection("reviews").createIndex({ restaurantId: 1 });

  // For [nextauth].js
  await db.collection("users").createIndex({ email: 1 });
  await db.collection("accounts").createIndex({ userId: 1 });

  // Existing indexes from previous response
  await db.collection("reviews").createIndex({ userId: 1 });

  console.log("Indexes created successfully.");
  await client.close();
}

createIndexes().catch((error) => {
  console.error("Error setting up indexes:", error);
  process.exit(1);
});
