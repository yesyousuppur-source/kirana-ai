"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getShop,
  getCustomer,
  getCustomerOrders,
  markOrderPaid,
} from "@/lib/store";
import { waLink, paymentReminderMsg, paymentReceivedMsg } from "@/lib/whatsapp";
import { openUpiApp, isValidUpiId } from "@/lib/upi";
import { t, getSavedLang } from "@/lib/i18n";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Check,
  Calendar,
  ShoppingBag,
  Banknote,
  Smartphone,
  X,
  Hash,
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

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpiAlert, setShowUpiAlert] = useState(false);

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
        console.error("Init error:", e);
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
      // Load orders separately so customer shows even if orders fail
      try {
        const o = await getCustomerOrders(uid, customerId);
        setOrders(o);
      } catch (orderErr) {
        console.error("Orders load error:", orderErr);
        setOrders([]);
      }
    } catch (e) {
      console.error("Load error:", e);
    }
    setLoading(false);
  }

  function openPaymentModal(order) {
    setSelectedOrder(order);
    setShowPayModal(true);
  }

  async function confirmPayment(method) {
    if (!selectedOrder) return;

    if (method === "upi") {
      if (!shop?.upiId || !isValidUpiId(shop.upiId)) {
        setShowPayModal(false);
        setShowUpiAlert(true);
        return;
      }

      openUpiApp({
        upiId: shop.upiId,
        payeeName: shop.shopName || "Shop",
        amount: selectedOrder.total,
        note: `${selectedOrder.orderNumber || ""} ${customer.name}`,
      });

      setTimeout(async () => {
        const confirmPaid = confirm(
          `${t(lang, "markPaid")} (₹${selectedOrder.total} via UPI)`
        );
        if (confirmPaid) {
          await markOrderPaid(user.uid, selectedOrder.id, selectedOrder, "upi");
          await sendPaymentReceipt(selectedOrder, "upi");
          await load(user.uid);
        }
        setShowPayModal(false);
        setSelectedOrder(null);
      }, 2500);
      return;
    }

    await markOrderPaid(user.uid, selectedOrder.id, selectedOrder, "cash");
    await sendPaymentReceipt(selectedOrder, "cash");
    await load(user.uid);
    setShowPayModal(false);
    setSelectedOrder(null);
  }

  async function sendPaymentReceipt(order, method) {
    if (!customer.phone) return;
    const msg = paymentReceivedMsg(
      customer.name,
      order.total,
      shop?.shopName || "हमारी दुकान",
      order.orderNumber || "",
      method,
      lang
    );
    window.open(waLink(customer.phone, msg), "_blank");
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
    const date = o.createdAt.toDate();
    const dateKey = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div>
          <p className="text-slate-700 font-bold mb-2">Customer not found</p>
          <button
            onClick={() => router.replace("/dashboard/customers")}
            className="bg-brand text-white px-4 py-2 rounded-xl font-bold"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const init = (customer.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <a
              href={`tel:${customer.phone}`}
              className="text-sm opacity-90 flex items-center gap-1 hover:underline"
            >
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

      <div className="px-3 py-3 sticky top-[60px] bg-slate-50 z-10">
        <button
          onClick={sendReminder}
          disabled={!customer.udhaar || customer.udhaar <= 0}
          className="w-full bg-green-50 text-green-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 active:bg-green-100 disabled:opacity-40 hi"
        >
          <MessageCircle size={16} /> {t(lang, "reminder")}
        </button>
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
                <h3 className="text-xs font-bold text-slate-600 hi">{date}</h3>
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-semibold">
                  ₹{dayOrders.reduce((s, o) => s + Number(o.total || 0), 0)}
                </span>
              </div>

              <div className="space-y-2">
                {dayOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-100"
                  >
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
                        <div className="text-sm hi">{o.items || "Order"}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          o.paid
                            ? o.paymentMethod === "upi"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {o.paid
                          ? `✓ ${o.paymentMethod === "upi" ? "UPI" : "Cash"}`
                          : t(lang, "udhaar")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div>
                        <div className="text-lg font-extrabold text-brand">
                          ₹{Number(o.total || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {o.createdAt?.toDate
                            ? o.createdAt.toDate().toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </div>
                      </div>
                      {!o.paid && (
                        <button
                          onClick={() => openPaymentModal(o)}
                          className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:bg-brand-dark"
                        >
                          <Check size={12} /> {t(lang, "paid")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showPayModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold hi">{t(lang, "paymentMethod")}</h2>
                <p className="text-sm text-slate-500 hi mt-1">{t(lang, "paymentMethodSub")}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <span className="text-sm font-semibold">₹{selectedOrder.total}</span>
                  {selectedOrder.orderNumber && (
                    <span className="text-xs text-slate-500">
                      • {typeof selectedOrder.orderNumber === "number"
                          ? `#${String(selectedOrder.orderNumber).padStart(4, "0")}`
                          : selectedOrder.orderNumber}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setShowPayModal(false); setSelectedOrder(null); }}
                className="p-1 text-slate-500"
              >
                <X size={22}/>
              </button>
            </div>

            <div className="space-y-3 mt-5">
              <button
                onClick={() => confirmPayment("cash")}
                className="w-full p-4 bg-green-50 hover:bg-green-100 active:bg-green-200 rounded-xl flex items-center gap-3 border-2 border-transparent active:border-green-500 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Banknote size={24} className="text-white"/>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold hi">{t(lang, "cash")}</div>
                  <div className="text-xs text-slate-500 hi">{t(lang, "cashSub")}</div>
                </div>
              </button>

              <button
                onClick={() => confirmPayment("upi")}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-xl flex items-center gap-3 border-2 border-transparent active:border-blue-500 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={24} className="text-white"/>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold hi">{t(lang, "upi")}</div>
                  <div className="text-xs text-slate-500 hi">{t(lang, "upiSub")}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpiAlert && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-3">
              <Smartphone size={28} className="text-yellow-600"/>
            </div>
            <h3 className="font-bold text-lg hi mb-1">{t(lang, "upiNotSet")}</h3>
            <p className="text-sm text-slate-600 hi mb-4">
              {t(lang, "upiNotSetMsg")}
            </p>
            <button
              onClick={() => setShowUpiAlert(false)}
              className="w-full bg-brand text-white py-2.5 rounded-xl font-bold hi"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
