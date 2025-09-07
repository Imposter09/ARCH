"use client";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Submitted successfully!");
        setFormData({});
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Something went wrong."+  error);
    }
    setLoading(false);
  };

  const inputClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm";

  const sectionTitle = "text-lg font-semibold mb-4";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Transport Data Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* General Info */}
          <div>
            <h2 className={sectionTitle}>General Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={formData.date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">G C No</label>
                <input type="text" name="gc_no" maxLength={6} value={formData.gc_no || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Consignor */}
          <div>
            <h2 className={sectionTitle}>Consignor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consignor</label>
                <input type="text" name="consignor" value={formData.consignor || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="consignor_address" value={formData.consignor_address || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GST</label>
                <input type="text" name="consignor_gst" value={formData.consignor_gst || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="consignor_phone" value={formData.consignor_phone || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Consignee */}
          <div>
            <h2 className={sectionTitle}>Consignee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Consignee</label>
                <input type="text" name="consignee" value={formData.consignee || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="consignee_address" value={formData.consignee_address || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GST</label>
                <input type="text" name="consignee_gst" value={formData.consignee_gst || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" name="consignee_phone" value={formData.consignee_phone || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Transport Details */}
          <div>
            <h2 className={sectionTitle}>Transport Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode of Transport</label>
                <input type="text" name="mode_of_transport" value={formData.mode_of_transport || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <input type="text" name="service_type" value={formData.service_type || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode of Packages</label>
                <input type="text" name="mode_of_packages" value={formData.mode_of_packages || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">No of Packages</label>
                <input type="text" name="no_of_packages" value={formData.no_of_packages || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Volume (LxBxH)</label>
                <input type="text" name="volume" value={formData.volume || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Actual Charge / Weight</label>
                <input type="text" name="actual_charge_weight" value={formData.actual_charge_weight || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input type="text" name="driver_name" value={formData.driver_name || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Invoice & Billing */}
          <div>
            <h2 className={sectionTitle}>Invoice & Billing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input type="text" name="invoice_number" value={formData.invoice_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                <input type="date" name="invoice_date" value={formData.invoice_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Value</label>
                <input type="text" name="invoice_value" value={formData.invoice_value || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Policy & Insurance */}
          <div>
            <h2 className={sectionTitle}>Policy & Insurance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                <input type="text" name="policy_number" value={formData.policy_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Policy Date</label>
                <input type="date" name="policy_date" value={formData.policy_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurance Value</label>
                <input type="text" name="insurance_value" value={formData.insurance_value || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
}
