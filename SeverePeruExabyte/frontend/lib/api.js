const SERVER_API = process.env.BACKEND_URL || 'http://localhost:5001';
const CLIENT_API = '/api';

function getApiBase() {
  if (typeof window === 'undefined') return SERVER_API;
  return CLIENT_API;
}

export async function getProducts(category = 'all') {
  const base = getApiBase();
  const url = category && category !== 'all'
    ? `${base}/products?category=${category}`
    : `${base}/products`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProduct(id) {
  const base = getApiBase();
  const res = await fetch(`${base}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (typeof window !== 'undefined') return imageUrl;
  return `${SERVER_API}${imageUrl}`;
}

export function adminFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  const base = typeof window !== 'undefined' ? '/api' : SERVER_API;
  return fetch(`${base}${endpoint}`, { ...options, headers });
}
