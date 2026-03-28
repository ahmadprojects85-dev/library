import type { Metadata } from "next";
import { Inter, Pinyon_Script, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LivingBackground from "@/components/LivingBackground";
import ThemeWrapper from "@/components/ThemeWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const uniMahan = localFont({
  src: "./UniMahanNurhan.ttf",
  variable: "--font-unimahan",
});

export const metadata: Metadata = {
  title: "Mountains Ink Library — Curated Literature",
  description:
    "A boutique digital bookstore for refined readers. Discover curated collections across programming, science, and philosophy. Order with cash on delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pinyon.variable} ${outfit.variable} ${uniMahan.variable} antialiased`} suppressHydrationWarning>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <ThemeProvider>
          <ToastProvider>
            <LivingBackground />
            <ThemeWrapper>
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
            </ThemeWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
