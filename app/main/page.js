"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
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
        setFormData({ gc_no: formData.gc_no }); // keep GC Number after submit
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (error) {
      setMessage("❌ Something went wrong: " + error.message);
    }
    setLoading(false);
  };

  const fetchGCData = async () => {
    if (!formData.gc_no) {
      setMessage("❌ Enter GC Number to fetch data");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/submit?gc_no=${formData.gc_no}`);
      const result = await res.json();

      if (result.success) {
        setFormData(result.data); // populate form
        setMessage("✅ Data loaded successfully!");
      } else {
        setMessage("❌ " + result.error);
      }
    } catch (error) {
      setMessage("❌ Something went wrong: " + error.message);
    }

    setLoading(false);
  };

  // ADD THIS ENTIRE FUNCTION: PDF Generation
  const generatePDF = async () => {
    setPdfLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Convert response to blob
        const blob = await res.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Arch-${formData.gc_no}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage("✅ PDF generated successfully!");
      } else {
        const error = await res.json();
        setMessage("❌ PDF Generation Error: " + error.error);
      }
    } catch (error) {
      setMessage("❌ pdf Something went wrong: " + error.message);
    }
    
    setPdfLoading(false);
  };

const inputClass =
  "peer block w-full rounded-xl border border-gray-300 px-3 pt-2 pb-2 text-sm text-gray-900 placeholder-transparent " +
  "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 focus:ring-purple-400 " +
  "transition duration-300 shadow-sm focus:shadow-lg";

  const sectionTitle = "text-lg font-semibold mb-4";
  
  

  return (
  <div
  className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4"
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
  <div
    className="w-full max-w-7xl bg-white shadow-lg rounded-2xl p-8"
    style={{ fontFamily: "'Poppins', sans-serif" }}
  >
    <div className="flex items-center mb-10 gap-4">
            <img
        src="/arch.png"   // notice the leading slash
        alt="Logo"
        className="w-25 h-30 object-contain flex justify-left"
        />
      <h1 className="text-3xl font-bold text-gray-800">
        Arch Freights
      </h1>
    
    </div>

        <div className="space-y-8">

          {/* 1. Basic Shipment Details */}
          <div>
            <h2 className={sectionTitle}>Basic Shipment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="text" name="date" value={formData.date || ""} onChange={handleChange} className={inputClass} />
              </div>
                <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">GC Number</label>
              <input
                type="text"
                name="gc_no"
                value={formData.gc_no || ""}
                onChange={handleChange}
                className={inputClass}
                maxLength={6}
                placeholder="Enter GC Number"
              />
            </div>
            
          </div>

            </div>
          </div>

          {/* NEW SECTION: Transport Mode and Service Type */}
          <div>
            <h2 className={sectionTitle}>Transport & Service Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Mode of Transport */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Mode of Transport</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode_of_transport"
                      value="Surface"
                      checked={formData.mode_of_transport === "Surface"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Surface</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode_of_transport"
                      value="Train"
                      checked={formData.mode_of_transport === "Train"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Train</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode_of_transport"
                      value="Air"
                      checked={formData.mode_of_transport === "Air"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Air</span>
                  </label>
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Service Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="service_type"
                      value="FTL"
                      checked={formData.service_type === "FTL"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">FTL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="service_type"
                      value="LTL"
                      checked={formData.service_type === "LTL"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">LTL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="service_type"
                      value="EXP"
                      checked={formData.service_type === "EXP"}
                      onChange={handleChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">EXP</span>
                  </label>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Additional Options</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="gst_payable_consignor"
                      checked={formData.gst_payable_consignor || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Consignor/Consignee</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="tbb_check"
                      checked={formData.tbb_check || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">TBB Check</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="to_pay_check"
                      checked={formData.to_pay_check || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">To Pay Check</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="paid_check"
                      checked={formData.paid_check || false}
                      onChange={handleCheckboxChange}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Paid Check</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Consignor Details */}
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

          {/* 3. Consignee Details */}
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

          {/* 4. Transport & Trip Details */}
          <div>
            <h2 className={sectionTitle}>Transport & Trip Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input type="text" name="destination" value={formData.destination || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <input type="text" name="origin" value={formData.origin || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <input type="text" name="vehicle_number" value={formData.vehicle_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                <input type="text" name="driver_name" value={formData.driver_name || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trip Code</label>
                <input type="text" name="trip_code" value={formData.trip_code || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 5. Package & Cargo Details */}
          <div>
            <h2 className={sectionTitle}>Package & Cargo Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">No. of Packages</label>
                <input type="text" name="no_of_packages" value={formData.no_of_packages || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode of Packages</label>
                <input type="text" name="mode_of_packages" value={formData.mode_of_packages || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Volume</label>
                <input type="text" name="volume" value={formData.volume || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Actual Charge Weight</label>
                <input type="text" name="actual_charge_weight" value={formData.actual_charge_weight || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 6. Invoice & Value Details */}
          <div>
            <h2 className={sectionTitle}>Invoice & Value Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input type="text" name="invoice_number" value={formData.invoice_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                <input type="text" name="invoice_date" value={formData.invoice_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Value</label>
                <input type="text" name="invoice_value" value={formData.invoice_value || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-way Bill</label>
                <input type="text" name="eway_bill" value={formData.eway_bill || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 7. Insurance & Policy Details */}
          <div>
            <h2 className={sectionTitle}>Insurance & Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                <input type="text" name="policy_number" value={formData.policy_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurance Value</label>
                <input type="text" name="insurance_value" value={formData.insurance_value || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 8. Billing & Delivery Details */}
          <div>
            <h2 className={sectionTitle}>Billing & Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <input type="text" name="month" value={formData.month || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <input type="text" name="vehicle" value={formData.vehicle || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                <input type="text" name="delivery_date" value={formData.delivery_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Detention/Unloading</label>
                <input type="text" name="detention_unloading" value={formData.detention_unloading || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="text" name="amount" value={formData.amount || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Billing Amount</label>
                <input type="text" name="billing_amount" value={formData.billing_amount || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">THC Cost</label>
                <input type="text" name="thc_cost" value={formData.thc_cost || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percentage</label>
                <input type="text" name="percentage" value={formData.percentage || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 9. Payment Tracking */}
          <div>
            <h2 className={sectionTitle}>Payment Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ATH Payment Date</label>
                <input type="text" name="ath_payment_date" value={formData.ath_payment_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ATH Amount</label>
                <input type="text" name="ath_amount" value={formData.ath_amount || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BTH Payment Date</label>
                <input type="text" name="bth_payment_date" value={formData.bth_payment_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BTH Amount</label>
                <input type="text" name="bth_amount" value={formData.bth_amount || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 10. Vendor Details */}
          <div>
            <h2 className={sectionTitle}>Vendor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input type="text" name="vendor_name" value={formData.vendor_name || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN Card</label>
                <input type="text" name="pan_card" value={formData.pan_card || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* 11. POD & Billing Workflow */}
          <div>
            <h2 className={sectionTitle}>POD & Billing Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">POD Received Date</label>
                <input type="text" name="pod_received_date" value={formData.pod_received_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Submission Date</label>
                <input type="text" name="bill_submission_date" value={formData.bill_submission_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Invoice Date</label>
                <input type="text" name="bill_invoice_date" value={formData.bill_invoice_date || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Number</label>
                <input type="text" name="bill_number" value={formData.bill_number || ""} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Received Date</label>
                <input type="text" name="payment_received_date" value={formData.payment_received_date || ""} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>
          <div>
          {/* Submit Button */}
            <button
              type="button"
              onClick={fetchGCData}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-600 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch"}
            </button> 
            </div>
<div>
  <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              disabled={pdfLoading}
            >
              {pdfLoading ? "Submitting" : "Submit"}
            </button>
</div>
<div>
            {/* ADD THIS BUTTON: PDF Generation */}
            <button
              type="button"
              onClick={generatePDF}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-red-600 hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              disabled={pdfLoading}
            >
              {pdfLoading ? "Generating PDF..." : "Generate PDF"}
            </button>
          </div>
          </div>
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </div>
      </div>
  );
}
