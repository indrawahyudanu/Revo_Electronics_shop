'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RegisterFormData } from '@/types/product';
import { useAuth } from '@/components/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Batas tunggu request ke backend. Render free tier bisa "cold start"
// (server tidur) dan butuh beberapa puluh detik untuk bangun, jadi kita
// beri waktu agak longgar sebelum menyerah.
const REQUEST_TIMEOUT_MS = 30000;

async function fetchWithTimeout(input: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState('');
  const [redirectedTo, setRedirectedTo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof RegisterFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(f: RegisterFormData): RegisterErrors {
    const e: RegisterErrors = {};
    if (!f.username.trim()) e.username = 'Username is required';
    if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address';
    if (f.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (f.confirmPassword !== f.password) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError('');
    setRedirectedTo('');

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // jangan POST data invalid

    setSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetchWithTimeout(
        `${base}/users/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: form.username,
            email: form.email,
            password: form.password,
          }),
        },
        REQUEST_TIMEOUT_MS
      );

      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        const user = data.new_user ?? {};
        // login() memperbarui state AuthContext (Header langsung berubah,
        // tanpa perlu refresh) sekaligus menyimpan ke localStorage.
        login({
          id: user.id,
          username: user.customer_name,
          email: user.email,
          role: user.role,
        });
        setRedirectedTo('/');
        router.push('/');
      } else if (res.status === 400) {
        // Backend mengembalikan 400 untuk duplikat (status "fail")
        // maupun field kosong (key "error").
        setFormError(data.message || data.error || 'Registration failed. Please try again.');
      } else {
        setFormError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setFormError(
          'Server tidak merespons (mungkin sedang "bangun" dari idle). Tunggu sebentar lalu coba lagi.'
        );
      } else {
        setFormError('Unable to reach the server. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const field = 'w-full border rounded px-3 py-2';
  const errText = 'text-sm text-red-600 mt-1 mb-2';

  if (redirectedTo) {
    return (
      <div className="max-w-sm bg-green-50 border border-green-200 text-green-700 rounded-lg p-5">
        &#10003; Account created — redirected to {redirectedTo}. Welcome, {form.username}!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-sm bg-white border rounded-lg p-5 shadow-sm"
    >
      <h2 className="font-semibold text-lg mb-3">Create account</h2>

      <label htmlFor="username" className="text-sm">Username</label>
      <input
        id="username"
        className={field}
        value={form.username}
        onChange={(e) => update('username', e.target.value)}
      />
      {errors.username && <p className={errText}>{errors.username}</p>}

      <label htmlFor="email" className="text-sm">Email</label>
      <input
        id="email"
        className={field}
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
      />
      {errors.email && <p className={errText}>{errors.email}</p>}

      <label htmlFor="password" className="text-sm">Password</label>
      <input
        id="password"
        type="password"
        className={field}
        value={form.password}
        onChange={(e) => update('password', e.target.value)}
      />
      {errors.password && <p className={errText}>{errors.password}</p>}

      <label htmlFor="confirmPassword" className="text-sm">Confirm password</label>
      <input
        id="confirmPassword"
        type="password"
        className={field}
        value={form.confirmPassword}
        onChange={(e) => update('confirmPassword', e.target.value)}
      />
      {errors.confirmPassword && <p className={errText}>{errors.confirmPassword}</p>}

      {formError && (
        <p className="mt-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-3 px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
      >
        {submitting ? 'Creating…' : 'Register'}
      </button>
    </form>
  );
}
