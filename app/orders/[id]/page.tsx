import { Suspense } from "react";

async function OrderDetail({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <p>Order #{id}</p>;
}

export default function OrderDetailPage(props: PageProps<"/orders/[id]">) {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Order Detail</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <OrderDetail {...props} />
      </Suspense>
    </main>
  );
}
