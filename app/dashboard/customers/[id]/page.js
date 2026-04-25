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
import { waLink, paymentReminderMsg } from "@/lib/whatsapp";
import { generateLedgerPDF } from "@/lib/pdf";
import { t, getSavedLang } from "@/lib/i18n";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  FileText,
  Check,
  Calendar,
  ShoppingBag,
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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [lang, setLang] = useState("hi");

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
    setLoading(true);
    try {
      const [c, o] = await Promise.all([
        getCustomer(uid, customerId),
        getCustomerOrders(uid, customerId),
      ]);
      if (!c) {
        alert("Customer not found");
        router.replace("/dashboard/customers");
        return;
      }
      setCustomer(c);
      setOrders(o);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleMarkPaid(o) {
    if (!confirm(`₹${o.total} ${t(lang, "markPaid")}`)) return;
    await markOrderPaid(user.uid, o.id, o);
    await load(user.uid);
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

  async function handlePDF() {
    if (orders.length === 0) {
      alert("No orders to export");
      return;
    }
    setPdfLoading(true);
    try {
      await generateLedgerPDF(shop, customer, orders);
    } catch (e) {
      console.error(e);
      alert("PDF generation failed");
    }
    setPdfLoading(false);
  }

  // Group orders by date
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
        <p className="text-slate-500 hi">Loading...</p>
      </div>
    );
  }

  if (!customer) return null;

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
      {/* Header */}
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg hi truncate flex-1">{customer.name}</h1>
      </header>

      {/* Customer Info Card */}
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

        {/* Stats */}
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
      <div className="px-3 py-3 flex gap-2 sticky top-[60px] bg-slate-50 z-10">
        <button
          onClick={sendReminder}
          disabled={!customer.udhaar || customer.udhaar <= 0}
          className="flex-1 bg-green-50 text-green-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 active:bg-green-100 disabled:opacity-40 hi"
        >
          <MessageCircle size={16} /> {t(lang, "reminder")}
        </button>
        <button
          onClick={handlePDF}
          disabled={pdfLoading || orders.length === 0}
          className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 active:bg-blue-100 disabled:opacity-40 hi"
        >
          <FileText size={16} /> {pdfLoading ? "..." : "PDF"}
        </button>
      </div>

      {/* Orders Timeline */}
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
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <Calendar size={14} className="text-slate-400" />
                <h3 className="text-xs font-bold text-slate-600 hi">{date}</h3>
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-semibold">
                  ₹{dayOrders.reduce((s, o) => s + Number(o.total || 0), 0)}
                </span>
              </div>

              {/* Orders for this day */}
              <div className="space-y-2">
                {dayOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="text-sm hi flex-1">{o.items || "Order"}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                          o.paid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {o.paid ? "✓ " + t(lang, "paid") : t(lang, "udhaar")}
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
                          onClick={() => handleMarkPaid(o)}
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
    </div>
  );
}
