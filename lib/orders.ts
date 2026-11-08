"use client";

import { useEffect, useState } from "react";

// Bentuk satu order dari backend Flask (GET /orders).
// Field dibuat opsional/longgar agar tahan terhadap perbedaan penamaan backend.
export interface Order {
  id: number | string;
  userId: number | string;
  itemCount: number;
  total: number;
}

export const rp = (n: number) => "Rp " + (n ?? 0).toLocaleString("id-ID");

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Normalisasi satu record order dari backend ke bentuk Order di atas.
// Backend bisa memakai snake_case (user_id, item_count) atau camelCase.
function normalizeOrder(raw: Record<string, unknown>): Order {
  const num = (v: unknown, fallback = 0) =>
    typeof v === "number" ? v : typeof v === "string" ? Number(v) || fallback : fallback;

  const items = raw.items;
  const itemCount =
    raw.itemCount ??
    raw.item_count ??
    (Array.isArray(items) ? items.length : undefined);

  return {
    id: (raw.id ?? raw.order_id) as number | string,
    userId: (raw.userId ?? raw.user_id ?? raw.customer_id) as number | string,
    itemCount: num(itemCount),
    total: num(raw.total ?? raw.total_price ?? raw.amount),
  };
}

// Ambil daftar order dari backend. Sertakan Bearer token bila ada.
export async function fetchOrders(signal?: AbortSignal): Promise<Order[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}/orders`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Gagal memuat order (${res.status})`);
  }

  const data = await res.json();
  // Backend bisa mengembalikan array langsung atau { orders: [...] }
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as Record<string, unknown>)?.orders)
    ? ((data as Record<string, unknown>).orders as unknown[])
    : [];

  return list.map((o) => normalizeOrder(o as Record<string, unknown>));
}

// Hook pemuat order dengan status loading & error, dipakai bersama oleh
// halaman customer dan admin.
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchOrders(controller.signal)
      .then((data) => setOrders(data))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Gagal memuat order");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { orders, loading, error };
}
