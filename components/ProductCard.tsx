"use client"

import type { Product, Variant, } from "../types/product";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  currency?: string;
  onAddToCart?: (product: Product) => void; 
}

interface BadgeProps {
  variant: Variant;
}


interface QtySelectorProps {
  product: Product;
}

// Badge in_stock dan out of stock
function Badge({ variant }: BadgeProps) {
  const isIn = variant === "in-stock";
  const classes = isIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const label = isIn ? "In stock" : "Out of stock";
  return <span className={"text-xs px-2 py-1 rounded-full " + classes}>{label}</span>;
}


//fungsi untuk qtyselector event
function QtySelector ({ product }: QtySelectorProps) {
  const [qty, setQty] = useState(0);
  const increase = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decrease = () => {
    if (qty > 0) {
      setQty(qty - 1);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-3">
      {/* Tombol minus, nilai qty, dan tombol plus dengan atribut disabled */}
      <button
        onClick={decrease}
        disabled={qty === 0}
        className="px-2 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
      >
        -
      </button>

      <span className="font-medium">{qty}</span>

      <button
        onClick={increase}
        disabled={qty >= product.stock}
        className="px-2 py-1 bg-gray-200 text-black rounded disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}


//fungsi product card
export default function ProductCard({
  product,
  currency = "Rp",
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className={ "border border-gray-700 rounded-lg p-4 w-56 "}>
      <div className="bg-gray-800 h-30 flex items-center justify-center rounded mb-3">
        img
      </div> 
      <h3 className="font-bold">
        {/* TODO 3: Menampilkan tag "Sale" hanya jika product.sale bernilai true */}
        {product.is_sale && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-pink-100 text-pink-600 font-normal">Sale</span>}
      </h3>
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="mb-2 text-sm text-gray-300">{currency} {product.price.toLocaleString("id-ID")}</p>
      <Badge variant={product.stock > 0 ? "in-stock" : "out-of-stock"} />
      <QtySelector product={product}/>

      {/* Tombol Add to Cart: disabled + label & warna dinamis */}
      <button
        onClick={() => onAddToCart?.(product)}
        disabled={product.stock === 0}
        className={
        "mt-3 w-full px-4 py-2 rounded text-white text-sm transition " +
        (product.stock > 0
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-gray-400 cursor-not-allowed")
  }
>
  {product.stock > 0 ? "Add to Cart" : "Unavailable"}
</button>
    </div>
  );
}

