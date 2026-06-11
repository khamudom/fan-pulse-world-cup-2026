import type { Metadata } from "next";
import { Archivo, Barlow_Condensed, Fraunces, Geist_Mono } from "next/font/google";
import { AdminDrawer } from "@/components/AdminDrawer";
import { ApiPreviewBanner } from "@/components/ApiPreviewBanner";
import { AuthModalProvider } from "@/components/AuthModal";
import { DataSourceLegend } from "@/components/DataSourceLegend";
import { CheckInCelebrationContainer } from "@/components/CheckInCelebration";
import { HeaderContainer } from "@/components/Header/HeaderContainer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/Theme";
import { getThemeState } from "@/lib/theme-request";
import "@khamudom/lumen-ui-react/styles.css";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    fraunces.variable,
    archivo.variable,
    barlowCondensed.variable,
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
          <AuthModalProvider>
            <ScrollToTop />
            <ApiPreviewBanner />
            <DataSourceLegend />
            <AdminDrawer />
            <HeaderContainer />
            <CheckInCelebrationContainer />
            <main id="main-content">{children}</main>
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
