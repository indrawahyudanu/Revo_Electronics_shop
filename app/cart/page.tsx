"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContex";
import { useAuth } from "@/components/AuthContext";
import { createOrder } from "@/lib/orders";
import CartSummary from "@/components/CartSummary";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { isLoggedIn, ready } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleCheckout() {
    setError(null);

    // Buat order butuh login (backend ambil user dari token).
    if (!isLoggedIn) {
      router.push("/login?redirect=/cart");
      return;
    }

    setSubmitting(true);
    try {
      const items = cart.map((it) => ({
        productId: it.product.id,
        quantity: it.quantity,
      }));
      await createOrder(items, total);
      clearCart();
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  }

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

      {error && (
        <p className="mt-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Checkout / Buat Pesanan */}
      <button
        onClick={handleCheckout}
        disabled={submitting || !ready}
        className="w-full mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting
          ? "Memproses…"
          : isLoggedIn
          ? "Buat Pesanan"
          : "Login untuk Memesan"}
      </button>
    </div>
  );
}
