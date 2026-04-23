"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createShop } from "@/lib/store";

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  async function submit() {
    setError("");
    if (!shopName || !ownerName || !city) {
      setError("सारी जानकारी भरें");
      return;
    }
    setLoading(true);
    try {
      await createShop(user.uid, {
        shopName,
        ownerName,
        city,
        phone: user.phoneNumber,
      });
      router.replace("/dashboard");
    } catch (e) {
      setError("कुछ समस्या हुई। दोबारा कोशिश करें।");
      console.error(e);
    }
    setLoading(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand to-brand-dark p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 pt-8">
          <h1 className="text-white text-2xl font-bold hi">आपका स्वागत है! 🙏</h1>
          <p className="text-white/80 text-sm mt-1 hi">
            अपनी दुकान की जानकारी भरें
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              दुकान का नाम *
            </label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="जैसे: शर्मा जनरल स्टोर"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              आपका नाम *
            </label>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="जैसे: राहुल शर्मा"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 hi block mb-1">
              शहर *
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="जैसे: कानपुर"
              className="w-full px-4 py-3 border rounded-xl outline-none focus:border-brand hi"
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-3 hi">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-xl font-bold hi disabled:opacity-50 active:bg-brand-dark"
          >
            {loading ? "सेव हो रहा है..." : "शुरू करें →"}
          </button>
        </div>

        <p className="text-center text-white/70 text-xs mt-4 hi">
          7 दिन का फ्री ट्रायल मिलेगा ✨
        </p>
      </div>
    </div>
  );
                }
