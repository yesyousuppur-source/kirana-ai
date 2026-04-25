"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addCustomer, getCustomers, deleteCustomer, getShop } from "@/lib/store";
import { waLink, paymentReminderMsg } from "@/lib/whatsapp";
import { t, getSavedLang } from "@/lib/i18n";
import { ArrowLeft, Plus, Phone, MessageCircle, Trash2, Search, ChevronRight } from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newCust, setNewCust] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
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
    const data = await getCustomers(uid);
    setCustomers(data);
  }

  async function handleAdd() {
    if (!newCust.name || !newCust.phone) {
      alert(t(lang, "nameAndPhone"));
      return;
    }
    if (!/^[6-9]\d{9}$/.test(newCust.phone)) {
      alert(t(lang, "invalidPhone"));
      return;
    }
    setLoading(true);
    await addCustomer(user.uid, newCust);
    await load(user.uid);
    setNewCust({ name: "", phone: "" });
    setShowAdd(false);
    setLoading(false);
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!confirm(t(lang, "deleteConfirm"))) return;
    await deleteCustomer(user.uid, id);
    await load(user.uid);
  }

  function sendReminder(e, c) {
    e.stopPropagation();
    if (!c.udhaar || c.udhaar <= 0) {
      alert(t(lang, "noUdhaar"));
      return;
    }
    const msg = paymentReminderMsg(c.name, c.udhaar, shop?.shopName || "हमारी दुकान", lang);
    window.open(waLink(c.phone, msg), "_blank");
  }

  function openLedger(customerId) {
    router.push(`/dashboard/customers/${customerId}`);
  }

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg hi">{t(lang, "customersCount")} ({customers.length})</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-white text-brand rounded-full w-10 h-10 flex items-center justify-center shadow-md active:scale-95"
        >
          <Plus size={22} strokeWidth={3}/>
        </button>
      </header>

      <div className="p-3">
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(lang, "searchCustomer")}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:border-brand bg-white hi"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-bold hi mb-1">{t(lang, "noCustomers")}</p>
            <p className="text-sm text-slate-500 hi mb-4">{t(lang, "addFirstCustomer")}</p>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-brand text-white px-5 py-2.5 rounded-xl font-bold hi"
            >
              {t(lang, "addFirstCustomerBtn")}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const init = (c.name || "?").split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
              return (
                <div
                  key={c.id}
                  onClick={() => openLedger(c.id)}
                  className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 active:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-extrabold">
                      {init}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold hi truncate">{c.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone size={11}/> {c.phone}
                      </div>
                    </div>
                    <div className="text-right">
                      {c.udhaar > 0 ? (
                        <div className="text-xs font-bold text-red-600 hi">{t(lang, "udhaar")}</div>
                      ) : null}
                      <div className={`text-sm font-extrabold ${c.udhaar > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        ₹{c.udhaar || 0}
                      </div>
                      <div className="text-[10px] text-slate-500 hi">{c.totalOrders || 0} {t(lang, "ordersLabel")}</div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                  </div>
                  <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={(e) => sendReminder(e, c)}
                      className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-xs font-bold hi flex items-center justify-center gap-1 active:bg-green-100"
                    >
                      <MessageCircle size={14}/> {t(lang, "reminder")}
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, c.id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg active:bg-red-100"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <h2 className="text-lg font-bold hi mb-4">{t(lang, "addCustomer")}</h2>
            <input
              value={newCust.name}
              onChange={(e) => setNewCust({...newCust, name: e.target.value})}
              placeholder={t(lang, "namePlaceholder")}
              className="w-full px-4 py-3 border rounded-xl mb-3 outline-none focus:border-brand hi"
            />
            <div className="flex gap-2 mb-4">
              <span className="flex items-center px-3 border rounded-xl bg-slate-50 font-bold text-slate-600">+91</span>
              <input
                value={newCust.phone}
                onChange={(e) => setNewCust({...newCust, phone: e.target.value.replace(/\D/g, "")})}
                maxLength="10"
                inputMode="numeric"
                placeholder={t(lang, "phonePlaceholder")}
                className="flex-1 px-4 py-3 border rounded-xl outline-none focus:border-brand"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowAdd(false); setNewCust({name:"",phone:""}); }}
                className="flex-1 py-3 border rounded-xl font-bold hi"
              >
                {t(lang, "cancel")}
              </button>
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 bg-brand text-white py-3 rounded-xl font-bold hi disabled:opacity-50"
              >
                {loading ? "..." : t(lang, "add") + " ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
              }
