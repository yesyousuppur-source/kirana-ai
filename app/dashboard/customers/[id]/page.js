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

  // Payment method modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpiAlert, setShowUpiAlert] = useState(false);

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

  // Open Cash/UPI modal
  function openPaymentModal(order) {
    setSelectedOrder(order);
    setShowPayModal(true);
  }

  // Confirm payment with method
  async function confirmPayment(method) {
    if (!selectedOrder) return;

    // If UPI, check shop has UPI ID set
    if (method === "upi") {
      if (!shop?.upiId || !isValidUpiId(shop.upiId)) {
        setShowPayModal(false);
        setShowUpiAlert(true);
        return;
      }

      // Open UPI app first
      openUpiApp({
        upiId: shop.upiId,
        payeeName: shop.shopName || "Shop",
        amount: selectedOrder.total,
        note: `${selectedOrder.orderNumber || ""} ${customer.name}`,
      });

      // Wait briefly, then mark as paid (user comes back after payment)
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

    // Cash flow — direct mark
    await markOrderPaid(user.uid, selectedOrder.id, selectedOrder, "cash");
    await sendPaymentReceipt(selectedOrder, "cash");
    await load(user.uid);
    setShowPayModal(false);
    setSelectedOrder(null);
  }

  // Send WhatsApp receipt to customer
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
    // Open WhatsApp with pre-filled receipt
    window.open(waLink(customer.phone, msg), "_blank");
  }

  function sendReminder() {
    if (!customer.udhaar || customer.udhaar <= 0) {
      alert(t(lang, "noUdhaar"));
      return;
    }
    const msg = paymentReminderMsg(
      customer.nam
