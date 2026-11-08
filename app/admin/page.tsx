import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2">Selamat datang di halaman Admin.</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Kelola Produk
        </Link>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">
          Kelola Pesanan
        </Link>
        <Link href="/admin/users" className="text-blue-600 hover:underline">
          Kelola User
        </Link>
        <Link href="/admin/add_product" className="text-blue-600 hover:underline">
          + Tambah Produk
        </Link>
  </div>

  );
}
