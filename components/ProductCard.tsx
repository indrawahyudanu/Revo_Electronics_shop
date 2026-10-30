"use client"

import type { Product, Variant } from "../types/product";
import Link from 'next/link';
import Image from "next/image";
import QtySelector from "@/components/QtySelector";
import AddToCart from "@/components/AddToCart";

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
  
    <div className={ "border border-gray-700 rounded-lg p-4 w-56 "}>
        <Link href={`/products/${product.id}`} className="block group">
          <div className="relative bg-white-800 h-32 flex items-center justify-center rounded mb-3 overflow-hidden">
            {product.image ? (
              <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="224px"
              className="w-full h-full object-contain"
              />
              ) : (
              <span className="text-gray-400 text-sm">No image</span>
                )}
          </div>

          <div className="flex items-center gap-2 mb-1">
          {product.is_sale && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-pink-100 text-pink-600 font-normal">
              Sale
            </span>
          )}
          </div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="mb-2 text-sm text-black-300">{currency} {product.price.toLocaleString("id-ID")}</p>

          <div className="mb-2">
            <Badge variant={product.stock > 0 ? "in-stock" : "out-of-stock"} />
          </div>
        </Link>


      <QtySelector product={product}/>

      <AddToCart product={product} />

     
    </div>
  );
}

