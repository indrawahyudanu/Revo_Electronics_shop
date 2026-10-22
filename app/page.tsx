"use client";

import { useState } from "react";


import Header from "../components/Header";
import { Product } from "../types/product";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";



const products: Product[] = [
  { id: 1, name: "Laptop Stand", price: 250000, stock: 5, is_sale:true },
  { id: 2, name: "Keyboard", price: 450000, stock: 0},
  { id: 3, name: "Mouse", price: 150000, stock: 4 },
  { id: 4, name: "CPU", price: 160000, stock: 4 },
];


export default function Page() {
  const [query, setQuery] = useState("");

 const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
);

  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };
  

  return (
    <div>
      <Header />
          <div className="p-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white-500 border border-gray-700 rounded px-3 py-2 text-black"
              placeholder="Search products..."
            />
          </div>

          <div className="p-4 flex gap-4 flex-wrap">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              
            ))}
          </div>

      <Footer />
    </div>
  );
}
