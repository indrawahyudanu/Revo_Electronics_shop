// types/product.ts

import React from "react";

export interface CardProps {
  children: React.ReactNode;
}

export interface PageSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface ModalProps {
  header: string;
  children: React.ReactNode;
}

export interface user {
  id: string | number;
  email : string;
  password : string;
}

export interface Product {
  id: string | number;
  name: string;
  sku?: string;
   price: number;
  stock: number;
  category_id?: string;
  is_sale?: boolean;
}

export interface Category {
  id: string | number;
  name: string;
}

export interface Orders {
  id: string | number;
  product_id: number;
  quantity:number;
}

// Interface untuk item di keranjang belanja
export interface CartItem {
  product: Product;
  quantity: number;
}

// Interface untuk Props komponen ProductCard
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  showBadge?: boolean;
}

export type Variant = "in-stock" | "out-of-stock";








