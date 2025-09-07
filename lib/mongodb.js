// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://MALHAR:malharpat@archdata.esibp8q.mongodb.net/testdb?retryWrites=true&w=majority";
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;
export default clientPromise;