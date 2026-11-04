import { Suspense } from "react";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  return (
    <main className="p-4">
      <Suspense fallback={<p className="text-gray-500 animate-pulse">Memuat kategori...</p>}>
        <CategoryList />
      </Suspense>
    </main>
  );
}
