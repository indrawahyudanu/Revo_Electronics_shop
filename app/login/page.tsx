import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="font-sans p-6 bg-gray-50 min-h-screen">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
