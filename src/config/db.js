import { MongoClient, ServerApiVersion } from "mongodb";

let client;
let database;

export async function getDb() {
  if (database) return database;

  client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  database = client.db(process.env.DB_NAME || "axleway");
  return database;
}

export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

