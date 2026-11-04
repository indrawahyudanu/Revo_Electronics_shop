"use client";

import type { Product } from "../types/product";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/CartContex";
import { isLoggedIn } from "@/lib/auth";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Wajib login dulu sebelum add to cart
  function handleClick() {
    if (!isLoggedIn()) {
      router.push("/login?redirect=" + encodeURIComponent(pathname));
      return;
    }
    addToCart(product);
  }

  return (
    <button
      onClick={handleClick}
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

