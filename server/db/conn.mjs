import "../loadEnvironment.mjs";
import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB Atlas");
} catch (err) {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
}

const db = conn.db(process.env.DB_NAME || "blog");
export default db;
