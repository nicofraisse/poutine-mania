// Cache the connection (leads to login issue)

// import pkg from "mongodb";
// const { MongoClient } = pkg;

// let cachedClient = null;

// export async function connectToDatabase() {
//   console.log("THE CACHED CLIENT", cachedClient);
//   if (cachedClient) {
//     return cachedClient;
//   }

//   const client = await MongoClient.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     connectTimeoutMS: 30000,
//   });

//   console.log("THE CLIENT", client);

//   cachedClient = client;
//   return client;
// }

import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return client;
}

export async function createIndexes() {
  const client = await connectToDatabase();
  const db = client.db();

  // For pages/api/restaurants/index.js
  await db.collection("restaurants").createIndex({ name: "text" });
  await db.collection("reviews").createIndex({ restaurantId: 1 });

  // For [nextauth].js
  await db.collection("users").createIndex({ email: 1 });
  await db.collection("accounts").createIndex({ userId: 1 });

  // Existing indexes from previous response
  await db.collection("reviews").createIndex({ userId: 1 });
}
