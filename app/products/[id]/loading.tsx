export default function Loading() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="animate-pulse">
        <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded mb-6"></div>
        <div className="border border-gray-700 rounded-lg p-6 bg-white dark:bg-neutral-900 shadow-sm">
          <div className="bg-gray-200 dark:bg-neutral-800 h-72 rounded mb-4"></div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded mb-3"></div>
          <div className="h-5 w-1/4 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded"></div>
        </div>
      </div>
    </main>
  );
}