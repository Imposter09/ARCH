// app/api/generate-pdf/route.js
import jsPDF from 'jspdf';
export async function POST(request) {
  try {
    const formData = await request.json();
    
    if (!formData) {
      return Response.json({ error: 'No data received' }, { status: 400 });
    }

    // Create PDF with landscape orientation and A4 format
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'  
    });

    // Terms and conditions text
    const tm1 = '1) The Company shall not be liable for any leakage, breakage, shortage due to weather or the quality of packing which could not with stand the normal transit Hazards. The consignor is responsible for proper packing and all the goods will be carried at owner risk only. 2) The goods will be delivered to the consignee, against payment of our dues. 3)The company shall not be responsible for delay in transit due to break down, strike and any other';
    const tm2 = 'cause which is beyond in its control, on en-route. 4) The consignor (or) consignee will be responsible for the consignment, detained at check-post, due to improper documents. 5) If any difference is found in weight or consignment, at the time of delivery, the extra charge will be collected proportionately either at booking point (or) at destination.6) By chance, if any loaded truck faces any natural disaster, on en-route-the company ';
    const tm3 = "shall not be responsible for that. 7) The company shall only hold the liability to deliver the goods to the party, whose name is mentioned in consignee's column.  8) The transport operator shall have the right to entrust the goods to any other lorry or service for transport. In the event of the goods being so entrusted by the transport operator to another carrier, the other carrier, shall as between the consignor, consignee and the ";
    const tm4 = "transport operator be deemed to the transport operator's, agent so that the transport operator shall not withstanding the delivery of the goods to the other carrier continue to be responsible for the safety of the goods and for their due delivery at their destination. 9) Consignor/ consignee has to insure the goods against all transit risks like theft, pilferage and non delivery.";
    const tm5 = '10) Declaration by the consignor "I have solemnly declared to the transport operator and all concerned that the particulars of the consignment mentioned in the lorry receipt are true and correct and correspond to the entries and descriptions in our books for account".';
    const tm6 = 'This is a non negotiable way bill, standard conditions of carriage are given on reserve of the consignor copy,liabilityo rs -1000/- only. We carry under the GTA/Carrier Act';

    // Set line width and create border
    pdf.setLineWidth(0.2);
    pdf.rect(5.0, 4.0, pdf.internal.pageSize.width - 10.0, pdf.internal.pageSize.height - 10.0);

    
    // Load images from public folder or URL and convert to base64
   // ✅ Always resolve the correct domain (works on localhost & Vercel)
const { origin: baseUrl } = new URL(request.url);

