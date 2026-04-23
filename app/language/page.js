"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, saveLang, t } from "@/lib/i18n";
import { Check } from "lucide-react";

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState("hi");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("kirana_lang") : null;
    if (saved) setSelected(saved);
  }, []);

  function handleContinue() {
    saveLang(selected);
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand to-brand-dark p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-6 pt-12">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
            <span className="text-brand text-3xl font-bold hi">कि</span>
          </div>
          <h1 className="text-white text-2xl font-bold hi mb-1">
            {t(selected, "chooseLanguage")}
          </h1>
          <p className="text-white/80 text-sm hi">
            {t(selected, "chooseLanguageSub")}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-2xl space-y-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                selected === lang.code
                  ? "bg-brand text-white shadow-md"
                  : "bg-slate-50 text-slate-800 active:bg-slate-100"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg hi">{lang.name}</div>
                <div className={`text-xs ${selected === lang.code ? "text-white/80" : "text-slate-500"}`}>
                  {lang.english}
                </div>
              </div>
              {selected === lang.code && (
                <Check size={22} strokeWidth={3} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-white text-brand-dark py-4 rounded-xl font-extrabold text-lg mt-6 shadow-xl active:scale-95 transition-transform"
        >
          {t(selected, "continue")} →
        </button>
      </div>
    </div>
  );
}
