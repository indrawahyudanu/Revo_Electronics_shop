"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


type Category = {
  id: number;
  name: string;
};

// Sama dengan aturan backend (config.py): png/jpg/jpeg/webp/gif, maks 3 MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Hapus URL preview lama dari memori setiap kali diganti / komponen ditutup
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Format harus PNG, JPG, WEBP, atau GIF." }));
      setFileInputKey((k) => k + 1); // kosongkan input
      return;
    }
    if (file && file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Ukuran foto maksimal 3 MB." }));
      setFileInputKey((k) => k + 1);
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

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

    // Semua field dikirim sebagai form-data (bukan JSON) supaya foto bisa ikut
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("sku", form.sku);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("stock", String(form.stock));
    formData.append("category_id", form.category_id);
    formData.append("is_sale", String(form.is_sale));
    if (imageFile) formData.append("image", imageFile); // hanya jika pilih foto baru

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = isEdit ? `${base}/products/${productId}` : `${base}/products/`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData, // JANGAN set Content-Type, browser yang mengisi + boundary
      });

      if (!res.ok) {
        // Backend mengirim { error: "..." }; kalau bukan JSON (mis. 413), pakai status
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Gagal menyimpan produk (status ${res.status})`);
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
      setImageFile(null);
      setPreviewUrl(null);
      setFileInputKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Gagal menyimpan produk. Coba lagi.");
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

          {/* Foto Produk */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Product Image <span className="text-slate-400 text-xs">(Opsional, maks 3 MB)</span>
            </label>

            {/* Preview: foto baru yang dipilih, atau foto lama saat edit */}
            {(previewUrl || form.image) && (
              <div className="relative w-40 h-40 mb-3 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <Image
                  src={
                    previewUrl ??
                    (form.image.startsWith("http")
                      ? form.image
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${form.image}`)
                  }
                  alt={previewUrl ? "Preview foto baru" : "Foto produk saat ini"}
                  fill
                  sizes="160px"
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}

            <input
              key={fileInputKey}
              id="image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageChange}
              aria-describedby={errors.image ? "image-error" : undefined}
              className="block w-full text-sm text-slate-700 dark:text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {isEdit && !previewUrl && form.image && (
              <p className="text-xs text-slate-500 mt-1">
                Kosongkan jika tidak ingin mengganti foto.
              </p>
            )}
            {errors.image && (
              <p id="image-error" className="text-red-500 text-xs mt-1">
                {errors.image}
              </p>
            )}
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