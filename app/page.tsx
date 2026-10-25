"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { categories } from "../data/category";
import { getSaleProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import AllProducts from "../components/AllProducts";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const saleProducts = getSaleProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-4">

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

      {/* Daftar kategori: tiap kotak berisi gambar + nama */}
      <h2 className="mb-3 text-lg font-semibold">Kategori</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
            className="group overflow-hidden rounded-lg border border-gray-700 transition hover:shadow-lg">


      {/* Kotak gambar kategori */}
          <div className="relative h-44 w-full bg-white p-4 flex items-center justify-center overflow-hidden rounded-t-xl group">
            {c.image && (
            <Image
              src={c.image}
              alt={c.name}
              fill
              className="object-contain p-2 transition duration-300 group-hover:scale-105"/>
              )}
            </div>


      {/* Nama kategori */}
            <p className="py-2 text-center font-medium">{c.name}</p>
          </Link>
        ))}
      </div>
      
      {/* berisi Produk Sale */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Produk Sale</h2>
      <div className="flex flex-wrap gap-4">
        {saleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Semua Produk */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Semua Produk</h2>
      <Suspense fallback={<p>Memuat produk...</p>}>
      <AllProducts />
      </Suspense>

      


    </div>

    
  );
}
