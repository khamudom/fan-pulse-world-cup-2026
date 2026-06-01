import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminDrawer } from "@/components/AdminDrawer";
import { ApiPreviewBanner } from "@/components/ApiPreviewBanner";
import { Header } from "@/components/Header/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import "@khamudom/lumen-ui-react/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "World Cup FanPulse",
    template: "%s | World Cup FanPulse",
  },
  description:
    "Your companion experience for the FIFA World Cup 2026 — matches, predictions, insights, and fan engagement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <ScrollToTop />
        <ApiPreviewBanner />
        <AdminDrawer />
        <Header />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
