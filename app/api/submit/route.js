import { MongoClient } from "mongodb";

const uri = "mongodb+srv://MALHAR:malharpat@archdata.esibp8q.mongodb.net/testdb?retryWrites=true&w=majority";
const dbName = "transportDB";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// POST: create/update submission
export async function POST(req) {
  try {
    const data = await req.json();
    if (!data) return new Response(JSON.stringify({ success: false, error: "No data received" }), { status: 400 });
    if (!data.gc_no) return new Response(JSON.stringify({ success: false, error: "GC Number is required" }), { status: 400 });

    const allFields = [
      "date","gc_no","goods_number",
      "consignor","consignor_address","consignor_gst","consignor_phone",
      "consignee","consignee_address","consignee_gst","consignee_phone",
      "destination","origin","vehicle_number","driver_name","eway_bill","trip_code",
      "no_of_packages","mode_of_packages","volume","actual_charge_weight",
      "invoice_number","invoice_date","invoice_value",
      "policy_number","insurance_value",
      "month","vehicle","delivery_date","detention_unloading","amount","billing_amount","thc_cost","percentage",
      "ath_payment_date","ath_amount","bth_payment_date","bth_amount",
      "vendor_name","pan_card",
      "pod_received_date","bill_submission_date","bill_invoice_date","bill_number","payment_received_date"
    ];

    const sanitizedData = {};
    allFields.forEach(f => { sanitizedData[f] = data[f] || ""; });
    sanitizedData._id = sanitizedData.gc_no;

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("submissions");

    await collection.updateOne({ _id: sanitizedData._id }, { $set: sanitizedData }, { upsert: true });

    return new Response(JSON.stringify({ success: true, id: sanitizedData._id }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

// GET: fetch by GC Number
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gc_no = searchParams.get("gc_no");
    if (!gc_no) return new Response(JSON.stringify({ success: false, error: "GC Number is required" }), { status: 400 });

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("submissions");

    const data = await collection.findOne({ _id: gc_no });
    if (!data) return new Response(JSON.stringify({ success: false, error: "No submission found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

// PUT: ping MongoDB to keep cluster alive
export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("submissions").findOne({});

    return new Response(JSON.stringify({ success: true, message: "MongoDB pinged successfully ✅" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
