"use client";

import { useOrders, rp } from "@/lib/orders";

// Panel ADMIN: menampilkan SEMUA order dari semua user.
// Halaman ini otomatis dilindungi AdminGuard lewat app/admin/layout.tsx.
export default function AdminOrdersPage() {
  const { orders, loading, error } = useOrders();

  const head = "p-3 text-left bg-gray-100";
  const cell = "p-3";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Semua Pesanan</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat order…</p>
      ) : error ? (
        <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada pesanan.</p>
      ) : (
        <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className={head}>Order</th>
              <th className={head}>User</th>
              <th className={head}>Items</th>
              <th className={head}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className={cell}>#{o.id}</td>
                <td className={cell}>User #{o.userId}</td>
                <td className={cell}>{o.itemCount}</td>
                <td className={cell}>{rp(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
