import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { AuthProvider } from "@/context/AuthContext";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateSoftwareApplicationSchema,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CareBridge – AI Healthcare Monitoring Platform",
    template: "%s | CareBridge",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "CareBridge AI",
    "healthcare monitoring platform",
    "medicine reminder app",
    "health reports summary",
    "AI health summary",
    "family health platform",
    "medical report analysis",
  ],
  authors: [{ name: "CareBridge Health Team" }],
  creator: "CareBridge Health",
  publisher: "CareBridge Health",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "CareBridge – AI Healthcare Monitoring Platform",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/logo.png`, alt: "CareBridge AI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareBridge – AI Healthcare Monitoring Platform",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={generateOrganizationSchema()} />
        <JsonLd data={generateWebSiteSchema()} />
        <JsonLd data={generateSoftwareApplicationSchema()} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
