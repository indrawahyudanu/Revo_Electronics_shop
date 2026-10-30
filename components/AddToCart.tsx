"use client";

import type { Product } from "../types/product";
import { useCart } from "@/components/CartContex";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
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
  );
}

