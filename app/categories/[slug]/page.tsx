import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory } from "@/data/products";

async function CategoryProducts({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 capitalize">Kategori: {slug}</h1>
      {products.length === 0 ? (
        <p className="text-gray-500">Belum ada produk di kategori ini.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default function CategoryPage(props: PageProps<"/categories/[slug]">) {
  return (
    <main className="p-4">
      <Suspense fallback={<p>Memuat produk...</p>}>
        <CategoryProducts {...props} />
      </Suspense>
    </main>
  );
}
