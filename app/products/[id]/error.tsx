'use client'; // Wajib menggunakan 'client component' untuk error boundary

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-6 max-w-md mx-auto text-center mt-12">
      <div className="border border-red-200 dark:border-red-900 rounded-lg p-6 bg-red-50 dark:bg-red-950/20 shadow-sm">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
          Something went wrong!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {error.message || "Gagal memuat informasi produk."}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition"
          >
            Try again
          </button>
          <Link
            href="/products"
            className="px-4 py-2 bg-gray-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-sm font-medium hover:bg-gray-300 transition"
          >
            Kembali ke Produk
          </Link>
        </div>
      </div>
    </main>
  );
}