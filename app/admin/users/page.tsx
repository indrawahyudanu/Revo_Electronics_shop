"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import {
  useUsers,
  updateUserRole,
  type ManagedUser,
  type Role,
} from "@/lib/users";

// Panel ADMIN: kelola role user (promote ke admin / demote ke user).
// Dilindungi AdminGuard lewat app/admin/layout.tsx.
export default function AdminUsersPage() {
  const { currentUser } = useAuth();
  const { users, setUsers, loading, error } = useUsers();

  // id user yang sedang diproses (untuk disable tombol & tampilkan status)
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function changeRole(user: ManagedUser, nextRole: Role) {
    setActionError(null);
    setBusyId(String(user.id));
    try {
      const updated = await updateUserRole(user.id, nextRole);
      // Perbarui baris di tabel tanpa perlu reload penuh.
      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === String(user.id)
            ? { ...u, role: updated.role || nextRole }
            : u
        )
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Gagal mengubah role");
    } finally {
      setBusyId(null);
    }
  }

  const head = "p-3 text-left bg-gray-100";
  const cell = "p-3";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kelola User</h2>

      {actionError && (
        <p className="mb-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Memuat user…</p>
      ) : error ? (
        <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada user.</p>
      ) : (
        <table className="w-full text-sm bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className={head}>ID</th>
              <th className={head}>Nama</th>
              <th className={head}>Email</th>
              <th className={head}>Role</th>
              <th className={head}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdmin = String(u.role).toLowerCase() === "admin";
              const isSelf = String(u.id) === String(currentUser?.id);
              const busy = busyId === String(u.id);
              return (
                <tr key={u.id} className="border-t">
                  <td className={cell}>#{u.id}</td>
                  <td className={cell}>{u.name || "-"}</td>
                  <td className={cell}>{u.email || "-"}</td>
                  <td className={cell}>
                    <span
                      className={
                        "px-2 py-0.5 rounded text-xs " +
                        (isAdmin
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700")
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className={cell}>
                    {isSelf ? (
                      <span className="text-xs text-gray-400">
                        (akun Anda)
                      </span>
                    ) : isAdmin ? (
                      <button
                        disabled={busy}
                        onClick={() => changeRole(u, "user")}
                        className="px-3 py-1 rounded border text-xs hover:bg-gray-50 disabled:opacity-50"
                      >
                        {busy ? "Memproses…" : "Jadikan User"}
                      </button>
                    ) : (
                      <button
                        disabled={busy}
                        onClick={() => changeRole(u, "admin")}
                        className="px-3 py-1 rounded bg-gray-900 text-white text-xs hover:bg-gray-800 disabled:opacity-50"
                      >
                        {busy ? "Memproses…" : "Jadikan Admin"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
