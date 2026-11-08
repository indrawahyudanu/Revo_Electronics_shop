"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

// Membatasi akses hanya untuk user dengan role "admin".
// Non-admin / belum login akan diarahkan ke halaman login.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  // Hindari flicker: tunggu AuthProvider selesai memulihkan sesi dari localStorage.
  const [checked, setChecked] = useState(false);

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  useEffect(() => {
    // Beri satu tick agar currentUser sempat terisi dari localStorage saat mount.
    setChecked(true);
  }, []);

  useEffect(() => {
    if (checked && !isAdmin) {
      router.replace("/login?redirect=/admin");
    }
  }, [checked, isAdmin, router]);

  if (!checked) {
    return <p className="text-sm text-gray-500">Memeriksa akses…</p>;
  }

  if (!isAdmin) {
    return (
      <p className="text-sm text-red-600">
        Akses ditolak. Halaman ini khusus admin.
      </p>
    );
  }

  return <>{children}</>;
}
