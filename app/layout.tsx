import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export default function RootLayout({ children }: LayoutProps<"/products">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />

        {/* Konten halaman (page.tsx) akan berganti-ganti di bawah sini */}
        <section>{children}</section>


        <Footer />
      </body>
    </html>
  );
}