import { Suspense } from "react";

async function ProductDetail({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <p>Showing product #{id}</p>;
}

export default function ProductDetailPage(props: PageProps<"/products/[id]">) {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Product Detail</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ProductDetail {...props} />
      </Suspense>
    </main>
  );
}
