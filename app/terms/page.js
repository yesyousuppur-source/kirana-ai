"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Terms of Service</h1>
      </header>
      <div className="max-w-3xl mx-auto p-5 bg-white">
        <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-4">
          <strong>Last Updated:</strong> April 25, 2026
        </p>

        <p className="text-sm mb-4">
          Welcome to <strong>Kirana AI</strong>. These Terms govern your use of our
          application operated by <strong>Jeet Singh</strong> (Sole Proprietor),
          based in Gurugram, Haryana, India.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">1. Service Description</h2>
        <p className="text-sm mb-3">
          Kirana AI is a digital ledger and customer management application for kirana
          (general grocery) shop owners in India.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">2. Account & Eligibility</h2>
        <p className="text-sm mb-3">
          You must be 18+ years old. You are responsible for keeping your account secure.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">3. Acceptable Use</h2>
        <p className="text-sm mb-3">
          Do not use the Service for spam, illegal activity, or to harm others. Get your
          customers' consent before adding their information.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">4. Payment Processing</h2>
        <p className="text-sm mb-3">
          Kirana AI is NOT a payment processor. UPI links open your installed UPI apps
          (PhonePe, GPay, Paytm). Payments occur directly between customer and shop via NPCI.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">5. Subscription</h2>
        <p className="text-sm mb-3">
          7-day free trial. Paid plans (₹99/month) may be introduced with prior notice.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">6. Disclaimer & Liability</h2>
        <p className="text-sm mb-3">
          The Service is provided "as is" without warranties. We are not liable for
          indirect damages or third-party service issues. Maximum liability is limited to
          amounts paid in the last 3 months or ₹1,000, whichever is lower.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">7. Termination</h2>
        <p className="text-sm mb-3">
          You may stop using the Service anytime. We may suspend accounts that violate
          these Terms.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">8. Governing Law</h2>
        <p className="text-sm mb-3">
          These Terms are governed by Indian law. Disputes will be handled by courts in
          Gurugram, Haryana, India.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">9. Refunds</h2>
        <p className="text-sm mb-3">
          See our <a href="/refund" className="text-brand underline">Refund Policy</a>.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">10. Contact</h2>
        <div className="bg-slate-50 p-4 rounded-lg text-sm">
          <p><strong>Email:</strong> yesyousuppur@gmail.com</p>
          <p><strong>Operator:</strong> Jeet Singh</p>
          <p><strong>Address:</strong> Gurugram, Haryana, India</p>
          <p><strong>Website:</strong> www.yesyoupro.com</p>
        </div>

        <p className="text-xs text-slate-500 mt-6 text-center">
          By using Kirana AI, you agree to these Terms.
        </p>
      </div>
    </div>
  );
}
