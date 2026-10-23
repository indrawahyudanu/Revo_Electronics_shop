import { Suspense } from "react";

async function CategoryDetail({ params }: PageProps<"/categories/[id]">) {
  const { id } = await params;
  return <p>Kategori #{id}</p>;
}

export default function CategoryPage(props: PageProps<"/categories/[id]">) {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Kategori</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <CategoryDetail {...props} />
      </Suspense>
    </main>
  );
}
