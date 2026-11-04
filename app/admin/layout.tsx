export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      {children}
    </section>
  );
}
