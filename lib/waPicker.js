// WhatsApp App Picker — Personal vs Business
// User ka choice localStorage me save hota hai

const STORAGE_KEY = "kirana_wa_app";

export const WA_TYPES = {
  PERSONAL: "personal",
  BUSINESS: "business",
};

export function getSavedWAType() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function saveWAType(type) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, type);
  }
}

export function clearWAType() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Open WhatsApp with correct app scheme
// Personal: wa.me/ (default WhatsApp)
// Business: Android intent to specifically open WhatsApp Business
export function openWA(phone, message, waType) {
  const cleanP = String(phone).replace(/[^0-9]/g, "");
  const phoneWith91 = cleanP.length === 10 ? "91" + cleanP : cleanP;
  const encodedMsg = encodeURIComponent(message || "");

  if (waType === WA_TYPES.BUSINESS) {
    // WhatsApp Business specific scheme
    // Android intent that prefers WhatsApp Business
    const intentUrl = `intent://send?phone=${phoneWith91}&text=${encodedMsg}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end`;
    // Fallback to wa.me if intent fails
    const fallback = `https://wa.me/${phoneWith91}?text=${encodedMsg}`;

    try {
      window.location.href = intentUrl;
      // Backup in case intent fails
      setTimeout(() => {
        window.open(fallback, "_blank");
      }, 800);
    } catch (e) {
      window.open(fallback, "_blank");
    }
  } else {
    // Personal WhatsApp — standard wa.me/ link
    const url = `https://wa.me/${phoneWith91}?text=${encodedMsg}`;
    window.open(url, "_blank");
  }
}
