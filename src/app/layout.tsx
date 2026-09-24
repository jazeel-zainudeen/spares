import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spare Parts Catalog",
  description: "Premium spare parts management system",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#64748b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col selection:bg-primary selection:text-primary-foreground">
        <Theme accentColor="blue" grayColor="slate" radius="large" scaling="100%">
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Theme>
      </body>
    </html>
  );
}
