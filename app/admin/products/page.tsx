import { Suspense } from "react";
import Link from "next/link";
import { getAllProducts } from "@/data/products";

async function ProductTable() {
  const products = await getAllProducts();

  if (products.length === 0) {
    return <p className="text-gray-500">Belum ada produk.</p>;
  }

  return (
    <table className="w-full text-sm border border-slate-200">
      <thead className="bg-slate-100 text-left">
        <tr>
          <th className="p-2">Nama</th>
          <th className="p-2">SKU</th>
          <th className="p-2">Harga</th>
          <th className="p-2">Stok</th>
          <th className="p-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-t border-slate-200">
            <td className="p-2">{p.name}</td>
            <td className="p-2">{p.sku}</td>
            <td className="p-2">Rp {p.price.toLocaleString("id-ID")}</td>
            <td className="p-2">{p.stock}</td>
            <td className="p-2">
              <Link
                href={`/admin/edit_product/${p.id}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <Link href="/admin/add_product" className="text-blue-600 hover:underline">
          + Tambah Produk
        </Link>
      </div>
      <Suspense fallback={<p>Memuat produk...</p>}>
        <ProductTable />
      </Suspense>
    </div>
  );
}
