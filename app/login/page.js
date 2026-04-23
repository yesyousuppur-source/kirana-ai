"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getShop } from "@/lib/store";
import { t, getSavedLang } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [lang, setLang] = useState("hi");

  useEffect(() => {
    // Redirect to language page if not chosen
    const saved = typeof window !== "undefined" ? localStorage.getItem("kirana_lang") : null;
    if (!saved) {
      router.replace("/language");
      return;
    }
    setLang(saved);

    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      } catch (e) {
        console.error("reCAPTCHA error:", e);
      }
    }
  }, [router]);

  async function sendOtp() {
    setError("");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(t(lang, "invalidPhone"));
      return;
    }
    setLoading(true);
    try {
      const verifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, "+91" + phone, verifier);
      setConfirmation(result);
      setStep("otp");
    } catch (e) {
      console.error(e);
      setError(t(lang, "otpError"));
      try { window.recaptchaVerifier?.clear(); } catch {}
      window.recaptchaVerifier = null;
    }
    setLoading(false);
  }

  async function verifyOtp() {
    setError("");
    if (otp.length !== 6) {
      setError(t(lang, "invalidOtp"));
      return;
    }
    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      const shop = await getShop(result.user.uid);
      router.replace(shop ? "/dashboard" : "/onboarding");
    } catch (e) {
      setError(t(lang, "wrongOtp"));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand to-brand-dark flex flex-col p-6">
      <div id="recaptcha-container"></div>

      {/* Language change button */}
      <button
        onClick={() => router.push("/language")}
        className="absolute top-4 right-4 bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold border border-white/20"
      >
        <Globe size={14}/>
        {lang.toUpperCase()}
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
            <span className="text-brand text-4xl font-bold hi">कि</span>
          </div>
          <h1 className="text-white text-3xl font-bold hi">
            {t(lang, "appName")}
          </h1>
          <p className="text-white/80 text-sm mt-1 hi">
            {t(lang, "tagline")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {step === "phone" ? (
            <>
              <h2 className="text-lg font-bold hi mb-1">{t(lang, "login")}</h2>
              <p className="text-gray-500 text-sm hi mb-4">
                {t(lang, "loginSub")}
              </p>
              <div className="flex gap-2 mb-4">
                <span className="flex items-center px-3 border rounded-xl bg-gray-50 text-gray-700 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="flex-1 px-4 py-3 border rounded-xl text-lg font-semibold outline-none focus:border-brand"
                />
              </div>
              {error && <p className="text-red-500 text-xs mb-3 hi">{error}</p>}
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold hi disabled:opacity-50 active:bg-brand-dark"
              >
                {loading ? t(lang, "sending") : t(lang, "sendOtp") + " →"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold hi mb-1">{t(lang, "enterOtp")}</h2>
              <p className="text-gray-500 text-sm hi mb-4">
                +91 {phone} {t(lang, "otpSentTo")}
              </p>
              <input
                type="tel"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder={t(lang, "otpPlaceholder")}
                className="w-full px-4 py-3 border rounded-xl text-2xl font-bold tracking-widest text-center outline-none focus:border-brand mb-4"
              />
              {error && <p className="text-red-500 text-xs mb-3 hi">{error}</p>}
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold hi disabled:opacity-50 active:bg-brand-dark mb-2"
              >
                {loading ? t(lang, "verifying") : t(lang, "loginBtn") + " ✓"}
              </button>
              <button
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="w-full text-gray-500 text-sm hi"
              >
                ← {t(lang, "changeNumber")}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-white/70 text-xs mt-6 hi">
          {t(lang, "newAccountInfo")}
        </p>
      </div>
    </div>
  );
}
