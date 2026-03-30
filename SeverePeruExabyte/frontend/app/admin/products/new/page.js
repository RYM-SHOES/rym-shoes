'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE = '/api';

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: 'men',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Nav */}
      <nav className="bg-dark-green text-cream px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-serif text-xl tracking-widest">Rym SHOES</Link>
        <Link href="/admin/dashboard" className="text-cream/70 text-xs tracking-widest uppercase hover:text-cream transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-light text-warm-black mb-12">Add New Product</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-8">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="admin-input"
                placeholder="Oxford Brogue — Black"
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Price (USD) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="admin-input"
                placeholder="395.00"
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="admin-input"
              >
                <option value="men">Men's</option>
                <option value="women">Women's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="admin-input resize-none"
                placeholder="Hand-crafted full-grain leather with antique brass eyelets..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Product Image</label>
              <div className="border-2 border-dashed border-beige p-8 text-center bg-white">
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="text-xs text-warm-gray underline">Remove</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-warm-gray text-sm mb-4">Drop image here or click to upload</p>
                    <label className="cursor-pointer btn-outline inline-block">
                      Choose Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <p className="text-xs text-warm-gray mt-2">PNG, JPG, WebP — max 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link href="/admin/dashboard" className="btn-outline inline-block">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
