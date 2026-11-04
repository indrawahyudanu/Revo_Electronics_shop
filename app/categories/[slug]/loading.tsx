export default function Loading() {
  return (
    <div className="p-4">
      <p className="mb-6 text-sm text-gray-500 animate-pulse">Memuat kategori...</p>
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-56 h-72 rounded-2xl bg-gray-100 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
