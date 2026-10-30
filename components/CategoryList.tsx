import Link from "next/link";
import Image from "next/image";
import { getCategories } from "../data/category";

export default async function CategoryList() {
  const category = await getCategories();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <div className="w-full py-8">
      {/* Judul */}
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
        Berbagai kategori produk.
      </h2>

      {/* Grid Kartu Kategori */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">

          {category.map((c) => {
            const imageSrc = c.image?.startsWith("http")
              ? c.image
              : `${base}${c.image}`;

            return (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="group flex flex-col items-center justify-between p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Wadah Gambar Kategori */}
                <div className="relative h-28 w-full flex items-center justify-center mb-3">
                  {c.image ? (
                    <Image
                      src={imageSrc}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 font-bold">
                      {c.name.charAt(0)}
                    </div>
                  )}
            
              </div>

              {/* Nama Kategori */}
              <span className="text-sm font-medium text-center text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}