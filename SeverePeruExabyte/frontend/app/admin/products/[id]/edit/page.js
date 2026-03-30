'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/lib/api';

const API_BASE = '/api';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'men' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.replace('/admin/login'); return; }
    fetch(`${API_BASE}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setForm({ name: data.name, price: data.price, description: data.description || '', category: data.category });
        setCurrentImage(getImageUrl(data.image_url));
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setFetching(false));
  }, [id, router]);

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
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-lg px-6">
        {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-beige animate-pulse rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-dark-green text-cream px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="font-serif text-xl tracking-widest">Rym SHOES</Link>
        <Link href="/admin/dashboard" className="text-cream/70 text-xs tracking-widest uppercase hover:text-cream transition-colors">
          ← Back
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-light text-warm-black mb-12">Edit Product</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-8">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Product Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="admin-input" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Price (USD) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="admin-input" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="admin-input">
                <option value="men">Men's</option>
                <option value="women">Women's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Description</label>
              <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="admin-input resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Product Image</label>
              <div className="border-2 border-dashed border-beige p-8 text-center bg-white">
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-xs text-warm-gray underline">Remove</button>
                  </div>
                ) : currentImage ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={currentImage} alt="Current" className="max-h-48 object-contain" />
                    <label className="cursor-pointer text-xs text-warm-gray underline">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <div>
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
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/dashboard" className="btn-outline inline-block">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
