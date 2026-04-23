import "./globals.css";

export const metadata = {
  title: "किराना AI — WhatsApp CRM",
  description: "किराना दुकानदारों के लिए WhatsApp CRM",
  manifest: "/manifest.json",
  themeColor: "#10B981",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#10B981" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" />
      </head>
      <body>{children}</body>
    </html>
  );
}
