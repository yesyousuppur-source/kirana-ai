// WhatsApp helpers — wa.me/ links (no API needed)

// Phone number clean karo (remove spaces, +, dashes)
export function cleanPhone(phone) {
  if (!phone) return "";
  let p = String(phone).replace(/[^0-9]/g, "");
  // India ka 91 add karo agar 10-digit hai
  if (p.length === 10) p = "91" + p;
  return p;
}

// Ek customer ko WhatsApp link banao
export function waLink(phone, message) {
  const p = cleanPhone(phone);
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${p}?text=${text}`;
}

// Payment reminder message
export function paymentReminderMsg(customerName, amount, shopName) {
  return `नमस्ते ${customerName} जी 🙏

आपका ${shopName} पर ₹${amount} का बकाया है।

कृपया जल्दी से भुगतान कर दें। धन्यवाद! 🙏`;
}

// Order confirmation message
export function orderConfirmMsg(customerName, items, total, shopName) {
  return `नमस्ते ${customerName} जी 🙏

आपका ऑर्डर कन्फर्म हो गया है:
${items}

कुल: ₹${total}

जल्दी भेज देंगे। धन्यवाद! 🛒
- ${shopName}`;
}

// Bulk message (aap pura message banayenge, fir multiple WA tabs khulenge)
export function openBulkWhatsApp(customers, message) {
  customers.forEach((c, i) => {
    setTimeout(() => {
      const link = waLink(c.phone, message.replace("{name}", c.name));
      window.open(link, "_blank");
    }, i * 800); // Har 0.8 second baad naya tab (browser throttle se bachne ke liye)
  });
}
