import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "matrainingconsulting",
  description: "MA-TRAINING-CONSULTING provides AI-powered career diagnostic, professional simulations, and strategic talent evaluation for individuals and corporations.",
  keywords: ["MA-TRAINING-CONSULTING", "AI Career Coach", "Talent Intelligence", "Executive Simulation", "HR Strategic Report"],
  icons: {
    icon: "/logo-matc.png",
    apple: "/logo-matc.png",
  },
  openGraph: {
    title: "matrainingconsulting",
    description: "AI-powered career diagnostic and strategic talent evaluation.",
    images: [{ url: "/logo-matc.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "matrainingconsulting",
    description: "AI-powered career diagnostic and strategic talent evaluation.",
    images: ["/logo-matc.png"],
  },
};

import { ToastProvider } from "@/components/providers/ToastProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
