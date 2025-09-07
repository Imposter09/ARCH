// testMongo.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://MALHAR:malharpat@archdata.esibp8q.mongodb.net/archdata?retryWrites=true&w=majority";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("archdata");
    const collection = db.collection("testCollection");

    // Insert a test document
    const insertResult = await collection.insertOne({
      name: "Malhar",
      purpose: "CMD test connection"
    });

    // Find it back
    const doc = await collection.findOne({ _id: insertResult.insertedId });

    console.log("✅ Connected and inserted document:");
    console.log(doc);

    await client.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

run();
