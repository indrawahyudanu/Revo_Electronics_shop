

// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center gap-6 p-4 border border-gray-700 rounded mb-4">
      <span className="font-bold text-lg">Revo Electronic shop</span>
      <nav className="flex gap-4 text-sm text-gray-300">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/add-product">Tambah Product</Link>
      </nav>
    </header>
  );
}
