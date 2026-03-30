'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/api';

const API_BASE = '/api';

function AdminNav({ username, onLogout }) {
  return (
    <nav className="bg-dark-green text-cream px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/admin/dashboard" className="font-serif text-xl tracking-widest">Rym SHOES</Link>
        <span className="text-cream/40 text-xs tracking-wider uppercase">Admin</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/admin/products/new" className="bg-cream text-dark-green text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:bg-beige transition-colors">
          + Add Product
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-cream/60 text-xs">{username}</span>
          <button onClick={onLogout} className="text-cream/60 text-xs tracking-widest uppercase hover:text-cream transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.replace('/admin/login'); return; }
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    setUsername(user.username || 'Admin');
    fetchProducts(token);
  }, [router]);

  const fetchProducts = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.replace('/admin/login');
  };

  return (
    <>
      <AdminNav username={username} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Products', value: products.length },
            { label: "Men's", value: products.filter(p => p.category === 'men').length },
            { label: "Women's", value: products.filter(p => p.category === 'women').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-beige p-6">
              <p className="text-xs tracking-widest uppercase text-warm-gray mb-2">{label}</p>
              <p className="font-serif text-4xl font-light text-warm-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl font-light text-warm-black">All Products</h2>
          <Link href="/admin/products/new" className="btn-primary inline-block text-xs">+ Add Product</Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-beige animate-pulse rounded" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white border border-beige">
            <p className="font-serif text-2xl font-light text-warm-gray mb-4">No products yet</p>
            <Link href="/admin/products/new" className="btn-primary inline-block">Add First Product</Link>
          </div>
        ) : (
          <div className="bg-white border border-beige overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-cream">
                  <th className="text-left px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-warm-gray">Product</th>
                  <th className="text-left px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-warm-gray hidden md:table-cell">Category</th>
                  <th className="text-right px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-warm-gray">Price</th>
                  <th className="text-right px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-warm-gray hidden md:table-cell">Added</th>
                  <th className="text-right px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-warm-gray">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {products.map(product => {
                  const imgUrl = getImageUrl(product.image_url);
                  return (
                    <tr key={product.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-14 bg-beige flex-shrink-0 overflow-hidden">
                            {imgUrl ? (
                              <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-beige" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-warm-black">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-warm-gray line-clamp-1 mt-0.5 max-w-xs">{product.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`text-[9px] tracking-widest uppercase font-semibold px-2 py-1
                          ${product.category === 'men' ? 'bg-dark-green/10 text-dark-green' : 'bg-sand/20 text-warm-gray'}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-sm">
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-warm-gray hidden md:table-cell">
                        {new Date(product.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/products/${product.id}/edit`}
                            className="text-[9px] tracking-widest uppercase text-dark-green hover:underline underline-offset-2">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="text-[9px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                          >
                            {deleting === product.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
