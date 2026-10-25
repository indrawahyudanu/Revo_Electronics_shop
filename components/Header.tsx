'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',           label: 'Home' },
  { href: '/products',   label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/orders',     label: 'Orders' },
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/add-product',  label: 'Add Product' },
];

export default function Header() {
  const pathname = usePathname();

 return (
   <header className="sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3 bg-white">
      <span className="font-bold text-lg">Revo Electronic Shop</span>
      <nav className="flex gap-6 text-sm">
        {NAV_LINKS.map((link) => {
          const isActive = (href:string) => href === pathname;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                isActive(link.href)
                  ? 'font-semibold text-black underline underline-offset-4 cursor-pointer'
                  : 'text-gray-500 hover:text-black cursor-pointer'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}