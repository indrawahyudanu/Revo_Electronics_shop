export default function Loading() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="h-8 w-40 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse mb-6" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
