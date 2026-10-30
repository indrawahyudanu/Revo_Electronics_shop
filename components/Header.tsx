'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from "@/components/CartContex";


const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/orders',   label: 'Orders' },
  { href: '/add-product', label: 'Add Product' },
  
];




export default function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200/60 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo / Brand Toko */}
        <Link 
          href="/" 
          className="font-semibold text-base sm:text-lg tracking-tight hover:opacity-85 transition-opacity shrink-0"
        >
          Revo Electronic Shop
        </Link>

{/* Search Box */}
        <form onSubmit={handleSearch} className="relative w-44 sm:w-96">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full bg-gray-100 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 rounded-full px-4 py-1.5 pl-9 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all border border-transparent focus:border-blue-500"
          />
          {/* Ikon Kaca Pembesar */}
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? 'font-medium  text-black dark:text-white border-b-2 '
                    : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

                  {/* Cart + Login */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Keranjang"
            className="relative text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 11-4 0m-6 0a2 2 0 11-4 0" />
            </svg>

            {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}

          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>



      </div>
    </header>
  );
}