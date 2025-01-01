import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  console.log("[LEGACY] Connecting to DB...");
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("[LEGACY] Connected to DB");

  return client;
}
