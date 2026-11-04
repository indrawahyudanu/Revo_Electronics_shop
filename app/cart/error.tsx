"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Terjadi kesalahan pada keranjang
      </h2>
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Coba lagi
      </button>
    </div>
  );
}
