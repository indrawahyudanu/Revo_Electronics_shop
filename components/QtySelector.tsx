"use client"
import { useState } from "react";
import type { Product} from "../types/product";


interface QtySelectorProps {
  product: Product;
}

//fungsi untuk qtyselector event
export default function QtySelector ({ product }: QtySelectorProps) {
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
  );}