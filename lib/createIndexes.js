import { connectToDatabase } from "./db";

export async function createIndexes() {
  const client = await connectToDatabase();
  const db = client.db();

  // For pages/api/restaurants/index.js
  await db.collection("restaurants").createIndex({ name: "text" });
  await db.collection("restaurants").createIndex({ slug: 1 });
  await db.collection("reviews").createIndex({ restaurantId: 1 });

  // For [nextauth].js
  await db.collection("users").createIndex({ email: 1 });
  await db.collection("accounts").createIndex({ userId: 1 });

  // Existing indexes from previous response
  await db.collection("reviews").createIndex({ userId: 1 });
}
