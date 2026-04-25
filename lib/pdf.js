// PDF generator for customer ledger
// Uses jsPDF + autotable for clean PDF generation

export async function generateLedgerPDF(shop, customer, orders) {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF();

  // Header — Shop name
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text(shop.shopName || "Kirana Store", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(shop.city || "", 14, 27);
  if (shop.phone) doc.text(`Phone: ${shop.phone}`, 14, 33);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Customer Ledger / Khata", 14, 45);

  // Customer info box
  doc.setFillColor(240, 253, 244);
  doc.rect(14, 50, 182, 25, "F");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Customer: ${customer.name || ""}`, 18, 58);
  doc.text(`Phone: ${customer.phone || ""}`, 18, 65);
  doc.text(`Total Orders: ${customer.totalOrders || 0}`, 18, 72);

  // Total udhaar — highlight
  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text(
    `Pending Balance / Udhaar: Rs. ${(customer.udhaar || 0).toLocaleString("en-IN")}`,
    110,
    65
  );

  // Date generated
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 82);

  // Orders table
  const tableData = orders.map((o) => [
    o.createdAt?.toDate
      ? o.createdAt.toDate().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
      : "-",
    o.items || "-",
    `Rs. ${Number(o.total || 0).toLocaleString("en-IN")}`,
    o.paid ? "Paid" : "Udhaar",
  ]);

  doc.autoTable({
    startY: 88,
    head: [["Date", "Items", "Amount", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 90 },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 25, halign: "center" },
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `${shop.shopName || "Kirana Store"} - Powered by Kirana AI`,
    14,
    pageHeight - 10
  );

  // Save with customer name
  const filename = `${(customer.name || "customer").replace(/\s/g, "_")}_khata_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
