import { getAllProducts } from "../data/products";
import ProductCard from "./ProductCard";

export default async function AllProducts() {
  const products = await getAllProducts();

  return (
    <div className="flex flex-wrap gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
