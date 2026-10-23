import { Product } from "../types/product";

// Sumber data produk yang dipakai bersama oleh halaman daftar dan halaman detail.
export const products: Product[] = [
  { id: 1, name: "Laptop Stand", price: 250000, stock: 5, category_id: 3, is_sale: true },
  { id: 2, name: "Keyboard", price: 450000, stock: 0, category_id: 3},
  { id: 3, name: "Mouse", price: 150000, stock: 4, category_id: 3 },
  { id: 4, name: "CPU", price: 160000, stock: 4, category_id: 3 },
];

// Helper untuk mencari satu produk berdasarkan id (dari URL, selalu string).
export function getProductById(id: string): Product | undefined {
  return products.find((p) => String(p.id) === id);
}
