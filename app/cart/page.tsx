"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContex";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  // Kalau keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        <p className="text-gray-500 mb-4">Keranjangmu masih kosong.</p>
        <Link
          href="/products"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Keranjang</h1>

      {/* Daftar item */}
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between border border-gray-300 rounded-lg p-4"
          >
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-500">
                Rp {item.product.price.toLocaleString("id-ID")} x {item.quantity}
              </p>
              <p className="text-sm font-medium">
                Subtotal: Rp{" "}
                {(item.product.price * item.quantity).toLocaleString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      {/* Ringkasan total */}
      <CartSummary cart={cart} />
    </div>
  );
}
