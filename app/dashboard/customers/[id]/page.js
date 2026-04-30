"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getShop, getCustomer, getCustomerOrders,
  markOrderPaid, addPayment,
} from "@/lib/store";
import { waLink, paymentReminderMsg, paymentReceivedMsg } from "@/lib/whatsapp";
import { openUpiApp } from "@/lib/upi";
import { t, getSavedLang } from "@/lib/i18n";
import {
  ArrowLeft, Phone, MessageCircle, Check,
  Calendar, ShoppingBag, Banknote, Smartphone, X, Hash, IndianRupee,
} from "lucide-react";

export default function CustomerLedgerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;

  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("hi");

  // Order paid modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Partial payment modal
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [partialMethod, setPartialMethod] = useState("cash");
  const [savingPartial, setSavingPartial] = useState(false);

  useEffect(() => {
    setLang(getSavedLang());
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace("/login"); return; }
      setUser(u);
      try {
        const s = await getShop(u.uid);
        setShop(s);
        await load(u.uid);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router, customerId]);

  async function load(uid) {
    setLoading(true);
    try {
      const c = await getCustomer(uid, customerId);
      if (!c) {
        alert("Customer not found");
        router.replace("/dashboard/customers");
        return;
      }
      setCustomer(c);
      try {
        const o = await getCustomerOrders(uid, customerId);
        setOrders(o);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  // Order-level paid modal
  function openPaymentModal(order) {
    setSelectedOrder(order);
    setShowPayModal(true);
  }

  async function confirmOrderPayment(method) {
    if (!selectedOrder) return;
    setShowPayModal(false);
    if (method === "upi" && shop?.upiId) {
      openUpiApp({
        upiId: shop.upiId,
        payeeName: shop.shopName || "Shop",
        amount: selectedOrder.total,
        note: `${selectedOrder.orderNumber || ""} ${customer.name}`,
      });
    }
    await markOrderPaid(user.uid, selectedOrder.id, selectedOrder, method);
    const msg = paymentReceivedMsg(
      customer.name, selectedOrder.total,
      shop?.shopName || "हमारी दुकान",
      selectedOrder.orderNumber || "", method, lang
    );
    if (customer.phone) window.open(waLink(customer.phone, msg), "_blank");
    await load(user.uid);
    setSelectedOrder(null);
  }

  // Partial payment submit
  async function handlePartialPayment() {
    const amt = Number(partialAmount);
    if (!amt || amt <= 0) { alert("सही amount डालें"); return; }
    if (amt > (customer.udhaar || 0)) {
      alert(`Amount ₹${customer.udhaar} से ज्यादा नहीं हो सकता`);
      return;
    }
    setSavingPartial(true);
    try {
      if (partialMethod === "upi" && shop?.upiId) {
        openUpiApp({
          upiId: shop.upiId,
          payeeName: shop.shopName || "Shop",
          amount: amt,
          note: `Payment ${customer.name}`,
        });
      }
      await addPayment(user.uid, customerId, amt, partialMethod);
      // WhatsApp receipt
      const date = new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
      const methodText = partialMethod === "upi" ? "UPI" : "Cash";
      const msg = `✅ Payment Received\n\nCustomer: ${customer.name}\nAmount: ₹${amt}\nMethod: ${methodText}\nDate: ${date}\n\nBaaki: ₹${Math.max(0, (customer.udhaar || 0) - amt)}\n\nDhanyavad! 🙏\n- ${shop?.shopName || "हमारी दुकान"}\n🌐 www.kiranaai.shop`;
      if (customer.phone) window.open(waLink(customer.phone, msg), "_blank");
      setShowPartialModal(false);
      setPartialAmount("");
      setPartialMethod("cash");
      await load(user.uid);
    } catch (e) {
      console.error(e);
      alert("Payment save failed. Try again.");
    }
    setSavingPartial(false);
  }
  function sendReminder() {
    if (!customer.udhaar || customer.udhaar <= 0) {
      alert(t(lang, "noUdhaar"));
      return;
    }
    const msg = paymentReminderMsg(
      customer.name,
      customer.udhaar,
      shop?.shopName || "हमारी दुकान",
      lang
    );
    window.open(waLink(customer.phone, msg), "_blank");
  }

  const groupedOrders = orders.reduce((acc, o) => {
    if (!o.createdAt?.toDate) return acc;
    const dateKey = o.createdAt.toDate().toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(o);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!customer) return null;

  const init = (customer.name || "?")
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const totalPaid = orders
    .filter((o) => o.paid)
    .reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto pb-20">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg hi truncate flex-1">{customer.name}</h1>
      </header>

      <div className="bg-gradient-to-b from-brand to-brand-dark text-white p-5 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-white text-brand flex items-center justify-center font-extrabold text-xl shadow-lg">
            {init}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-xl hi truncate">{customer.name}</div>
            <a href={`tel:${customer.phone}`} className="text-sm opacity-90 flex items-center gap-1">
              <Phone size={12} /> {customer.phone}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur">
            <div className="text-[10px] opacity-80 hi">{t(lang, "udhaar")}</div>
            <div className="text-xl font-extrabold">
              ₹{(customer.udhaar || 0).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur">
            <div className="text-[10px] opacity-80 hi">{t(lang, "paid")}</div>
            <div className="text-xl font-extrabold">
              ₹{totalPaid.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center backdrop-blur">
            <div className="text-[10px] opacity-80 hi">{t(lang, "ordersLabel")}</div>
            <div className="text-xl font-extrabold">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-3 py-3 sticky top-[60px] bg-slate-50 z-10 flex gap-2">
        <button
          onClick={sendReminder}
          disabled={!customer.udhaar || customer.udhaar <= 0}
          className="flex-1 bg-green-50 text-green-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 active:bg-green-100 disabled:opacity-40 hi"
        >
          <MessageCircle size={16} /> {t(lang, "reminder")}
        </button>
        {customer.udhaar > 0 && (
          <button
            onClick={() => { setPartialAmount(""); setShowPartialModal(true); }}
            className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 active:bg-blue-100 hi"
          >
            <IndianRupee size={16} /> Payment Mila
          </button>
        )}
      </div>
<div className="px-3">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="font-bold hi">{t(lang, "noOrdersYet")}</p>
            <p className="text-sm text-slate-500 hi mt-1">{t(lang, "addFirstOrder")}</p>
          </div>
        ) : (
          Object.entries(groupedOrders).map(([date, dayOrders]) => (
            <div key={date} className="mb-4">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Calendar size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold text-slate-600">{date}</h3>
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-semibold">
                  ₹{dayOrders.reduce((s, o) => s + Number(o.total || 0), 0)}
                </span>
              </div>
              <div className="space-y-2">
                {dayOrders.map((o) => (
                  <div key={o.id} className={`bg-white rounded-xl p-3 shadow-sm border ${o.status === "cancelled" ? "border-red-200 opacity-70" : "border-slate-100"}`}>
                    {o.status === "cancelled" && (
                      <div className="bg-red-50 text-red-600 text-[11px] font-bold px-2 py-1 rounded-lg mb-2">
                        ❌ कैंसल हो गया
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <div className="flex-1 min-w-0">
                        {o.orderNumber && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700 mb-1">
                            <Hash size={10} />
                            {typeof o.orderNumber === "number"
                              ? `#${String(o.orderNumber).padStart(4, "0")}`
                              : o.orderNumber}
                          </div>
                        )}
                        <div className={`text-sm hi ${o.status === "cancelled" ? "line-through text-slate-400" : ""}`}>
                          {o.items || "Order"}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        o.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : o.paid
                            ? o.paymentMethod === "upi"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {o.status === "cancelled" ? "❌ Cancel" :
                          o.paid ? `✓ ${o.paymentMethod === "upi" ? "UPI" : "Cash"}` :
                          t(lang, "udhaar")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <div className={`text-lg font-extrabold ${o.status === "cancelled" ? "text-slate-300 line-through" : "text-brand"}`}>
                          ₹{Number(o.total || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {o.createdAt?.toDate
                            ? o.createdAt.toDate().toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                              })
                            : ""}
                        </div>
                      </div>
                      {o.status !== "cancelled" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/orders/${o.id}`)}
                            className="bg-slate-100 text-slate-700 px-2 py-1.5 rounded-lg text-xs font-bold"
                          >
                            ✏️
                          </button>
                          {!o.paid && (
                            <button
                              onClick={() => openPaymentModal(o)}
                              className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Check size={12} /> {t(lang, "paid")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Paid Modal */}
      {showPayModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold hi">{t(lang, "paymentMethod")}</h2>
                <div className="mt-2 bg-slate-100 px-3 py-1.5 rounded-lg inline-flex gap-2 items-center">
                  <span className="font-bold">₹{selectedOrder.total}</span>
                </div>
              </div>
              <button onClick={() => { setShowPayModal(false); setSelectedOrder(null); }} className="p-1 text-slate-500">
                <X size={22}/>
              </button>
            </div>
            <div className="space-y-3 mt-4">
              <button onClick={() => confirmOrderPayment("cash")}
                className="w-full p-4 bg-green-50 active:bg-green-200 rounded-xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Banknote size={24} className="text-white"/>
                </div>
                <div className="text-left">
                  <div className="font-bold hi">{t(lang, "cash")}</div>
                  <div className="text-xs text-slate-500 hi">{t(lang, "cashSub")}</div>
                </div>
              </button>
              <button onClick={() => confirmOrderPayment("upi")}
                className="w-full p-4 bg-blue-50 active:bg-blue-200 rounded-xl flex items-center gap-3">
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

      {/* Partial Payment Modal */}
      {showPartialModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold hi">💰 Payment Mila</h2>
                <p className="text-sm text-slate-500 hi mt-1">
                  कुल बाकी: ₹{(customer.udhaar || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setShowPartialModal(false)} className="p-1 text-slate-500">
                <X size={22}/>
              </button>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-slate-600 hi mb-2">कितना पैसा मिला? *</div>
              <div className="flex items-center gap-2 border rounded-xl p-3 focus-within:border-brand">
                <span className="text-2xl font-extrabold text-brand">₹</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                  className="flex-1 text-2xl font-extrabold outline-none"
                  autoFocus
                />
              </div>
              {partialAmount && Number(partialAmount) > 0 && (
                <p className="text-xs text-slate-500 hi mt-2">
                  Payment ke baad baaki: ₹{Math.max(0, (customer.udhaar || 0) - Number(partialAmount)).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <div className="text-xs font-bold text-slate-600 hi mb-2">Payment Method</div>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setPartialMethod("cash")}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border-2 transition-colors ${
                  partialMethod === "cash" ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 text-slate-600"
                }`}
              >
                <Banknote size={18}/> Cash
              </button>
              <button
                onClick={() => setPartialMethod("upi")}
                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border-2 transition-colors ${
                  partialMethod === "upi" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"
                }`}
              >
                <Smartphone size={18}/> UPI
              </button>
            </div>

            <button
              onClick={handlePartialPayment}
              disabled={savingPartial || !partialAmount || Number(partialAmount) <= 0}
              className="w-full bg-brand text-white py-3.5 rounded-xl font-bold hi text-base disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={20} strokeWidth={3}/>
              {savingPartial ? "सेव हो रहा है..." : `₹${partialAmount || 0} Received ✓`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
            }
