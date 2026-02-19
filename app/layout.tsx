import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SaleBanner } from "@/components/ui/sale-banner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerUpgrade.AI | Strategic Talent Intelligence",
  description: "Advanced AI-powered career diagnostic, professional simulations, and strategic talent evaluation for individuals and corporations.",
  keywords: ["AI Career Coach", "Talent Intelligence", "Executive Simulation", "HR Strategic Report"],
};

import { ToastProvider } from "@/components/providers/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <LanguageProvider>
            {children}
            <SaleBanner />

          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
