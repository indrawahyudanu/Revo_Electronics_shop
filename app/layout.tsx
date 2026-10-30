import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from "@/components/CartContex";
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
  title: "Electronic Shop",
  description: "Your one-stop Electronic online store.",
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500 selection:text-white">
        <CartProvider>  
          <header className="sticky top-0 z-50 ...">
            <Suspense fallback={null}>
              <Header />
            </Suspense>
          </header>

            {/* Konten Halaman */}
            <main className="flex-1">{children}</main>

            <Footer />
        </CartProvider>
      </body>
    </html>
  );
}