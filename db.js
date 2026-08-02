const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/probashi";

let client;
let clientPromise;

if (!uri) {
  console.warn("Please add your Mongo URI to .env or environment variables");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

module.exports = {
  MongoClient,
  clientPromise,
  getDb: async (dbName) => {
    const client = await clientPromise;
    return client.db(dbName);
  }
};
