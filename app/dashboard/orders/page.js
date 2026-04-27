"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrders, markOrderPaid, getShop } from "@/lib/store";
import { waLink, paymentReceivedMsg } from "@/lib/whatsapp";
import { openUpiApp } from "@/lib/upi";
import { t, getSavedLang } from "@/lib/i18n";
import {
  ArrowLeft, Check, MessageCircle,
  Banknote, Smartphone, X,
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lang, setLang] = useState("hi");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setLang(getSavedLang());
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace("/login"); return; }
      setUser(u);
      const s = await getShop(u.uid);
      setShop(s);
      await load(u.uid);
    });
    return () => unsub();
  }, [router]);

  async function load(uid) {
    const data = await getOrders(uid, 30);
    setOrders(data);
  }

  function openPaymentModal(order) {
    setSelectedOrder(order);
    setShowPayModal(true);
  }

  async function confirmPayment(method) {
    if (!selectedOrder) return;
    setShowPayModal(false);

    if (method === "upi" && shop?.upiId) {
      openUpiApp({
        upiId: shop.upiId,
        payeeName: shop.shopName || "Shop",
        amount: selectedOrder.total,
        note: `${selectedOrder.orderNumber || ""} ${selectedOrder.customerName || ""}`,
      });
    }

    await markOrderPaid(user.uid, selectedOrder.id, selectedOrder, method);

    if (selectedOrder.customerPhone) {
      const msg = paymentReceivedMsg(
        selectedOrder.customerName || "Customer",
        selectedOrder.total,
        shop?.shopName || "हमारी दुकान",
        selectedOrder.orderNumber || "",
        method,
        lang
      );
      window.open(waLink(selectedOrder.customerPhone, msg), "_blank");
    }

    await load(user.uid);
    setSelectedOrder(null);
  }

  const filtered = orders.filter((o) => {
    if (filter === "unpaid") return !o.paid;
    if (filter === "paid") return o.paid;
    return true;
  });
  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto pb-20">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg hi flex-1">{t(lang, "ordersTitle")}</h1>
      </header>

      <div className="px-3 py-3 flex gap-2">
        {["all","unpaid","paid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold hi transition-colors ${
              filter === f ? "bg-brand text-white" : "bg-white text-slate-600 border"
            }`}
          >
            {f === "all" ? t(lang, "all") : f === "unpaid" ? t(lang, "unpaid") : t(lang, "paid")}
          </button>
        ))}
      </div>

      <div className="px-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-bold hi text-slate-500">{t(lang, "noOrdersFound")}</p>
          </div>
        ) : filtered.map((o) => (
          <div key={o.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                {o.orderNumber && (
                  <div className="text-[10px] font-bold text-blue-700 mb-0.5">
                    #{typeof o.orderNumber === "number"
                      ? String(o.orderNumber).padStart(4, "0")
                      : o.orderNumber}
                  </div>
                )}
                <div className="font-bold hi truncate">{o.customerName || "Customer"}</div>
                <div className="text-sm text-slate-600 hi">{o.items}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {o.createdAt?.toDate
                    ? o.createdAt.toDate().toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                o.paid
                  ? o.paymentMethod === "upi"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {o.paid
                  ? `✓ ${o.paymentMethod === "upi" ? "UPI" : "Cash"}`
                  : t(lang, "udhaar")}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-lg font-extrabold text-brand">
                ₹{Number(o.total || 0).toLocaleString("en-IN")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/dashboard/orders/${o.id}`)}
                  className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  ✏️ Edit
                </button>
                {o.customerPhone && (
                  <button
                    onClick={() => {
                      const msg = `Hello ${o.customerName || ""}! Order: ${o.items}, Total: ₹${o.total}`;
                      window.open(waLink(o.customerPhone, msg), "_blank");
                    }}
                    className="bg-green-50 text-green-700 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <MessageCircle size={12}/> WA
                  </button>
                )}
                {!o.paid && (
                  <button
                    onClick={() => openPaymentModal(o)}
                    className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Check size={12}/> {t(lang, "paid")}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPayModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold hi">{t(lang, "paymentMethod")}</h2>
                <p className="text-sm text-slate-500 hi mt-1">{t(lang, "paymentMethodSub")}</p>
                <div className="mt-2 bg-slate-100 px-3 py-1.5 rounded-lg inline-flex gap-2 items-center">
                  <span className="font-bold">₹{selectedOrder.total}</span>
                  <span className="text-xs text-slate-500">{selectedOrder.customerName}</span>
                </div>
              </div>
              <button
                onClick={() => { setShowPayModal(false); setSelectedOrder(null); }}
                className="p-1 text-slate-500"
              >
                <X size={22}/>
              </button>
            </div>
            <div className="space-y-3 mt-4">
              <button
                onClick={() => confirmPayment("cash")}
                className="w-full p-4 bg-green-50 active:bg-green-200 rounded-xl flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Banknote size={24} className="text-white"/>
                </div>
                <div className="text-left">
                  <div className="font-bold hi">{t(lang, "cash")}</div>
                  <div className="text-xs text-slate-500 hi">{t(lang, "cashSub")}</div>
                </div>
              </button>
              <button
                onClick={() => confirmPayment("upi")}
                className="w-full p-4 bg-blue-50 active:bg-blue-200 rounded-xl flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={24} className="text-white"/>
                </div>
                <div className="text-left">
                  <div className="font-bold hi">{t(lang, "upi")}</div>
                  <div className="text-xs text-slate-500 hi">{t(lang, "upiSub")}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }
