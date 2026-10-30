
import { Suspense } from "react";

import AllProducts from "../components/AllProducts";
import SaleProducts from "../components/SaleProducts";
import CategoryList from "../components/CategoryList";

export default function Home() {
  
  return (
      <div className="p-4">

        <h2 className="mb-3 text-lg font-semibold"></h2>
        <Suspense fallback={<p>Memuat kategori...</p>}>
          <CategoryList />
        </Suspense>
        

        {/* Semua Produk (fetch di server) */}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
          Produk Diskon.
        </h2>
        <Suspense fallback={<p>Memuat produk...</p>}>
          <SaleProducts />
        </Suspense>


        {/* Semua Produk (fetch di server) */}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-8 mb-6">
          Semua Produk.
        </h2>
        <Suspense fallback={<p>Memuat produk...</p>}>
          <AllProducts />
        </Suspense>
    </div>
  );
}