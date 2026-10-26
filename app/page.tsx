
import { Suspense } from "react";

import SearchBox from "../components/searchBox";
import AllProducts from "../components/AllProducts";
import SaleProducts from "../components/SaleProducts";
import CategoryList from "../components/CategoryList";

export default function Home() {
  return (
      <div className="p-4">
        <SearchBox />

      <h2 className="mb-3 text-lg font-semibold">Kategori</h2>
      <Suspense fallback={<p>Memuat kategori...</p>}>
        <CategoryList />
      </Suspense>
      

      {/* Semua Produk (fetch di server) */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Sale Product</h2>
      <Suspense fallback={<p>Memuat produk...</p>}>
         <SaleProducts />
      </Suspense>


      {/* Semua Produk (fetch di server) */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">Semua Produk</h2>
      <Suspense fallback={<p>Memuat produk...</p>}>
        <AllProducts />
      </Suspense>
    </div>
  );
}