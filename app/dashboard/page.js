"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getShop,
  getTodayOrders,
  getCustomers,
  getOrders,
} from "@/lib/store";
import {
  Bell,
  Plus,
  Users,
  MessageSquare,
  Clock,
  TrendingUp,
  LogOut,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace("/login"); return; }
      setUser(u);
      const s = await getShop(u.uid);
      if (!s) { router.replace("/onboarding"); return; }
      setShop(s);
      await loadData(u.uid);
    });
    return () => unsub();
  }, [router]);

  async function loadData(uid) {
    setLoading(true);
    try {
      const [today, allOrders, customers] = await Promise.all([
        getTodayOrders(uid),
        getOrders(uid, 7),
        getCustomers(uid),
      ]);
      setTodayOrders(today);
      setPendingOrders(allOrders.filter((o) => o.status === "pending"));
      setTopCustomers(
        customers.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0)).slice(0, 3)
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const initials = (shop?.ownerName || "")
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  if (!shop) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand">
        <p className="text-white hi">लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white max-w-3xl mx-auto">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-brand font-extrabold text-lg hi">कि</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-lg hi truncate">किराना AI</div>
            <div className="text-xs opacity-90 hi truncate">{shop.shopName}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
          >
            <Settings size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center relative">
            <Bell size={20} />
            {pendingOrders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand"></span>
            )}
          </button>
          <button
            onClick={() => { if(confirm("Logout करें?")) { signOut(auth); } }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-yellow-900 font-extrabold text-sm"
          >
            {initials || "👤"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex gap-2 p-2.5 overflow-hidden bg-slate-50">
        <section className="w-[40%] flex flex-col gap-2 overflow-y-auto no-scrollbar pb-2">
          <div className="bg-gradient-to-b from-green-50 to-white border-l-4 border-brand rounded-xl p-2.5 shadow-sm">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 hi">
              आज के ऑर्डर्स
              <span className="text-[9px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">● LIVE</span>
            </div>
            <div className="text-3xl font-extrabold hi mt-1.5">{todayOrders.length}</div>
            <div className="text-sm font-semibold text-slate-500 hi">ऑर्डर्स</div>
            <div className="text-xl font-extrabold text-brand mt-1">
              ₹{todayRevenue.toLocaleString("en-IN")}
              {todayRevenue > 0 && (
                <span className="text-[10px] font-bold text-brand-dark bg-green-100 px-1.5 py-0.5 rounded-md ml-1">
                  <TrendingUp size={10} className="inline"/> Live
                </span>
              )}
            </div>
            <button
              onClick={() => router.push("/dashboard/orders/new")}
              className="w-full bg-brand text-white rounded-xl py-2.5 px-3 text-xs font-bold hi mt-2.5 flex items-center justify-center gap-1.5 active:bg-brand-dark shadow-sm"
            >
              <Plus size={14} strokeWidth={3}/> नया ऑर्डर
            </button>
          </div>

          <div className="bg-gradient-to-b from-yellow-50 to-white border-l-4 border-yellow-500 rounded-xl p-2.5 shadow-sm">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 hi">
              पेंडिंग
              {pendingOrders.length > 0 && (
                <span className="text-[9px] font-bold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">देरी</span>
              )}
            </div>
            <div className="text-3xl font-extrabold hi mt-1.5 flex items-center gap-1">
              {pendingOrders.length > 0 && (
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full pulse-red"></span>
              )}
              {pendingOrders.length}
            </div>
            <div className="text-sm font-semibold text-slate-500 hi">पेंडिंग ऑर्डर</div>
            <button
              onClick={() => router.push("/dashboard/orders")}
              className="w-full bg-white border-2 border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold hi mt-2.5 active:bg-slate-50 shadow-sm"
            >
              सभी देखें →
            </button>
          </div>

          <div className="bg-gradient-to-b from-blue-50 to-white border-l-4 border-blue-500 rounded-xl p-2.5 shadow-sm">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 hi">
              टॉप कस्टमर
              <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full hi">इस हफ्ते</span>
            </div>
            <div className="mt-2 space-y-1">
              {topCustomers.length === 0 ? (
                <button
                  onClick={() => router.push("/dashboard/customers")}
                  className="text-xs text-blue-600 font-semibold hi py-2 w-full"
                >
                  + पहला कस्टमर जोड़ें
                </button>
              ) : topCustomers.map((c, i) => {
                const colors = [
                  "from-blue-400 to-blue-600",
                  "from-pink-400 to-pink-600",
                  "from-green-400 to-green-600",
                ];
                const init = (c.name || "?").split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
                return (
                  <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-dashed border-slate-200 last:border-0">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm`}>
                      {init}
                    </div>
                    <div className="text-xs font-semibold truncate flex-1 hi">{c.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold">
                      <span className="text-blue-600 font-extrabold">{c.totalOrders || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-[60%] flex flex-col min-w-0">
          <div className="flex items-center justify-between px-1 pb-1.5">
            <h3 className="text-sm font-bold hi flex items-center gap-1.5">
              <MessageSquare size={16} className="text-brand"/>
              हाल की गतिविधि
            </h3>
          </div>

          <div className="wa-bg rounded-xl p-2.5 flex-1 overflow-y-auto no-scrollbar shadow-inner">
            <div className="flex justify-center mb-2.5">
              <span className="bg-white/85 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-lg shadow-sm hi">आज</span>
            </div>

            {todayOrders.length === 0 && pendingOrders.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="text-5xl mb-3">🛒</div>
                <p className="text-sm font-bold hi mb-1">अभी कोई ऑर्डर नहीं</p>
                <p className="text-xs text-slate-600 hi mb-4">
                  पहला ऑर्डर जोड़ कर शुरुआत करें
                </p>
                <button
                  onClick={() => router.push("/dashboard/orders/new")}
                  className="bg-brand text-white px-4 py-2 rounded-xl font-bold text-sm hi active:bg-brand-dark"
                >
                  + नया ऑर्डर
                </button>
              </div>
            ) : (
              <>
                {todayOrders.slice(0, 6).map((o) => (
                  <div key={o.id} className="bg-white rounded-lg p-2 mb-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold text-pink-600 hi">{o.customerName || "ग्राहक"}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${o.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {o.paid ? "● Paid" : "● उधार"}
                      </span>
                    </div>
                    <div className="text-xs hi mb-1">{o.items || "ऑर्डर"}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-brand">₹{o.total}</span>
                      <span className="text-[9px] text-slate-500">
                        {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </main>

      <nav className="bg-brand px-3 pt-2.5 pb-3.5 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
        <button
          onClick={() => router.push("/dashboard/customers")}
          className="flex-1 bg-white/12 border border-white/20 text-white rounded-xl py-2 flex flex-col items-center gap-0.5 text-[11px] font-bold hi active:scale-95 transition-transform"
        >
          <Users size={20}/>
          ग्राहक
        </button>
        <button
          onClick={() => router.push("/dashboard/orders/new")}
          className="flex-1 bg-white text-brand-dark rounded-xl py-2 flex flex-col items-center gap-0.5 text-[11px] font-bold hi active:scale-95 transition-transform shadow-md"
        >
          <Plus size={20} strokeWidth={3}/>
          नया ऑर्डर
        </button>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="flex-1 bg-white/12 border border-white/20 text-white rounded-xl py-2 flex flex-col items-center gap-0.5 text-[11px] font-bold hi active:scale-95 transition-transform"
        >
          <Clock size={20}/>
          ऑर्डर्स
        </button>
        <button
          onClick={() => router.push("/dashboard/settings")}
          className="flex-1 bg-white/12 border border-white/20 text-white rounded-xl py-2 flex flex-col items-center gap-0.5 text-[11px] font-bold hi active:scale-95 transition-transform"
        >
          <Settings size={20}/>
          सेटिंग्स
        </button>
      </nav>
    </div>
  );
}
