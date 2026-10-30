

import { Suspense } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import QtySelector from "@/components/QtySelector";
import AddToCart from "@/components/AddToCart";




async function fetchProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${base}/products/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Gagal mengambil detail produk");
  }
  return res.json();
}

async function ProductDetail({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await fetchProduct(id);

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : `${base}${product.image}`;
  return (
    <div className="mt-4 border border-gray-700 rounded-lg p-6 bg-white dark:bg-neutral-900 shadow-sm max-w-xl">
      {/* Gambar Produk */}
      <div className="relative bg-gray-100 dark:bg-neutral-800 h-64 flex items-center justify-center rounded mb-4 overflow-hidden">
        {product.image ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      {/* Badge Sale (Jika ada) */}
      {product.is_sale && (
        <span className="inline-block text-xs px-2 py-0.5 rounded bg-pink-100 text-pink-600 font-normal mb-2">
          Sale
        </span>
      )}

      {/* Nama Produk */}
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {product.name}
      </h2>

      {/* Harga */}
      <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 my-2">
        Rp {product.price?.toLocaleString("id-ID")}
      </p>

      {/* Status Stok */}
      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium my-2 ${
        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {product.stock > 0 ? 'In stock' : 'Out of stock'}
      </span>

      {/* Kategori */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
        Category: <span className="font-medium text-neutral-800 dark:text-neutral-200">{product.category_name}</span>
      </p>

       <QtySelector product={product} />

      <AddToCart product={product} />

    </div>
  );
}

// Komponen Utama Halaman
export default function ProductDetailPage(props: PageProps<"/products/[id]">) {
  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Product Detail</h1>
      
      {/* Suspense akan menampilkan fallback saat data backend sedang ditarik */}
      <Suspense fallback={<p className="text-gray-500 mt-4 animate-pulse">Memuat detail produk...</p>}>
        <ProductDetail {...props} />
      </Suspense>
       
    </main>
  );
}