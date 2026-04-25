// WhatsApp helpers — wa.me/ links with app picker support
import { openWA as openWAPicker, getSavedWAType } from "./waPicker";
import { customerMsgLang } from "./i18n";

export function cleanPhone(phone) {
  if (!phone) return "";
  let p = String(phone).replace(/[^0-9]/g, "");
  if (p.length === 10) p = "91" + p;
  return p;
}

export function waLink(phone, message) {
  const p = cleanPhone(phone);
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${p}?text=${text}`;
}

// Payment reminder message
export function paymentReminderMsg(customerName, amount, shopName, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);

  if (msgLang === "hi") {
    return `नमस्ते ${customerName} जी 🙏

आपका ${shopName} पर ₹${amount} का बकाया है।

कृपया जल्दी से भुगतान कर दें। धन्यवाद! 🙏`;
  }

  return `Hello ${customerName} 🙏

You have a pending balance of ₹${amount} at ${shopName}.

Please make the payment soon. Thank you! 🙏`;
}

// Order confirmation message — with order number
export function orderConfirmMsg(customerName, items, total, shopName, uiLang = "en", orderNumber = "") {
  const msgLang = customerMsgLang(uiLang);
  const orderLine = orderNumber ? `Order ${orderNumber}\n` : "";

  if (msgLang === "hi") {
    return `नमस्ते ${customerName} जी 🙏

${orderLine}आपका ऑर्डर कन्फर्म हो गया है:
${items}

कुल: ₹${total}

जल्दी भेज देंगे। धन्यवाद! 🛒
- ${shopName}`;
  }

  return `Hello ${customerName} 🙏

${orderLine}Your order is confirmed:
${items}

Total: ₹${total}

Will deliver soon. Thank you! 🛒
- ${shopName}`;
}

// Payment received receipt message — Receipt-style (Option B)
export function paymentReceivedMsg(customerName, amount, shopName, orderNumber, paymentMethod, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const methodText = paymentMethod === "upi" ? "UPI" : "Cash";

  if (msgLang === "hi") {
    return `✅ Payment Confirmed

Order: ${orderNumber || "—"}
Amount: ₹${amount}
Method: ${methodText}
Date: ${date}

धन्यवाद ${customerName} जी! 🙏
- ${shopName}`;
  }

  return `✅ Payment Confirmed

Order: ${orderNumber || "—"}
Amount: ₹${amount}
Method: ${methodText}
Date: ${date}

Thank you ${customerName}! 🙏
- ${shopName}`;
}

// Helper to send WhatsApp via picker logic
export function sendWAMessage(phone, message, onNeedPicker) {
  const savedType = getSavedWAType();
  if (savedType) {
    openWAPicker(phone, message, savedType);
  } else if (onNeedPicker) {
    onNeedPicker(phone, message);
  } else {
    window.open(waLink(phone, message), "_blank");
  }
}
