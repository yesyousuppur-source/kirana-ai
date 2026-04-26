"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getOrders, markOrderPaid, getShop } from "@/lib/store";
import { waLink, orderConfirmMsg } from "@/lib/whatsapp";
import { ArrowLeft, Plus, Check, MessageCircle } from "lucide-react";


export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
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

  async function handleMarkPaid(o) {
    if (!confirm(`₹${o.total} paid mark करें?`)) return;
    await markOrderPaid(user.uid, o.id, o);
    await load(user.uid);
  }

  function sendConfirmation(o) {
    if (!o.customerPhone) { alert("ग्राहक का फ़ोन नंबर नहीं है"); return; }
    const msg = orderConfirmMsg(o.customerName, o.items, o.total, shop?.shopName || "हमारी दुकान");
    window.open(waLink(o.customerPhone, msg), "_blank");
  }

  const filtered = orders.filter((o) => {
    if (filter === "pending") return o.status === "pending" && !o.paid;
    if (filter === "unpaid") return !o.paid;
    if (filter === "paid") return o.paid;
    return true;
  });

  const totalUnpaid = orders.filter((o) => !o.paid).reduce((s, o) => s + Number(o.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24}/>
        </button>
        <h1 className="font-bold text-lg hi">ऑर्डर्स</h1>
        <button
          onClick={() => router.push("/dashboard/orders/new")}
          className="ml-auto bg-white text-brand rounded-full w-10 h-10 flex items-center justify-center shadow-md active:scale-95"
        >
          <Plus size={22} strokeWidth={3}/>
        </button>
      </header>

      <div className="p-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <div className="text-xs text-red-700 hi font-semibold">कुल बकाया</div>
          <div className="text-2xl font-extrabold text-red-700">₹{totalUnpaid.toLocaleString("en-IN")}</div>
        </div>

        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: "सभी" },
            { key: "unpaid", label: "बकाया" },
            { key: "pending", label: "पेंडिंग" },
            { key: "paid", label: "Paid" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold hi whitespace-nowrap ${
                filter === t.key ? "bg-brand text-white" : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-bold hi">कोई ऑर्डर नहीं मिला</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((o) => (
              <div key={o.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold hi truncate">{o.customerName || "ग्राहक"}</div>
                    <div className="text-xs text-slate-500 hi mt-0.5">{o.items}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                    o.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {o.paid ? "Paid ✓" : "उधार"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div className="text-xl font-extrabold text-brand">₹{o.total}</div>
                  <div className="flex gap-2">
                    {o.customerPhone && (
                      <button
                        onClick={() => sendConfirmation(o)}
                        className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <MessageCircle size={12}/> WhatsApp
                      </button>
                    )}
                    {!o.paid && (
                      <button
                        onClick={() => handleMarkPaid(o)}
                        className="bg-brand text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Check size={12}/> Paid
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 hi">
                  {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
