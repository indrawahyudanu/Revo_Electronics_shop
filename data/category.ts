import { Category } from "../types/product";

// Daftar kategori. id dipakai untuk relasi ke produk (category_id) & untuk URL.
export const categories: Category[] = [
  { id: 1, name: "TV" },
  { id: 2, name: "Handphone" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "Mesin Cuci" },
];

// Helper: cari satu kategori berdasarkan id (dari URL, selalu string).
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => String(c.id) === id);
}
