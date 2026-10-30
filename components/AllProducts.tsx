import { getAllProducts } from "../data/products";
import ProductCard from "./ProductCard";

export default async function AllProducts({ query = "" }: { query?: string }) {
  const products = await getAllProducts(query);   // teruskan query ke fetch

  return (
    <div className="flex flex-wrap gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}