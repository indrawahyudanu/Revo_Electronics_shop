'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = 'user' | 'admin';
type LoginErrors = { email?: string; password?: string };

const ENDPOINTS: Record<Mode, string> = {
  user: '/user/login',
  admin: '/admin/login',
};

// Satu tempat untuk menyesuaikan nama field body login dengan backend
// (mis. ganti `password` menjadi `password_hash` bila backend memintanya).
function buildLoginBody(email: string, password: string) {
  return { email, password };
}

// Hanya terima path internal untuk mencegah open redirect
function safeRedirect(value: string | null): string | null {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value;
  return null;
}

// Batas tunggu request ke backend. Render free tier bisa "cold start"
// (server tidur) dan butuh beberapa puluh detik untuk bangun.
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

// Dekode payload (klaim) dari JWT tanpa verifikasi — hanya untuk membaca
// id/email/role di sisi klien. Verifikasi tetap dilakukan backend.
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: 'email' | 'password', value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(f: typeof form): LoginErrors {
    const e: LoginErrors = {};
    if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address';
    if (!f.password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError('');

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetchWithTimeout(
        `${base}${ENDPOINTS[mode]}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildLoginBody(form.email, form.password)),
        },
        REQUEST_TIMEOUT_MS
      );

      let data: Record<string, unknown> = {};
      try {
        data = await res.json();
      } catch {
        // body bukan JSON
      }

      if (res.ok) {
        const token = data.token ?? data.access_token;
        if (typeof token === 'string' && token) localStorage.setItem('token', token);

        // Prefer objek user dari body; jika tidak ada, baca klaim dari JWT.
        // Backend menaruh id di `sub` (identity) serta email & role di additional_claims.
        const claims = typeof token === 'string' ? decodeJwt(token) : null;
        const src = (data.user && typeof data.user === 'object' ? data.user : {}) as Record<
          string,
          unknown
        >;
        // login() memperbarui state AuthContext (Header langsung berubah,
        // tanpa perlu refresh) sekaligus menyimpan ke localStorage.
        login({
          id: (src.id ?? claims?.sub) as string | number,
          username: (src.customer_name ?? src.username) as string | undefined,
          email: (src.email ?? claims?.email ?? form.email) as string | undefined,
          role: (src.role ?? claims?.role ?? (mode === 'admin' ? 'admin' : 'customer')) as
            | string
            | undefined,
        });

        const target = safeRedirect(searchParams.get('redirect')) ?? (mode === 'admin' ? '/admin' : '/');
        router.push(target);
      } else {
        const msg = data.error ?? data.message;
        setFormError(typeof msg === 'string' && msg ? msg : 'Invalid email or password');
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
  const tab = (active: boolean) =>
    `flex-1 px-3 py-1.5 text-sm rounded ${active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-sm bg-white border rounded-lg p-5 shadow-sm"
    >
      <h2 className="font-semibold text-lg mb-3">Login</h2>

      <div className="flex gap-2 mb-3" role="group" aria-label="Login as">
        <button type="button" aria-pressed={mode === 'user'} className={tab(mode === 'user')} onClick={() => setMode('user')}>
          User
        </button>
        <button type="button" aria-pressed={mode === 'admin'} className={tab(mode === 'admin')} onClick={() => setMode('admin')}>
          Admin
        </button>
      </div>

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
        {submitting ? 'Logging in…' : 'Login'}
      </button>
    </form>
  );
}
