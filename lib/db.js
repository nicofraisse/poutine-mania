import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db().admin().ping();
      return cachedClient;
    } catch (error) {
      console.log("Connection lost, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }

  console.log("Connecting to DB...");

  const client = new MongoClient(process.env.MONGO_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 10000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    tls: true,
    tlsAllowInvalidCertificates: false,
  });

  await client.connect();
  console.log("Connected to DB");

  cachedClient = client;
  cachedDb = client.db();

  return cachedClient;
}
