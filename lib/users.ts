"use client";

import { useCallback, useEffect, useState } from "react";

// Role yang dikenal backend: lihat VALID_ROLES = {"admin", "user"}.
export type Role = "admin" | "user";

export interface ManagedUser {
  id: number | string;
  name: string; // customer_name / username
  email: string;
  role: Role | string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Normalisasi satu record user dari backend (to_dict bisa pakai nama berbeda).
function normalizeUser(raw: Record<string, unknown>): ManagedUser {
  return {
    id: (raw.id ?? raw.user_id) as number | string,
    name: (raw.customer_name ?? raw.username ?? raw.name ?? "") as string,
    email: (raw.email ?? "") as string,
    role: (raw.role ?? "user") as string,
  };
}

// GET /users/  (admin only) -> daftar semua user
export async function fetchUsers(signal?: AbortSignal): Promise<ManagedUser[]> {
  const res = await fetch(`${API_BASE}/users/`, {
    headers: authHeaders(),
    signal,
  });

  if (res.status === 403) throw new Error("Akses admin diperlukan.");
  if (!res.ok) throw new Error(`Gagal memuat user (${res.status})`);

  const data = await res.json();
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as Record<string, unknown>)?.users)
    ? ((data as Record<string, unknown>).users as unknown[])
    : [];

  return list.map((u) => normalizeUser(u as Record<string, unknown>));
}

// PATCH /users/:id/role  (admin only) -> ubah role satu user
export async function updateUserRole(
  userId: number | string,
  role: Role
): Promise<ManagedUser> {
  const res = await fetch(`${API_BASE}/users/${userId}/role`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (data as Record<string, unknown>)?.error ??
      (data as Record<string, unknown>)?.message;
    throw new Error(
      typeof msg === "string" && msg ? msg : `Gagal mengubah role (${res.status})`
    );
  }

  const userObj = (data as Record<string, unknown>)?.user;
  return normalizeUser(
    (userObj && typeof userObj === "object"
      ? (userObj as Record<string, unknown>)
      : {}) as Record<string, unknown>
  );
}

// Hook pemuat daftar user dengan refetch, untuk halaman kelola user.
export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    return fetchUsers(signal)
      .then((data) => setUsers(data))
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Gagal memuat user");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { users, setUsers, loading, error, reload: () => load() };
}
