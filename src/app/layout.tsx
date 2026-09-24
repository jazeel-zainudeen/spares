import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/public/RegisterServiceWorker";
import { InstallPrompt } from "@/components/public/InstallPrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoParts Pro | Spare Parts Catalog",
  description: "Find automotive spare parts and reference numbers quickly and reliably",
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
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
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
    <html lang="en" className={`${inter.variable} ${inter.className} h-full antialiased`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className={`${inter.className} min-h-full font-sans flex flex-col selection:bg-primary selection:text-primary-foreground`}>
        <RegisterServiceWorker />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <InstallPrompt />
      </body>
    </html>
  );
}
