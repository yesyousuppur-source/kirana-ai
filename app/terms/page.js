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
        <div className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-6">
            <strong>Last Updated:</strong> April 25, 2026<br />
            <strong>Effective Date:</strong> April 25, 2026
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            Welcome to <strong>Kirana AI</strong>. These Terms of Service ("Terms")
            govern your access to and use of the Kirana AI application and related
            services (collectively, the "Service") operated by{" "}
            <strong>Jeet Singh</strong>, a sole proprietor based in Gurugram,
            Haryana, India ("we", "us", "our").
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            By accessing or using the Service, you agree to be bound by these Terms.
            If you do not agree to these Terms, please do not use the Service.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">1. Service Description</h2>
          <p className="text-sm mb-3">
            Kirana AI is a digital ledger and customer management application designed
            for kirana (general grocery) shop owners in India. Features include:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Customer database management</li>
            <li>Order tracking and udhaar (credit) management</li>
            <li>Payment status tracking (Cash/UPI)</li>
            <li>WhatsApp-based payment reminders (via wa.me/ links)</li>
            <li>UPI payment request generation (via deep links)</li>
            <li>PDF khata (ledger) export</li>
            <li>Multi-language support (Hindi, English, Bengali, Marathi, Tamil)</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">2. Account Registration</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>You must be at least 18 years old to use Kirana AI</li>
            <li>You must provide a valid Indian mobile number for OTP verification</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You agree to provide accurate, current, and complete information</li>
            <li>One person should not maintain multiple accounts unless authorized</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">3. Acceptable Use</h2>
          <p className="text-sm mb-2">You agree NOT to use the Service to:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Violate any applicable Indian or international law</li>
            <li>Send spam, harassment, or unwanted messages to customers</li>
            <li>Add customer information without their consent</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service for fraudulent, illegal, or harmful activities</li>
            <li>Reverse engineer, decompile, or modify the Service</li>
            <li>Resell or redistribute the Service without permission</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">4. Customer Data and Consent</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
            <p className="text-sm">
              <strong>Important:</strong> By adding customer information (names, phone numbers)
              to Kirana AI, you confirm that you have obtained your customers' consent to
              process their information for the purposes of business management and
              communication. You are solely responsible for compliance with applicable
              data protection laws regarding your customers' data.
            </p>
          </div>

          <h2 className="text-lg font-bold mt-6 mb-2">5. Subscription and Pricing</h2>
          <p className="text-sm mb-3">
            Kirana AI currently offers a 7-day free trial. Paid subscriptions may be
            introduced in the future at the following indicative pricing:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li><strong>Free Trial:</strong> 7 days, full features</li>
            <li><strong>Pro Plan:</strong> ₹99 per month (subject to change with notice)</li>
          </ul>
          <p className="text-sm mb-3">
            Subscription pricing, features, and terms may change with prior notice.
            Existing subscribers will be honored at their current rate for the
            remainder of their billing period.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">6. Payment Processing</h2>
          <p className="text-sm mb-3">
            <strong>Kirana AI is NOT a payment processor.</strong> The "UPI" payment feature
            in our application generates UPI deep links that redirect to your installed
            UPI applications (PhonePe, Google Pay, Paytm, etc.). All payment transactions
            occur directly between the customer and shop owner via NPCI's UPI infrastructure.
            We do not handle, process, or have access to any monetary transactions.
          </p>
          <p className="text-sm mb-3">
            For our paid subscription services (when introduced), we may use third-party
            payment gateways like Razorpay, which will be governed by their respective
            terms and policies.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">7. WhatsApp Integration</h2>
          <p className="text-sm mb-3">
            Kirana AI uses publicly-documented WhatsApp <code className="bg-slate-100 px-1 rounded">wa.me/</code>
            click-to-chat URLs. We do not send messages on your behalf — you (the shop owner)
            must manually click "Send" in WhatsApp. We are not affiliated with, endorsed by,
            or partnered with WhatsApp/Meta. WhatsApp's own Terms of Service apply to your
            use of WhatsApp.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">8. Service Availability</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>We strive for 99% uptime but do not guarantee uninterrupted service</li>
            <li>Scheduled maintenance may temporarily affect availability</li>
            <li>We are not liable for outages caused by third-party services (Firebase, Vercel, etc.)</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">9. Intellectual Property</h2>
          <p className="text-sm mb-3">
            All intellectual property rights in Kirana AI, including the design, code,
            logos, and content, belong to Jeet Singh / Kirana AI. Your data (customers,
            orders) remains your property — we only process it to provide the Service.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">10. Disclaimer of Warranties</h2>
          <p className="text-sm mb-3">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
            KIND, EXPRESS OR IMPLIED. We do not warrant that:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>The Service will be error-free or uninterrupted</li>
            <li>Defects will be corrected immediately</li>
            <li>The Service will meet your specific requirements</li>
            <li>Data backups are infallible (we recommend regular PDF exports)</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">11. Limitation of Liability</h2>
          <p className="text-sm mb-3">
            To the maximum extent permitted by Indian law, Kirana AI and its operator
            (Jeet Singh) shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Loss of profits, revenue, or business opportunities</li>
            <li>Loss of customer data (we recommend regular backups)</li>
            <li>Damages from third-party services (Firebase, WhatsApp, UPI apps)</li>
            <li>Any disputes between you and your customers</li>
          </ul>
          <p className="text-sm mb-3">
            Our total liability for any claim shall not exceed the amount you paid for
            the Service in the 3 months preceding the claim, or ₹1,000, whichever is lower.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">12. Termination</h2>
          <p className="text-sm mb-3">
            You may stop using the Service at any time. We may suspend or terminate your
            account if you violate these Terms, engage in fraudulent activity, or for
            other reasons we deem necessary. Upon termination, your right to use the
            Service ceases immediately.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">13. Refund Policy</h2>
          <p className="text-sm mb-3">
            For paid subscriptions, please refer to our{" "}
            <a href="/refund" className="text-brand underline">Refund Policy</a>.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">14. Governing Law and Jurisdiction</h2>
          <p className="text-sm mb-3">
            These Terms are governed by the laws of India. Any disputes arising from or
            related to these Terms or the Service shall be subject to the exclusive
            jurisdiction of the courts in <strong>Gurugram, Haryana, India</strong>.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">15. Changes to Terms</h2>
          <p className="text-sm mb-3">
            We may update these Terms from time to time. We will notify users of
            significant changes by posting the updated Terms on this page and updating
            the "Last Updated" date. Continued use of the Service after changes
            constitutes acceptance of the new Terms.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">16. Contact Information</h2>
          <div className="bg-slate-50 p-4 rounded-lg text-sm">
            <p><strong>Email:</strong> <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></p>
            <p><strong>Operator:</strong> Jeet Singh (Sole Proprietor)</p>
            <p><strong>Brand:</strong> Kirana AI</p>
            <p><strong>Address:</strong> Gurugram, Haryana, India</p>
            <p><strong>Website:</strong> <a href="https://www.yesyoupro.com" className="text-brand underline">www.yesyoupro.com</a></p>
          </div>

          <p className="text-xs text-slate-500 mt-8 text-center">
            By using Kirana AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
