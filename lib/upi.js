// UPI deep link helper
// Opens user's installed UPI app (PhonePe, GPay, Paytm) with pre-filled amount

// Validate UPI ID format (basic): something@something
export function isValidUpiId(upiId) {
  if (!upiId) return false;
  const trimmed = upiId.trim();
  // Format: handle@provider (e.g., 9876543210@paytm, name@okaxis)
  return /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/.test(trimmed);
}

// Build UPI deep link
// upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=INR
export function buildUpiLink({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams();
  params.append("pa", upiId);
  if (payeeName) params.append("pn", payeeName);
  if (amount) params.append("am", String(amount));
  if (note) params.append("tn", note);
  params.append("cu", "INR");
  return `upi://pay?${params.toString()}`;
}

// Open UPI app on user's phone
// On Android: opens chooser with all UPI apps
// On Desktop: shows QR or fails (deep links don't work on desktop)
export function openUpiApp({ upiId, payeeName, amount, note }) {
  const link = buildUpiLink({ upiId, payeeName, amount, note });
  // Use window.location for better Android intent handling
  window.location.href = link;
}
