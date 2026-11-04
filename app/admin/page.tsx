import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <p className="mb-4">Selamat datang di halaman Admin.</p>
      <Link
        href="/Admin/add-product"
        className="text-blue-600 hover:underline"
      >
        + Tambah Produk
      </Link>
    </div>
  );
}
