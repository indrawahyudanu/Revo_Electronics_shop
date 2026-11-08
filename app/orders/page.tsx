"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useOrders, rp } from "@/lib/orders";

// Panel CUSTOMER: hanya menampilkan order milik user yang sedang login.
// Admin punya halaman terpisah di /admin/orders.
export default function OrdersPage() {
  const { currentUser, ready, isLoggedIn } = useAuth();
  const router = useRouter();
  const { orders, loading, error } = useOrders();

  // Belum login -> arahkan ke halaman login (setelah sesi dipulihkan).
  useEffect(() => {
    if (ready && !isLoggedIn) {
      router.replace("/login?redirect=/orders");
    }
  }, [ready, isLoggedIn, router]);

  if (!ready) {
    return <p className="p-4 text-sm text-gray-500">Memeriksa sesi…</p>;
  }

  if (!isLoggedIn) {
    return <p className="p-4 text-sm text-gray-500">Mengarahkan ke login…</p>;
  }

  // Hanya order milik user ini.
  const rows = orders.filter((o) => String(o.userId) === String(currentUser?.id));

  const head = "p-3 text-left bg-gray-100";
  const cell = "p-3";

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Pesanan Saya</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat order…</p>
      ) : error ? (
        <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada pesanan.</p>
      ) : (
        <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className={head}>Order ID</th>
              <th className={head}>Items</th>
              <th className={head}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="border-t cursor-pointer hover:bg-gray-50"
              >
                <td className={cell}>
                  <Link
                    href={`/orders/${o.id}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    #{o.id}
                  </Link>
                </td>
                <td className={cell}>{o.itemCount}</td>
                <td className={cell}>{rp(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
