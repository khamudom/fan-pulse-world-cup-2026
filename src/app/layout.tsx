import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminDrawer } from "@/components/AdminDrawer";
import { ApiPreviewBanner } from "@/components/ApiPreviewBanner";
import { DataSourceLegend } from "@/components/DataSourceLegend";
import { HeaderContainer } from "@/components/Header/HeaderContainer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/Theme";
import { getThemeState } from "@/lib/theme-request";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { preference, resolvedTheme } = await getThemeState();
  const htmlClass = [
    geistSans.variable,
    geistMono.variable,
    resolvedTheme === "dark" ? "lumen-dark" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      className={htmlClass}
      data-lumen-theme={resolvedTheme}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <ThemeProvider preference={preference}>
          <ScrollToTop />
          <ApiPreviewBanner />
          <DataSourceLegend />
          <AdminDrawer />
          <HeaderContainer />
          <main id="main-content">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
