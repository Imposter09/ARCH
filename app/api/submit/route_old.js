import { MongoClient } from "mongodb";

const uri = "mongodb+srv://MALHAR:malharpat@archdata.esibp8q.mongodb.net/archdata?retryWrites=true&w=majority";
const dbName = "transportDB";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data) {
      return new Response(JSON.stringify({ success: false, error: "No data received" }), { status: 400 });
    }

    if (!data.gc_no) {
      return new Response(JSON.stringify({ success: false, error: "GC Number is required" }), { status: 400 });
    }

    // All fields of the form
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

    // Fill missing fields with empty string
    const sanitizedData = {};
    allFields.forEach((field) => {
      sanitizedData[field] = data[field] || "";
    });

    // Use GC Number as _id
    sanitizedData._id = sanitizedData.gc_no;

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection("submissions");

    // Upsert ensures uniqueness by GC Number
    await collection.updateOne(
      { _id: sanitizedData._id },
      { $set: sanitizedData },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true, id: sanitizedData._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
