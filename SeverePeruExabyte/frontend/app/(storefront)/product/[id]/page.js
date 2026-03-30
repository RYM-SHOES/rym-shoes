'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProduct, getImageUrl } from '@/lib/api';
import { useCart } from '@/context/CartContext';

const SIZES = ['39', '40', '41', '42', '43', '44', '45'];

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-beige" />
          <div className="pt-8">
            <div className="h-4 bg-beige w-1/4 mb-4" />
            <div className="h-10 bg-beige w-3/4 mb-6" />
            <div className="h-8 bg-beige w-1/4 mb-8" />
            <div className="h-24 bg-beige w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center">
        <p className="font-serif text-3xl font-light text-warm-gray mb-6">Product not found</p>
        <Link href="/shop" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    );
  }

  const imgUrl = getImageUrl(product.image_url);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warm-gray mb-12 tracking-wider uppercase">
          <Link href="/" className="hover:text-warm-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-warm-black transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-warm-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <div className="aspect-[3/4] bg-beige overflow-hidden">
            {imgUrl ? (
              <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-beige">
                <svg viewBox="0 0 200 150" width="60%" className="text-warm-black/20">
                  <path d="M30 120 Q60 90 100 85 Q140 80 170 120" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                  <rect x="40" y="108" width="120" height="15" rx="3" fill="currentColor" opacity="0.15"/>
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-3">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-warm-black leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-warm-black mb-8 tracking-wide">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            {product.description && (
              <p className="text-sm leading-relaxed text-warm-gray mb-10 border-t border-beige pt-8">
                {product.description}
              </p>
            )}

            {/* Size */}
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.18em] uppercase text-warm-gray mb-4">Select Size (EU)</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm border transition-all duration-200
                      ${selectedSize === size
                        ? 'bg-dark-green text-cream border-dark-green'
                        : 'border-beige text-warm-black hover:border-dark-green'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300
                ${added
                  ? 'bg-dark-green text-cream'
                  : 'bg-warm-black text-cream hover:bg-dark-green'}`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            {/* Details */}
            <div className="mt-10 border-t border-beige pt-8 space-y-4">
              {[
                ['Material', 'Full-grain leather'],
                ['Sole', 'Hand-stitched leather sole'],
                ['Origin', 'Handcrafted in Italy'],
                ['Care', 'Brush & condition regularly'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-warm-gray tracking-wide">{label}</span>
                  <span className="text-warm-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
