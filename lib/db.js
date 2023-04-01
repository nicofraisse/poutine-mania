import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  console.log("[LEGACY] Connecting to DB...");
  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("[LEGACY] Connected to DB");

  return client;
}
