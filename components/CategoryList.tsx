import Link from "next/link";
import Image from "next/image";
import { getCategories } from "../data/category";


export default async function CategoryList() {
  const category = await getCategories();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
      {category.map((c) => {
  const imageSrc = c.image?.startsWith("http")
    ? c.image
    : `${base}${c.image}`;

  return (
    <Link
      key={c.id}
      href={`/categories/${c.id}`}
      className="group overflow-hidden rounded-lg border border-gray-700 transition hover:shadow-lg"
    >
      <div className="relative h-44 w-full bg-white p-4 flex items-center justify-center overflow-hidden rounded-t-xl">
        {c.image && (
          <Image
            src={imageSrc}
            alt={c.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-contain p-2 transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <p className="py-2 text-center font-medium">{c.name}</p>
    </Link>
   );
      })}
    </div>
  );
}

