"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Refund Policy</h1>
      </header>

      <div className="max-w-3xl mx-auto p-5 bg-white">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Cancellation & Refund Policy</h1>
          <p className="text-sm text-slate-500 mb-6">
            <strong>Last Updated:</strong> April 25, 2026
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            This Refund Policy applies to paid subscriptions of <strong>Kirana AI</strong>,
            operated by <strong>Jeet Singh</strong> (Sole Proprietor) in Gurugram, Haryana,
            India. We aim to be transparent and fair with our refund practices.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">1. Free Trial</h2>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
            <p className="text-sm">
              <strong>7-Day Free Trial:</strong> Every new account receives a full 7-day
              free trial with access to all features. No payment is required during this
              period. You can stop using the Service anytime during the trial without any
              charges.
            </p>
          </div>

          <h2 className="text-lg font-bold mt-6 mb-2">2. Subscription Cancellation</h2>
          <p className="text-sm mb-3">
            You may cancel your paid subscription at any time:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>By contacting us at <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></li>
            <li>By using the cancellation option in your account settings (when available)</li>
            <li>Cancellation takes effect at the end of your current billing period</li>
            <li>You will continue to have access until the end of the paid period</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">3. Refund Eligibility</h2>

          <h3 className="text-base font-bold mt-4 mb-1">3.1 Refunds Within 7 Days</h3>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-3">
            <p className="text-sm">
              If you experience significant technical issues that prevent you from using
              the Service, you may request a full refund <strong>within 7 days of payment</strong>.
              We will review your case and process eligible refunds within 7-14 business days.
            </p>
          </div>

          <h3 className="text-base font-bold mt-4 mb-1">3.2 Conditions for Refund</h3>
          <p className="text-sm mb-2">A refund may be granted if:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>The Service had verifiable technical issues that we could not resolve</li>
            <li>You were charged due to a billing error on our end</li>
            <li>You did not use the Service after subscribing (no orders/customers added)</li>
            <li>The request is made within 7 days of the charge</li>
          </ul>

          <h3 className="text-base font-bold mt-4 mb-1">3.3 Non-Refundable Cases</h3>
          <p className="text-sm mb-2">Refunds will NOT be issued in the following cases:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>You used the Service substantially during the billing period (added customers, created orders)</li>
            <li>The request is made more than 7 days after the charge</li>
            <li>You violated the Terms of Service</li>
            <li>Issues caused by third-party services (your phone, internet, WhatsApp, UPI apps) outside our control</li>
            <li>You changed your mind without trying to use the Service properly</li>
            <li>You did not use the 7-day free trial period properly to evaluate the Service</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">4. How to Request a Refund</h2>
          <p className="text-sm mb-2">To request a refund, please email us at:</p>
          <div className="bg-slate-50 p-4 rounded-lg text-sm mb-3">
            <p><strong>Email:</strong> <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></p>
            <p><strong>Subject:</strong> Refund Request — [Your Phone Number]</p>
          </div>
          <p className="text-sm mb-2">Include the following details:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Phone number associated with your account</li>
            <li>Date of payment</li>
            <li>Amount paid</li>
            <li>Reason for refund request</li>
            <li>Any error screenshots (if applicable)</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">5. Refund Processing</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>We will respond to your refund request within <strong>3 business days</strong></li>
            <li>If approved, refunds will be processed within <strong>7-14 business days</strong></li>
            <li>Refunds are issued via the original payment method (e.g., UPI, Razorpay)</li>
            <li>Bank processing times may add 3-7 additional days to receive funds</li>
            <li>Refunds will be in INR (Indian Rupees) only</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">6. Partial Refunds</h2>
          <p className="text-sm mb-3">
            We do not offer pro-rata or partial refunds for the unused portion of a
            monthly subscription. If you cancel mid-cycle, you will retain access until
            the end of the paid period, but no refund will be issued for the unused days.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">7. Failed Payments</h2>
          <p className="text-sm mb-3">
            If a payment is unsuccessful or charged twice due to a technical glitch:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Contact us immediately at <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></li>
            <li>We will investigate and refund any duplicate or erroneous charges</li>
            <li>Such refunds will be processed at high priority (within 7 days)</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">8. Changes to Refund Policy</h2>
          <p className="text-sm mb-3">
            We may update this Refund Policy from time to time. Changes will be reflected
            on this page with an updated "Last Updated" date. The policy in effect at the
            time of your purchase will apply to that transaction.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">9. Contact Us</h2>
          <div className="bg-slate-50 p-4 rounded-lg text-sm">
            <p><strong>Email:</strong> <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></p>
            <p><strong>Operator:</strong> Jeet Singh (Sole Proprietor, "Kirana AI")</p>
            <p><strong>Address:</strong> Gurugram, Haryana, India</p>
            <p><strong>Website:</strong> <a href="https://www.yesyoupro.com" className="text-brand underline">www.yesyoupro.com</a></p>
          </div>

          <p className="text-xs text-slate-500 mt-8 text-center">
            We are committed to fair and transparent practices. If you have any concerns, please reach out to us before initiating any disputes.
          </p>
        </div>
      </div>
    </div>
  );
}
