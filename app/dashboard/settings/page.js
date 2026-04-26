"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, FileText, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 max-w-3xl mx-auto">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Settings</h1>
      </header>

      <div className="p-4 space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Legal
        </p>

        <button
          onClick={() => router.push("/privacy")}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-slate-100 active:bg-slate-50"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold">Privacy Policy</div>
            <div className="text-xs text-slate-500">How we use your data</div>
          </div>
        </button>

        <button
          onClick={() => router.push("/terms")}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-slate-100 active:bg-slate-50"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FileText size={20} className="text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold">Terms of Service</div>
            <div className="text-xs text-slate-500">Rules for using Kirana AI</div>
          </div>
        </button>

        <button
          onClick={() => router.push("/refund")}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-slate-100 active:bg-slate-50"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <RefreshCw size={20} className="text-yellow-600" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold">Refund Policy</div>
            <div className="text-xs text-slate-500">Cancellation & refunds</div>
          </div>
        </button>

        <p className="text-center text-xs text-slate-400 pt-4">
          Kirana AI • Made with ❤️ for Indian shopkeepers
        </p>
      </div>
    </div>
  );
            }
