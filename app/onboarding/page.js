"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createShop } from "@/lib/store";
import { t, getSavedLang } from "@/lib/i18n";
import { isValidUpiId } from "@/lib/upi";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("hi");

  useEffect(() => {
    setLang(getSavedLang());
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  async function submit() {
    setError("");
    if (!shopName || !ownerName || !city) {
      setError(t(lang, "fillAllFields"));
      return;
    }
    // UPI ID is optional, but if provided, validate it
    if (upiId.trim() && !isValidUpiId(upiId.trim())) {
      setError("UPI ID format galat hai. Example: name@paytm");
      return;
    }
    setLoading(true);
    try {
      await createShop(user.uid, {
        shopName,
        ownerName,
        city,
        upiId: upiId.trim(),
        phone: user.phoneNumber,
        language: lang,
      });
      router.replace("/dashboard");
    } catch (e) {
      setError(t(lang, "problemOccurred"));
      console.error(e);
    }
    setLoading(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand to-brand-dark p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-8">
          <h1 className="text-white text-2xl font-bold hi">{t(lang, "welcome")} 🙏</h1>
          <p className="text-white/80 text-sm mt-1 hi">
            {t(lang, "shopInfo")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              {t(lang, "shopName")} *
            </label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={t(lang, "shopNamePlaceholder")}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              {t(lang, "ownerName")} *
            </label>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder={t(lang, "ownerNamePlaceholder")}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              {t(lang, "city")} *
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t(lang, "cityPlaceholder")}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          {/* UPI ID — Optional */}
          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              {t(lang, "upiId")}
            </label>
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder={t(lang, "upiIdPlaceholder")}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand text-sm bg-white"
            />
            <p className="text-[11px] text-blue-700 hi mt-1.5 flex items-center gap-1">
              💡 {t(lang, "upiHelp")}
            </p>
          </div>

          {error && <p className="text-red-500 text-xs mb-3 hi">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold hi disabled:opacity-50 active:bg-brand-dark"
          >
            {loading ? t(lang, "saving") : t(lang, "startBtn") + " →"}
          </button>
        </div>

        <p className="text-center text-white/70 text-xs mt-4 hi">
          {t(lang, "trialInfo")}
        </p>
      </div>
    </div>
  );
}
