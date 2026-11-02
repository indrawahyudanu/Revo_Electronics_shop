import { Product } from "../types/product";


// // Helper untuk mencari satu produk berdasarkan id (dari URL, selalu string).
// export function getProductById(id: string): Product | undefined {
//   return products.find((p) => String(p.id) === id);
// }

// Ambil semua produk yang sedang sale
export async function getAllProducts(query = ""): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const url = query
      ? `${base}/products/?q=${encodeURIComponent(query)}`
      : `${base}/products/`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];     // ← gagal → array kosong (bukan throw)
    return res.json();
  } catch {
    return [];                  // ← error jaringan → array kosong
  }
}


// semua produk
export async function getSaleProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${base}/products/?is_sale=true`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}


