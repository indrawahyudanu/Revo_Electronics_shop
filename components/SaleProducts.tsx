import { getSaleProducts } from "../data/products";
import ProductCard from "./ProductCard";

export default async function SaleProducts() {
  const products = await getSaleProducts();

  return (
    <div className="flex flex-wrap gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
