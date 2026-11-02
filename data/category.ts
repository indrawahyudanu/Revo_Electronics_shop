import { Category } from "../types/product";


export async function getCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${base}/categories/`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
