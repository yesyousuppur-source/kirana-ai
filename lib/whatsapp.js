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

// Smart "ji" — address me number/dash/slash ho to "ji" nahi
function smartJi(name) {
  if (!name) return "";
  const hasAddress = /[\d\-\/]/.test(name);
  return hasAddress ? name : `${name} ji`;
}

// Payment reminder message
export function paymentReminderMsg(customerName, amount, shopName, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);
  const greeting = smartJi(customerName);

  if (msgLang === "hi") {
    return `नमस्ते ${greeting} 🙏\n\nआपका ${shopName} पर ₹${amount} का बकाया है।\n\nकृपया जल्दी से भुगतान कर दें। धन्यवाद! 🙏`;
  }
  return `Hello ${greeting} 🙏\n\nYou have a pending balance of ₹${amount} at ${shopName}.\n\nPlease make the payment soon. Thank you! 🙏`;
}

// Order confirmation — with header, UPI, website link
export function orderConfirmMsg(customerName, items, total, shopName, uiLang = "en", orderNumber = "", upiId = "") {
  const msgLang = customerMsgLang(uiLang);
  const greeting = smartJi(customerName);
  const orderLine = orderNumber ? `Order ${orderNumber}\n` : "";
  const header = `━━━━━━━━━━━━━━━━\n🏪 ${shopName}\n🌐 www.kiranaai.shop\n━━━━━━━━━━━━━━━━\n\n`;
  const upiSection = upiId
    ? `\n💳 UPI se pay karo:\nUPI ID: ${upiId}\nAmount: ₹${total}\n`
    : "";

  if (msgLang === "hi") {
    return `${header}नमस्ते ${greeting} 🙏\n\n${orderLine}आपका ऑर्डर कन्फर्म हो गया है:\n${items}\n\n💰 कुल: ₹${total}${upiSection}\nधन्यवाद! 🛒`;
  }

  return `${header}Hello ${greeting} 🙏\n\n${orderLine}Your order is confirmed:\n${items}\n\n💰 Total: ₹${total}${upiSection}\nThank you! 🛒`;
}

// Payment received receipt
export function paymentReceivedMsg(customerName, amount, shopName, orderNumber, paymentMethod, uiLang = "en") {
  const msgLang = customerMsgLang(uiLang);
  const greeting = smartJi(customerName);
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const methodText = paymentMethod === "upi" ? "UPI" : "Cash";

  if (msgLang === "hi") {
    return `✅ Payment Confirmed\n\nOrder: ${orderNumber || "—"}\nAmount: ₹${amount}\nMethod: ${methodText}\nDate: ${date}\n\nDhanyavad ${greeting}! 🙏\n- ${shopName}\n🌐 www.kiranaai.shop`;
  }

  return `✅ Payment Confirmed\n\nOrder: ${orderNumber || "—"}\nAmount: ₹${amount}\nMethod: ${methodText}\nDate: ${date}\n\nThank you ${greeting}! 🙏\n- ${shopName}\n🌐 www.kiranaai.shop`;
}

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
