import { Suspense } from "react";
import AllProducts from "../../components/AllProducts";
import SaleProducts from "../../components/SaleProducts";

// Komponen anak yang membaca searchParams (harus di dalam Suspense)
async function ProductsContent({ searchParams }: PageProps<"/products">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";

  if (query) {
    return (
      <>
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          Hasil pencarian: {query}
        </h2>
        <Suspense key={query} fallback={<p>Memuat produk...</p>}>
          <AllProducts query={query} />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">Produk Diskon.</h2>
      <Suspense fallback={<p>Memuat produk...</p>}>
        <SaleProducts />
      </Suspense>

      <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-6">Semua Produk.</h2>
      <Suspense fallback={<p>Memuat produk...</p>}>
        <AllProducts />
      </Suspense>
    </>
  );
}

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <div className="p-4">
      <Suspense fallback={<p>Memuat...</p>}>
        <ProductsContent {...props} />
      </Suspense>
    </div>
  );
}
