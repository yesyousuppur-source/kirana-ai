"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getShop } from "@/lib/store";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      const shop = await getShop(user.uid);
      if (!shop) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-brand">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
          <span className="text-brand text-3xl font-bold hi">कि</span>
        </div>
        <h1 className="text-3xl font-bold hi mb-2">किराना AI</h1>
        <p className="text-white/80 text-sm hi">लोड हो रहा है...</p>
      </div>
    </div>
  );
}
