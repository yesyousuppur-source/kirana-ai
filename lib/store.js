// Firestore helpers — sab DB operations yahaan
import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  deleteDoc,
  increment,
  runTransaction,
} from "firebase/firestore";

// ============ SHOP ============
export async function createShop(uid, shopData) {
  await setDoc(doc(db, "shops", uid), {
    ...shopData,
    language: shopData.language || "hi",
    upiId: shopData.upiId || "",
    orderCounter: 0,
    createdAt: serverTimestamp(),
    plan: "trial",
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

export async function getShop(uid) {
  const snap = await getDoc(doc(db, "shops", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateShop(uid, data) {
  await updateDoc(doc(db, "shops", uid), data);
}

// ============ CUSTOMERS ============
export async function addCustomer(uid, customer) {
  const ref = await addDoc(collection(db, "shops", uid, "customers"), {
    ...customer,
    udhaar: 0,
    totalOrders: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getCustomers(uid) {
  const q = query(
    collection(db, "shops", uid, "customers"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getCustomer(uid, customerId) {
  const snap = await getDoc(doc(db, "shops", uid, "customers", customerId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateCustomer(uid, customerId, data) {
  await updateDoc(doc(db, "shops", uid, "customers", customerId), data);
}

export async function deleteCustomer(uid, customerId) {
  await deleteDoc(doc(db, "shops", uid, "customers", customerId));
}

// ============ ORDERS ============

// Get next order number using transaction (race-condition safe)
async function getNextOrderNumber(uid) {
  const shopRef = doc(db, "shops", uid);
  const newNumber = await runTransaction(db, async (transaction) => {
    const shopDoc = await transaction.get(shopRef);
    if (!shopDoc.exists()) {
      throw new Error("Shop not found");
    }
    const currentCounter = shopDoc.data().orderCounter || 0;
    const next = currentCounter + 1;
    transaction.update(shopRef, { orderCounter: next });
    return next;
  });
  return newNumber;
}

// Format order number as #0001, #0002, etc.
export function formatOrderNumber(num) {
  return `#${String(num || 0).padStart(4, "0")}`;
}

export async function addOrder(uid, order) {
  // Get next order number
  const orderNum = await getNextOrderNumber(uid);

  const ref = await addDoc(collection(db, "shops", uid, "orders"), {
    ...order,
    orderNumber: orderNum,
    createdAt: serverTimestamp(),
    status: order.status || "pending",
  });

  if (order.customerId) {
    const customerRef = doc(db, "shops", uid, "customers", order.customerId);
    const udhaarIncrement = order.paid ? 0 : Number(order.total || 0);
    await updateDoc(customerRef, {
      totalOrders: increment(1),
      udhaar: increment(udhaarIncrement),
      lastOrderAt: serverTimestamp(),
    });
  }
  return { id: ref.id, orderNumber: orderNum };
}

export async function getOrders(uid, limitDays = 30) {
  const cutoff = new Date(Date.now() - limitDays * 24 * 60 * 60 * 1000);
  const q = query(
    collection(db, "shops", uid, "orders"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((o) => o.createdAt && o.createdAt.toDate() > cutoff);
}

export async function getTodayOrders(uid) {
  const all = await getOrders(uid, 1);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return all.filter((o) => o.createdAt && o.createdAt.toDate() >= start);
}

// Mark order as paid with payment method (cash/upi)
export async function markOrderPaid(uid, orderId, order, paymentMethod = "cash") {
  await updateDoc(doc(db, "shops", uid, "orders", orderId), {
    paid: true,
    paymentMethod, // "cash" or "upi"
    paidAt: serverTimestamp(),
  });
  if (order.customerId && order.total) {
    const customerRef = doc(db, "shops", uid, "customers", order.customerId);
    await updateDoc(customerRef, {
      udhaar: increment(-Number(order.total)),
    });
  }
}

export async function getCustomerOrders(uid, customerId) {
  const q = query(
    collection(db, "shops", uid, "orders"),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
