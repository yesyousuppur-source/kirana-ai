"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addOrder, getCustomers, getShop } from "@/lib/store";
import { waLink, orderConfirmMsg } from "@/lib/whatsapp";
import { t, getSavedLang } from "@/lib/i18n";
import { ArrowLeft, Check, Search, Hash } from "lucide-react";

export default function NewOrderPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendWA, setSendWA] = useState(true);
  const [lang, setLang] = useState("hi");
  const [nextOrderNum, setNextOrderNum] = useState(null);

  useEffect(() => {
    setLang(getSavedLang());
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace("/login"); return; }
      setUser(u);
      const [s, c] = await Promise.all([getShop(u.uid), getCustomers(u.uid)]);
      setShop(s);
      setCustomers(c);
      // Show what next order number will be
      const nextNum = (s?.orderCounter || 0) + 1;
      setNextOrderNum(`#${String(nextNum).padStart(4, "0")}`);
    });
    return () => unsub();
  }, [router]);

  async function handleSubmit() {
    if (!selected) { alert(t(lang, "selectCustomer")); return; }
    if (!items) { alert(t(lang, "fillItems")); return; }
    if (!total || isNaN(Number(total))) { alert(t(lang, "fillAmount")); return; }

    setLoading(true);
    try {
      const order = {
        customerId: selected.id,
        customerName: selected.name,
        customerPhone: selected.phone,
        items,
        total: Number(total),
        paid,
        status: "pending",
      };
      const result = await addOrder(user.uid, order);
      const orderNumber = `#${String(result.orderNumber).padStart(4, "0")}`;

      if (sendWA && selected.phone) {
        const msg = orderConfirmMsg(
          selected.name,
          items,
          total,
          shop?.shopName || "हमारी दुकान",
          lang,
          orderNumber
        );
        window.open(waLink(selected.phone, msg), "_blank");
      }
      router.replace("/dashboard");
    } catch (e) {
      console.error(e);
      alert(t(lang, "orderNotCreated"));
    }
    setLoading(false);
  }

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto pb-24">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24}/>
        </button>
        <h1 className="font-bold text-lg hi flex-1">{t(lang, "newOrderTitle")}</h1>
        {nextOrderNum && (
          <div className="bg-white/15 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold">
            <Hash size={12}/>
            {nextOrderNum.replace("#", "")}
          </div>
        )}
      </header>

      <div className="p-3 space-y-3">
        {/* Order number preview banner */}
        {nextOrderNum && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              <Hash size={18}/>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-blue-700 hi uppercase tracking-wider">
                {t(lang, "orderNumber")}
              </div>
              <div className="text-lg font-extrabold text-blue-900">{nextOrderNum}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs font-bold text-slate-600 hi mb-2">{t(lang, "chooseCustomer")} *</div>
          {selected ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="font-bold hi">{selected.name}</div>
                <div className="text-xs text-slate-600">{selected.phone}</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-brand font-bold hi"
              >
                {t(lang, "change")}
              </button>
            </div>
          ) : (
            <>
              <div className="relative mb-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(lang, "searchCust")}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg outline-none focus:border-brand text-sm hi"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {customers.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 hi mb-2">{t(lang, "noCustomers")}</p>
                    <button
                      onClick={() => router.push("/dashboard/customers")}
                      className="text-brand text-sm font-bold hi"
                    >
                      {t(lang, "addCustomersFirst")}
                    </button>
                  </div>
                ) : filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-lg border-b border-slate-100 last:border-0"
                  >
                    <div className="font-semibold hi text-sm">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.phone}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs font-bold text-slate-600 hi mb-2">{t(lang, "items")} *</div>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder={t(lang, "itemsPlaceholder")}
            rows="3"
            className="w-full p-3 border rounded-lg outline-none focus:border-brand text-sm hi resize-none"
          />
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs font-bold text-slate-600 hi mb-2">{t(lang, "totalAmount")} *</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-brand">₹</span>
            <input
              type="tel"
              inputMode="numeric"
              value={total}
              onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="flex-1 text-2xl font-extrabold p-2 border rounded-lg outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-bold hi">{t(lang, "paymentDone")}</div>
              <div className="text-xs text-slate-500 hi">
                {paid ? t(lang, "paymentYes") : t(lang, "paymentNo")}
              </div>
            </div>
            <button
              onClick={() => setPaid(!paid)}
              className={`w-14 h-8 rounded-full transition-colors relative ${paid ? "bg-brand" : "bg-slate-300"}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${paid ? "translate-x-7" : "translate-x-1"}`}></span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-bold hi">{t(lang, "sendWAConfirm")}</div>
              <div className="text-xs text-slate-500 hi">{t(lang, "waConfirmSub")}</div>
            </div>
            <input
              type="checkbox"
              checked={sendWA}
              onChange={(e) => setSendWA(e.target.checked)}
              className="w-5 h-5 accent-brand"
            />
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 max-w-3xl mx-auto">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand text-white py-3.5 rounded-xl font-bold hi text-base active:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Check size={20} strokeWidth={3}/>
          {loading ? t(lang, "saving") : t(lang, "createOrder")}
        </button>
      </div>
    </div>
  );
}
