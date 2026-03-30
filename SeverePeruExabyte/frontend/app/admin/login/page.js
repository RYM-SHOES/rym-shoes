'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = '/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light text-warm-black mb-2">Rym SHOES</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-warm-gray">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="input-field"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-dark-green text-cream text-xs font-semibold tracking-[0.2em] uppercase hover:bg-forest transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-warm-gray">Default: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