async function urlToBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error("Image load error:", err.message);
    return null; // return null if image fails, so PDF can still generate
  }
}

    // Load images
    const archBase64 = await urlToBase64(`${baseUrl}/arch.png`);
    const signBase64 = await urlToBase64(`${baseUrl}/sign.png`);

    // Add images to PDF
    pdf.addImage(archBase64, "PNG", 5, -3, 35, 35);   // Logo
    pdf.addImage(signBase64, "PNG", 220, 125, 25, 25); // Signature

    // Company Header
    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ARCH FREIGHTS PVT LTD', 46, 12);

    // Header details
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CONSIGNOR / POD', 129, 8);
    pdf.text('CONSIGNEE / A / C', 129, 15);
    pdf.text('- COPY', 129, 21);

    // GC Number section
    pdf.setFontSize(10);
    pdf.text('GC No.', 160.4, 11);
    pdf.setFontSize(21);
    pdf.text(formData.gc_no || '', 160.4, 19);

    // Bank Details
    pdf.setFontSize(10);
    pdf.text('Bank Details', 172, 37);
    pdf.text('Bank : AXIS BANK', 172, 44);
    pdf.text('Account No. : 923020006442219', 172, 51);
    pdf.text('IFSC Code : UTIB0004888', 172, 58);

    // Company Address
    pdf.setFontSize(8);
    pdf.text('Mailing Add: 10/4 Navsangeeta , St. Gabriel Rd', 46, 17);
    pdf.text('Behind Paradise Cinema, Mahim Mumbai-400016', 46, 21);
    
    pdf.setFontSize(6);
    pdf.text('Regd :Jogeshwari(E) Mumbai-400 060', 37, 25);
    pdf.text('PAN: AAYCA0997R', 76, 25);
    pdf.text('GST: 27AAYCA0997R1ZD', 94, 25);

    // Agreement text
    pdf.setFontSize(6.5);
    pdf.text("I/We agree to the terms & conditions printed below consignor copy &", 80, 114);
    pdf.text("declares that contents of the waybill are true & correct", 80, 119);

    // Consignor Details
    pdf.setFontSize(8);
    pdf.text('Consignor : ' + (formData.consignor || ''), 7, 32);
    pdf.text('Address : ', 7, 37);
    pdf.text('Phone No. : ' + (formData.consignor_phone || ''), 7, 57);
    pdf.text('GST : ' + (formData.consignor_gst || ''), 7, 62);

    // Invoice Details
    pdf.text('Invoice No. : ' + (formData.invoice_number || ''), 7, 72);
    pdf.text('Invoice Value : ' + (formData.invoice_value || ''), 7, 82);
    pdf.text('Invoice Date : ' + (formData.invoice_date || ''), 7, 92);
    pdf.text('Eway Bill No. : ' + (formData.eway_bill || ''), 7, 102);

    // Consignee Details
    pdf.text('Consignee : ' + (formData.consignee || ''), 87, 32);
    pdf.text('Address : ', 87, 37);
    pdf.text('Phone No. : ' + (formData.consignee_phone || ''), 87, 57);
    pdf.text('Consignee GST : ' + (formData.consignee_gst || ''), 87, 62);

    // Right side details
    pdf.text('Date : ' + (formData.date || ''), 232, 12);
    pdf.text('Origin : ' + (formData.origin || ''), 232, 22);
    pdf.text('Destination : ' + (formData.destination || ''), 232, 32);
    pdf.text('Trip Code : ' + (formData.trip_code || ''), 232, 42);
    pdf.text('Mode of Service : ' + (formData.service_type || ''), 232, 52);
    pdf.text('GST Payable By : ' + (formData.gst_payable_consignor || ''), 232, 62);

    // Transport Details
    pdf.text('Vehicle No. : ' + (formData.vehicle_number || ''), 120, 82);
    pdf.text('Mode of Transport : ' + (formData.mode_of_transport || ''), 120, 72);
    pdf.text('Driver Name : ' + (formData.driver_name || ''), 120, 92);
    pdf.text('Driver Sign / Thumb : ', 120, 102);

    // Package Details
    pdf.text('Mode of Packages : ' + (formData.mode_of_packages || ''), 68, 72);
    pdf.text('No. of Packages : ' + (formData.no_of_packages || ''), 68, 82);
    pdf.text('Vol-L X B X H : ' + (formData.volume || ''), 68, 92);
    pdf.text('Actual / Charge Weight : ' + (formData.actual_charge_weight || ''), 68, 102);

    // Insurance Details
    pdf.text('Insurance - At Owners Risk', 7, 117);
    pdf.text('Policy No. : ' + (formData.policy_number || ''), 7, 127);
    pdf.text('Policy Date : ' + (formData.policy_date || ''), 7, 137);
    pdf.text('Insurance Value : ' + (formData.insurance_value || ''), 7, 147);

    // Charges Table Headers
    pdf.text('Charges', 188, 70);
    pdf.text('Paid', 220, 70);
    pdf.text('To Pay', 247, 70);
    pdf.text('TBB', 276, 70);

    // Charges Table Rows
    pdf.text('Freights', 190, 77);
    pdf.text('Hamali', 190, 85);
    pdf.text('GC Charges', 190, 93);
    pdf.text('Sub Total', 190, 101);
    pdf.text('GST', 190, 109);

    // Loading/Unloading Time
    pdf.text('Loading Time', 7, 156);
    pdf.text('Unloading Time', 47, 156);

    // Signature sections
    pdf.text('For ARCH FREIGHTS PVT LTD', 202, 132);
    pdf.text('Stamp & Sign', 202, 150);
    pdf.text('Name and Sign of Consignor', 82, 132);
    pdf.text('Received By : ', 82, 150);
    pdf.text('Name : ', 82, 157);
    pdf.text('Contact No. : ', 82, 164);

    // Grand Total
    pdf.setFont('helvetica', 'bold');
    pdf.text('Grand Total', 187, 122);

    // Terms & Conditions
    pdf.setFont('helvetica', 'normal');
    pdf.text('TERMS & CONDITIONS', 7, 176);
    pdf.text('Condition of Carriage', 7, 170);
    pdf.text('ALL DISPUTES SUBJECT TO MUMBAI JURISDICTION', 112, 170);

    // Draw all the lines for the form structure
    // Top horizontal lines
    pdf.line(5, 27, 228, 27);
    pdf.line(228, 17, 292, 17);
    pdf.line(228, 27, 292, 27);
    pdf.line(228, 37, 292, 37);
    pdf.line(228, 47, 292, 47);
    pdf.line(228, 57, 292, 57);

    // Vertical lines
    pdf.line(228, 4, 228, 67);
    pdf.line(135, 67, 292, 67);
    pdf.line(125, 4, 125, 27);
    pdf.line(158, 4, 158, 27);
    pdf.line(5, 67, 135, 67);
    pdf.line(170, 27, 170, 67);
    pdf.line(180, 67, 180, 127);
    pdf.line(210, 67, 210, 127);
    pdf.line(200, 127, 200, 167);
    pdf.line(238, 67, 238, 127);
    pdf.line(266, 67, 266, 127);
    pdf.line(5, 111, 180, 111);
    pdf.line(80, 111, 80, 167);
    pdf.line(45, 152, 45, 167);
    pdf.line(65, 67, 65, 111);
    pdf.line(117, 67, 117, 111);
    pdf.line(80, 147, 292, 147);
    pdf.line(5, 152, 80, 152);
    pdf.line(5, 158, 80, 158);
    pdf.line(80, 127, 292, 127);
    pdf.line(180, 72, 292, 72);
    pdf.line(180, 117, 292, 117);
    pdf.line(85, 27, 85, 67);
    pdf.line(5, 167, 292, 167);

    // Terms and conditions separator line
    pdf.line(5, 172, 292, 172);

    // Terms and conditions text
    pdf.setFontSize(4);
    const termsY = 178;
    pdf.text(tm1, 7, termsY);
    pdf.text(tm2, 7, termsY + 2);
    pdf.text(tm3, 7, termsY + 4);
    pdf.text(tm4, 7, termsY + 6);
    pdf.text(tm5, 7, termsY + 8);
    pdf.text(tm6, 7, 187.7);

    // Handle address text wrapping
    const wrapText = (text, maxWidth) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (testLine.length <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // Wrap and display addresses
    pdf.setFontSize(7);
    const consignorAddressLines = wrapText(formData.consignor_address, 40);
    const consigneeAddressLines = wrapText(formData.consignee_address, 40);
    
    let yPos = 37;
    consignorAddressLines.forEach(line => {
      pdf.text(line, 20, yPos);
      yPos += 4;
    });
    
    yPos = 37;
    consigneeAddressLines.forEach(line => {
      pdf.text(line, 100, yPos);
      yPos += 4;
    });
    // ✅ Load tick image once (from /public/tick.png)
    const tickBase64 = await urlToBase64(`${baseUrl}/tick.png`);

    // ✅ Add ticks based on formData checkboxes
    if (formData.paid_check) {
      pdf.addImage(tickBase64, "PNG", 215, 92, 15, 15);
    }
    if (formData.to_pay_check) {
      pdf.addImage(tickBase64, "PNG", 245, 92, 15, 15);
    }
    if (formData.tbb_check) {
      pdf.addImage(tickBase64, "PNG", 270, 92, 15, 15);
    }


    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    // Return PDF response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Arch-${formData.gc_no || 'new'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
}