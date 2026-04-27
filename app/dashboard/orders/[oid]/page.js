"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getShop, getOrders, updateOrder } from "@/lib/store";
import { waLink, orderConfirmMsg } from "@/lib/whatsapp";
import { t, getSavedLang } from "@/lib/i18n";
import { ArrowLeft, Check } from "lucide-react";

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.oid;

  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState(false);
  const [sendWA, setSendWA] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState("hi");

  useEffect(() => {
    setLang(getSavedLang());
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.replace("/login"); return; }
      setUser(u);
      const s = await getShop(u.uid);
      setShop(s);
      const allOrders = await getOrders(u.uid, 90);
      const found = allOrders.find((o) => o.id === orderId);
      if (!found) {
        alert("Order not found");
        router.back();
        return;
      }
      setOrder(found);
      setItems(found.items || "");
      setTotal(String(found.total || ""));
      setPaid(found.paid || false);
      setLoading(false);
    });
    return () => unsub();
  }, [router, orderId]);

  async function handleSave() {
    if (!items) { alert(t(lang, "fillItems")); return; }
    if (!total || isNaN(Number(total))) { alert(t(lang, "fillAmount")); return; }
    setSaving(true);
    try {
      await updateOrder(user.uid, orderId, order, { items, total, paid });
      if (sendWA && order.customerPhone) {
        const orderNum = typeof order.orderNumber === "number"
          ? `#${String(order.orderNumber).padStart(4, "0")}`
          : order.orderNumber || "";
        const msg = orderConfirmMsg(
          order.customerName || "Customer",
          items,
          total,
          shop?.shopName || "हमारी दुकान",
          lang,
          orderNum,
          shop?.upiId || ""
        );
        window.open(waLink(order.customerPhone, msg), "_blank");
      }
      router.back();
    } catch (e) {
      console.error(e);
      alert("Save failed. Try again.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto pb-24">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg hi flex-1">Order Edit करें</h1>
        {order?.orderNumber && (
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
            #{typeof order.orderNumber === "number"
              ? String(order.orderNumber).padStart(4, "0")
              : order.orderNumber}
          </div>
        )}
      </header>

      <div className="p-3 space-y-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="text-xs text-blue-700 font-bold hi">ग्राहक</div>
          <div className="font-bold hi">{order?.customerName || "Customer"}</div>
          <div className="text-xs text-slate-500">{order?.customerPhone}</div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs font-bold text-slate-600 hi mb-2">
            {t(lang, "items")} *
          </div>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder={t(lang, "itemsPlaceholder")}
            rows="3"
            className="w-full p-3 border rounded-lg outline-none focus:border-brand text-sm hi resize-none"
          />
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="text-xs font-bold text-slate-600 hi mb-2">
            {t(lang, "totalAmount")} *
          </div>
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

        {/* FIXED: Toggle button overflow */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-bold hi">{t(lang, "paymentDone")}</div>
              <div className="text-xs text-slate-500 hi">
                {paid ? t(lang, "paymentYes") : t(lang, "paymentNo")}
              </div>
            </div>
            <button
              onClick={() => setPaid(!paid)}
              className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${paid ? "bg-brand" : "bg-slate-300"}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${paid ? "translate-x-7" : "translate-x-1"}`}></span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm">
          <label className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-bold hi">{t(lang, "sendWAConfirm")}</div>
              <div className="text-xs text-slate-500 hi">Updated order customer ko bhejein</div>
            </div>
            <input
              type="checkbox"
              checked={sendWA}
              onChange={(e) => setSendWA(e.target.checked)}
              className="w-5 h-5 accent-brand flex-shrink-0"
            />
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 max-w-3xl mx-auto">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand text-white py-3.5 rounded-xl font-bold hi text-base active:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Check size={20} strokeWidth={3} />
          {saving ? "सेव हो रहा है..." : "बदलाव सेव करें"}
        </button>
      </div>
    </div>
  );
}
