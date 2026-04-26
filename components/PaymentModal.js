"use client";
import { Banknote, Smartphone, X } from "lucide-react";
import { t, getSavedLang } from "@/lib/i18n";

export default function PaymentModal({ order, onCash, onUpi, onClose }) {
  const lang = getSavedLang();
  if (!order) return null;

  const orderNumberDisplay =
    typeof order.orderNumber === "number"
      ? `#${String(order.orderNumber).padStart(4, "0")}`
      : order.orderNumber || "";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold hi">{t(lang, "paymentMethod")}</h2>
            <p className="text-sm text-slate-500 hi mt-1">
              {t(lang, "paymentMethodSub")}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
              <span className="text-sm font-semibold">₹{order.total}</span>
              {orderNumberDisplay && (
                <span className="text-xs text-slate-500">• {orderNumberDisplay}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-3 mt-5">
          <button
            onClick={onCash}
            className="w-full p-4 bg-green-50 active:bg-green-200 rounded-xl flex items-center gap-3 border-2 border-transparent active:border-green-500 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Banknote size={24} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold hi">{t(lang, "cash")}</div>
              <div className="text-xs text-slate-500 hi">{t(lang, "cashSub")}</div>
            </div>
          </button>

          <button
            onClick={onUpi}
            className="w-full p-4 bg-blue-50 active:bg-blue-200 rounded-xl flex items-center gap-3 border-2 border-transparent active:border-blue-500 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Smartphone size={24} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold hi">{t(lang, "upi")}</div>
              <div className="text-xs text-slate-500 hi">{t(lang, "upiSub")}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
              }
