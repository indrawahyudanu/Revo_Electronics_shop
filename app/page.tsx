"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "../data/category";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Saat submit search → arahkan ke /products (nanti bisa kirim query juga)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">RevoShop</h1>

      {/* Search produk */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded border border-gray-700 px-3 py-2 text-black"
          placeholder="Cari produk..."
        />
      </form>

      {/* Daftar kategori */}
      <h2 className="mb-3 text-lg font-semibold">Kategori</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            className="rounded border border-gray-700 px-4 py-2 hover:bg-gray-100 hover:text-black"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
