import { Category } from "../types/product";


export async function getCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${base}/categories/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal mengambil kategori");
  return res.json();
}