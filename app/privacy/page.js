"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand text-white px-4 h-[60px] flex items-center gap-3 sticky top-0 z-20 shadow-md">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Privacy Policy</h1>
      </header>

      <div className="max-w-3xl mx-auto p-5 bg-white">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-6">
            <strong>Last Updated:</strong> April 25, 2026<br />
            <strong>Effective Date:</strong> April 25, 2026
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            Welcome to <strong>Kirana AI</strong> ("we", "our", "us"), operated by{" "}
            <strong>Jeet Singh</strong>, a sole proprietor based in Gurugram, Haryana, India.
            This Privacy Policy explains how we collect, use, and protect your personal
            information when you use our application available at{" "}
            <a href="https://www.kiranaai.shop.com" className="text-brand underline">www.kiranaai.shop.com</a>{" "}
            and related services (collectively, the "Service").
          </p>

          <p className="mb-4 text-sm leading-relaxed">
            By using Kirana AI, you agree to the collection and use of information in
            accordance with this policy. We are committed to protecting your privacy in
            compliance with applicable Indian laws including the Digital Personal Data
            Protection Act, 2023 (DPDPA) and Information Technology Act, 2000.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">1. Information We Collect</h2>

          <h3 className="text-base font-bold mt-4 mb-1">1.1 Information You Provide</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li><strong>Phone Number:</strong> Used for account creation via OTP-based login (Firebase Authentication)</li>
            <li><strong>Shop Details:</strong> Shop name, owner name, city, optional UPI ID</li>
            <li><strong>Customer Information:</strong> Names and phone numbers of your customers (which you add manually)</li>
            <li><strong>Order Data:</strong> Item descriptions, amounts, payment status</li>
            <li><strong>Payment Methods:</strong> Cash or UPI selection (we do not store actual UPI transaction data)</li>
          </ul>

          <h3 className="text-base font-bold mt-4 mb-1">1.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li><strong>Language Preference:</strong> Stored in your browser's local storage</li>
            <li><strong>WhatsApp App Choice:</strong> Personal vs Business preference, stored locally</li>
            <li><strong>Usage Data:</strong> Order timestamps, payment records, app interaction patterns</li>
          </ul>

          <h3 className="text-base font-bold mt-4 mb-1">1.3 Information We Do NOT Collect</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>We do not collect or store passwords (login is OTP-based)</li>
            <li>We do not access your phone contacts</li>
            <li>We do not track your location</li>
            <li>We do not process or store payment card details</li>
            <li>We do not have access to your bank account information</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>To provide and maintain the Service</li>
            <li>To authenticate your account via OTP</li>
            <li>To enable WhatsApp message generation (via wa.me/ links)</li>
            <li>To enable UPI payment redirection (via deep links)</li>
            <li>To save your shop's customer ledger and order history</li>
            <li>To improve user experience and language localization</li>
            <li>To send service-related notifications (when applicable)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">3. Third-Party Services</h2>
          <p className="text-sm mb-3">We use the following trusted third-party services:</p>

          <h3 className="text-base font-bold mt-4 mb-1">3.1 Firebase (Google LLC)</h3>
          <p className="text-sm mb-2">
            We use Firebase Authentication for OTP-based login and Firestore for secure
            database storage. Firebase processes data in compliance with its{" "}
            <a href="https://firebase.google.com/support/privacy" className="text-brand underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>.
          </p>

          <h3 className="text-base font-bold mt-4 mb-1">3.2 WhatsApp (Meta Platforms)</h3>
          <p className="text-sm mb-2">
            We use <code className="bg-slate-100 px-1 rounded">wa.me/</code> click-to-chat
            links to redirect you to WhatsApp. We do not have access to WhatsApp message
            content. WhatsApp's own{" "}
            <a href="https://www.whatsapp.com/legal/privacy-policy" className="text-brand underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            applies to all messages sent via WhatsApp.
          </p>

          <h3 className="text-base font-bold mt-4 mb-1">3.3 UPI Payment Apps</h3>
          <p className="text-sm mb-2">
            <strong>Important:</strong> Kirana AI is NOT a payment processor or financial
            services provider. We only generate UPI deep links{" "}
            <code className="bg-slate-100 px-1 rounded">upi://pay?...</code> that open
            your installed UPI applications (PhonePe, Google Pay, Paytm, BHIM, etc.).
            All actual payment transactions occur within these UPI apps and are governed
            by their respective privacy policies and the National Payments Corporation of
            India (NPCI) regulations.
          </p>

          <h3 className="text-base font-bold mt-4 mb-1">3.4 Vercel (Hosting)</h3>
          <p className="text-sm mb-2">
            Our application is hosted on Vercel Inc., which provides infrastructure and
            content delivery services.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">4. Data Storage and Security</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>All data is stored in Google Firebase servers located in Mumbai (asia-south1) region</li>
            <li>Data is encrypted in transit using HTTPS/TLS</li>
            <li>Firebase security rules ensure your data is only accessible by you</li>
            <li>We implement industry-standard security practices</li>
            <li>Despite our efforts, no method of electronic transmission is 100% secure</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">5. Data Retention</h2>
          <p className="text-sm mb-3">
            We retain your data as long as your account is active. If you wish to delete
            your account and associated data, contact us at{" "}
            <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">
              yesyousuppur@gmail.com
            </a>{" "}
            and we will process the deletion within 30 days.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">6. Your Rights (DPDPA Compliance)</h2>
          <p className="text-sm mb-2">Under Indian data protection laws, you have the right to:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li><strong>Access</strong> your personal data we hold</li>
            <li><strong>Correct</strong> inaccurate or incomplete data</li>
            <li><strong>Delete</strong> your account and associated data</li>
            <li><strong>Withdraw consent</strong> at any time</li>
            <li><strong>Lodge a complaint</strong> with the Data Protection Board of India</li>
          </ul>

          <h2 className="text-lg font-bold mt-6 mb-2">7. Children's Privacy</h2>
          <p className="text-sm mb-3">
            Kirana AI is intended for users aged 18 and above. We do not knowingly collect
            information from children under 18. If we discover that we have collected such
            information, we will delete it promptly.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">8. Cookies and Local Storage</h2>
          <p className="text-sm mb-3">
            We use browser localStorage to remember your language preference and
            WhatsApp app choice. These do not contain personal data and are stored on
            your device only. We do not use third-party tracking cookies.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">9. Customer Data Responsibility</h2>
          <p className="text-sm mb-3">
            <strong>Important:</strong> When you (the shop owner) add customer information
            (such as customer phone numbers) to Kirana AI, you confirm that you have the
            customer's consent to process their information. You are responsible for
            complying with applicable laws regarding your customers' data and obtaining
            necessary consents.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">10. Changes to This Policy</h2>
          <p className="text-sm mb-3">
            We may update this Privacy Policy from time to time. We will notify you of
            significant changes by posting the new policy on this page and updating the
            "Last Updated" date.
          </p>

          <h2 className="text-lg font-bold mt-6 mb-2">11. Contact Us</h2>
          <div className="bg-slate-50 p-4 rounded-lg text-sm">
            <p className="mb-2">For privacy-related questions or requests:</p>
            <p><strong>Email:</strong> <a href="mailto:yesyousuppur@gmail.com" className="text-brand underline">yesyousuppur@gmail.com</a></p>
            <p><strong>Operator:</strong> Jeet Singh (Sole Proprietor, operating "Kirana AI")</p>
            <p><strong>Address:</strong> Gurugram, Haryana, India</p>
            <p><strong>Website:</strong> <a href="https://www.yesyoupro.com" className="text-brand underline">www.yesyoupro.com</a></p>
          </div>

          <p className="text-xs text-slate-500 mt-8 text-center">
            By using Kirana AI, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
