"use client";

import { useState } from "react";
import type { Category } from "../types/product";

const categories: Category[] = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Aksesoris" },
  { id: 3, name: "Komputer" },
];

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category_id: "",
    is_sale: false,
  });

  // error pesan = semua string (isinya teks pesan error)
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", price: "" , stock:"", category_id:""};

    if (!form.name.trim()) {
      newErrors.name = "Nama produk wajib diisi!";
      isValid = false;
    }

    if (form.price <= 0) {
      newErrors.price = "Harga harus lebih besar dari 0!";
      isValid = false;
    }

    if (form.stock <= 0) {
      newErrors.stock = "stock harus lebih besar dari 0!";
      isValid = false;
    }

    if (form.category_id === "") {
        newErrors.category_id = "Kategori wajib dipilih!";
        isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form masih memiliki error.");
      return;
    }

    const payload = {
      ...form,
      category_id: Number(form.category_id),
    };

    console.log("Form submit:", payload);
    alert(`Produk ${form.name} berhasil disimpan!`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      {/* Nama Produk */}
      <div>
        <label className="block mb-1">Product Name:</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Masukkan nama produk"
          className="border border-gray-400 rounded px-2 py-1 w-full text-black"
        />
        {errors.name && (
          <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
        )}
      </div>

      {/* Harga */}
      <div>
        <label className="block mb-1">Price:</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black"
        />
        {errors.price && (
          <p style={{ color: "red", fontSize: "12px" }}>{errors.price}</p>
        )}
      </div>

      {/* Stok */}
      <div>
        <label className="block mb-1">Stock:</label>
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black"
        />
        {errors.stock && (
          <p style={{ color: "red", fontSize: "12px" }}>{errors.stock}</p>
        )}
      </div>

      {/* Kategori */}
      <div>
        <label className="block mb-1">Category:</label>
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="border border-gray-400 rounded px-2 py-1 w-full text-black"
        >
          <option value="">-- Pilih kategori --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
  <p style={{ color: "red", fontSize: "12px" }}>{errors.category_id}</p>
            )}
  </div>

      {/* Sale */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_sale}
            onChange={(e) => setForm({ ...form, is_sale: e.target.checked })}
          />
          Sedang diskon (Sale)
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Product
      </button>
    </form>
  );
}
