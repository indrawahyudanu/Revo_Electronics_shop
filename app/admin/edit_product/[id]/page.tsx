
import { Suspense } from "react";
import ProductForm from "@/components/ProductForm";

// Membaca params harus di dalam Suspense (karena cacheComponents: true)
async function EditProductContent({ params }: PageProps<"/admin/edit_product/[id]">) {
  const { id } = await params;
  return <ProductForm productId={id} />;
}

export default function EditProductPage(props: PageProps<"/admin/edit_product/[id]">) {
  return (
    <Suspense fallback={<p>Memuat form...</p>}>
      <EditProductContent {...props} />
    </Suspense>
  );
}
