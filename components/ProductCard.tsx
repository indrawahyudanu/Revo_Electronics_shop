"use client"

import type { Product, Variant } from "../types/product";
import Link from 'next/link';
import Image from "next/image";


interface ProductCardProps {
  product: Product;
  currency?: string;
  onAddToCart?: (product: Product) => void;
}


interface BadgeProps {
  variant: Variant;
}


// Badge in_stock dan out of stock
function Badge({ variant }: BadgeProps) {
  const isIn = variant === "in-stock";
  const classes = isIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const label = isIn ? "In stock" : "Out of stock";
  return <span className={"text-xs px-2 py-1 rounded-full " + classes}>{label}</span>;
}


//fungsi product card
export default function ProductCard({
  product,
  currency = "Rp",
  onAddToCart,
}: ProductCardProps) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : `${base}${product.image}`;
  
  
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-4 w-56 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <Link href={`/products/${product.id}`} className="block">

      
        {/* Badge Sale */}
        <div className="flex items-center gap-2 mb-1.5">
          {product.is_sale && (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-600 font-semibold border border-pink-100/60">
              Sale
            </span>
          )}
        </div>
        
        {/* Area Gambar */}
        <div className="relative bg-gray-50 h-32 flex items-center justify-center rounded-xl mb-3 overflow-hidden">
          {product.image ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="224px"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-400 text-xs">No image</span>
          )}
        </div>


        {/* Nama Produk */}
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Harga */}
        <p className="mb-2 text-sm font-bold text-gray-900">
          {currency} {product.price.toLocaleString("id-ID")}
        </p>

        {/* Status Stok */}
        <div className="mb-3">
          <Badge variant={product.stock > 0 ? "in-stock" : "out-of-stock"} />
        </div>
      </Link>

      {/* Tombol Aksi di luar Link */}
      <div className="space-y-2 mt-auto pt-2 border-t border-gray-100"> </div>
    </div>
      );
    }

