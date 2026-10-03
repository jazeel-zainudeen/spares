import type { Metadata, Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/public/RegisterServiceWorker";

import { NotFoundProvider } from "@/components/public/NotFoundContext";
import { UserCollectionProvider } from "@/contexts/UserCollectionContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionEndTracker } from "@/components/public/SessionEndTracker";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: {
    default: "AutoParts Pro | Spare Parts Catalog",
    template: "%s | AutoParts Pro",
  },
  description:
    "Find automotive spare parts and reference numbers quickly and reliably. Browse by brand, model, and category.",
  manifest: "/manifest.json",
  applicationName: "AutoParts Pro",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AutoParts Pro",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/logo-mark.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "AutoParts Pro",
    title: "AutoParts Pro | Spare Parts Catalog",
    description:
      "Find automotive spare parts and reference numbers quickly and reliably. Browse by brand, model, and category.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoParts Pro - Spare Parts Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoParts Pro | Spare Parts Catalog",
    description:
      "Find automotive spare parts and reference numbers quickly and reliably.",
    images: ["/og-image.png"],
  },
};


export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `:root { --font-inter: 'Inter', sans-serif; }`}} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className="min-h-full font-sans flex flex-col selection:bg-primary selection:text-primary-foreground">
        <NotFoundProvider>
          <UserCollectionProvider>
            <NextTopLoader
              color="#2563eb"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2563eb,0 0 5px #2563eb"
            />
            <RegisterServiceWorker />
            <SessionEndTracker />
            <main className="flex-1 flex flex-col">
              {children}
            </main>

            <Analytics />
            <SpeedInsights />
          </UserCollectionProvider>
        </NotFoundProvider>
      </body>
    </html>
  );
}
