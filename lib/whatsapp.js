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

// Payment reminder message in user's language (or English)
export function paymentReminderMsg(customerName, amount, shopName, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);

  if (msgLang === "hi") {
    return `नमस्ते ${customerName} जी 🙏

आपका ${shopName} पर ₹${amount} का बकाया है।

कृपया जल्दी से भुगतान कर दें। धन्यवाद! 🙏`;
  }

  // English default
  return `Hello ${customerName} 🙏

You have a pending balance of ₹${amount} at ${shopName}.

Please make the payment soon. Thank you! 🙏`;
}

// Order confirmation message
export function orderConfirmMsg(customerName, items, total, shopName, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);

  if (msgLang === "hi") {
    return `नमस्ते ${customerName} जी 🙏

आपका ऑर्डर कन्फर्म हो गया है:
${items}

कुल: ₹${total}

जल्दी भेज देंगे। धन्यवाद! 🛒
- ${shopName}`;
  }

  return `Hello ${customerName} 🙏

Your order is confirmed:
${items}

Total: ₹${total}

Will deliver soon. Thank you! 🛒
- ${shopName}`;
}

// Send message via saved WA app, or show picker if not saved
// onNeedPicker is a callback that receives (phone, message) and shows picker
export function sendWAMessage(phone, message, onNeedPicker) {
  const savedType = getSavedWAType();
  if (savedType) {
    openWAPicker(phone, message, savedType);
  } else if (onNeedPicker) {
    onNeedPicker(phone, message);
  } else {
    // Fallback to default wa.me if no picker callback
    window.open(waLink(phone, message), "_blank");
  }
}
