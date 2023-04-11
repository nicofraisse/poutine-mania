import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function database(req, _, next) {
  if (!cached.promise) {
    console.log("No cached database found. Connecting...");
    cached.promise = mongoClient.connect().then((client) => {
      return {
        client,
        db: client.db(process.env.MONGODB_DB),
      };
    });
    cached.conn = await cached.promise;
    console.log(`Connection to database successful`);
  }

  req.dbClient = cached.conn.client;
  req.db = cached.conn.db;

  return next();
}

export default database;
