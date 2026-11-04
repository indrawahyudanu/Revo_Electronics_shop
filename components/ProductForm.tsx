"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


type Category = {
  id: number;
  name: string;
};
export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${base}/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
    is_sale: false,
    image: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: "",
  });

   useEffect(() => {
    if (!productId) return;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${base}/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Produk tidak ditemukan");
        return res.json();
      })
      .then((p) =>
        setForm({
          name: p.name ?? "",
          sku: p.sku ?? "",
          description: p.description ?? "",
          price: p.price ?? 0,
          stock: p.stock ?? 0,
          category_id: p.category_id != null ? String(p.category_id) : "",
          is_sale: Boolean(p.is_sale),
          image: p.image ?? "",
        })
      )
      .catch(() => alert("Gagal memuat data produk."));
  }, [productId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      sku: "",
      description: "",
      price: "",
      stock: "",
      category_id: "",
      image: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Nama produk wajib diisi!";
      isValid = false;
    }

    if (!form.sku.trim()) {
      newErrors.sku = "SKU wajib diisi!";
      isValid = false;
    }

    if (!form.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi!";
      isValid = false;
    }

    if (form.price <= 0) {
      newErrors.price = "Harga harus lebih besar dari 0!";
      isValid = false;
    }

    if (form.stock <= 0) {
      newErrors.stock = "Stock harus lebih besar dari 0!";
      isValid = false;
    }

    if (form.category_id === "") {
      newErrors.category_id = "Kategori wajib dipilih!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = isEdit ? `${base}/products/${productId}` : `${base}/products/`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`Gagal menyimpan produk (${res.status}): ${detail}`);
      }

      if (isEdit) {
        alert(`Produk ${form.name} berhasil diperbarui!`);
        router.push("/admin/products");
        return;
      }

      alert(`Produk ${form.name} berhasil disimpan!`);
      setForm({
        name: "",
        sku: "",
        description: "",
        price: 0,
        stock: 0,
        category_id: "",
        is_sale: false,
        image: "",
      });
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk. Coba lagi.");
    } finally {
      setLoading(false);
      }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lengkapi detail informasi produk untuk ditambahkan ke database e-commerce.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Informasi Dasar Produk */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Product Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama produk"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="Contoh: PRD-001"
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">-- Pilih kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Masukkan deskripsi produk"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Card 2: Harga, Stok, Media & Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
            Pricing, Inventory & Media
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Harga */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Stok */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Image URL <span className="text-slate-400 text-xs">(Opsional)</span>
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Sale Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_sale}
                onChange={(e) => setForm({ ...form, is_sale: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Sedang diskon (Sale)
              </span>
            </label>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            {loading ? "Menyimpan..." : isEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}