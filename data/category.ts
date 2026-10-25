import { Category } from "../types/product";

export const categories: Category[] = [
  { id: 1, name: "TV", image: "/category-TV.jpg" },
  { id: 2, name: "Handphone", image: "/category-Handphone.png" },
  { id: 3, name: "Air Conditioner", image: "/category-Ac.jpg" },
  { id: 4, name: "Washing Machine", image: "/category-mesin cuci.jpg" },
];

// Helper: cari satu kategori berdasarkan id (dari URL, selalu string).
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => String(c.id) === id);
}
