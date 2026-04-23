"use client";
import { useState } from "react";
import { saveWAType, WA_TYPES } from "@/lib/waPicker";
import { t, getSavedLang } from "@/lib/i18n";
import { MessageCircle } from "lucide-react";

export default function WAPickerModal({ onChoose, onClose }) {
  const [remember, setRemember] = useState(true);
  const lang = getSavedLang();

  function handlePick(type) {
    if (remember) saveWAType(type);
    onChoose(type);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-3">
            <MessageCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold hi mb-1">
            {t(lang, "chooseWA")}
          </h2>
          <p className="text-sm text-slate-500 hi">
            {t(lang, "chooseWASub")}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => handlePick(WA_TYPES.PERSONAL)}
            className="w-full p-4 bg-slate-50 rounded-xl flex items-center gap-3 active:bg-green-50 border-2 border-transparent active:border-green-500 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M20.5 3.5A11 11 0 0 0 3.4 17.1L2 22l5-1.3a11 11 0 0 0 5 1.3A11 11 0 0 0 20.5 3.5Z"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold hi">{t(lang, "whatsapp")}</div>
              <div className="text-xs text-slate-500 hi">{t(lang, "whatsappPersonal")}</div>
            </div>
          </button>

          <button
            onClick={() => handlePick(WA_TYPES.BUSINESS)}
            className="w-full p-4 bg-slate-50 rounded-xl flex items-center gap-3 active:bg-green-50 border-2 border-transparent active:border-green-500 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M20.5 3.5A11 11 0 0 0 3.4 17.1L2 22l5-1.3a11 11 0 0 0 5 1.3A11 11 0 0 0 20.5 3.5Z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-green-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">B</span>
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold hi">{t(lang, "whatsappBusiness")}</div>
              <div className="text-xs text-slate-500 hi">{t(lang, "whatsappBusinessSub")}</div>
            </div>
          </button>
        </div>

        <label className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 accent-brand"
          />
          <span className="text-xs text-slate-700 hi flex-1">
            {t(lang, "rememberChoice")}
          </span>
        </label>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-center text-sm text-slate-500 hi py-2"
          >
            {t(lang, "cancel")}
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </div>
  );
                                               }
