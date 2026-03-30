'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/context/LanguageContext';

const slides = [
  { src: '/hero1.jpg', alt: 'Luxury loafers on wood floor' },
  { src: '/hero2.jpg', alt: 'Black loafers outdoor lifestyle' },
  { src: '/hero3.jpg', alt: 'Black horsebit loafers closeup' },
];

export default function HeroSlider() {
  const { t, isRTL } = useLang();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    if (index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  };

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-dark-green">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? (animating ? 0 : 1) : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-dark-green/40 via-dark-green/30 to-dark-green/80" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 lg:pb-32" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-cream/60 mb-6">
            {isRTL ? 'تشكيلة ربيع / صيف 2025' : 'Collection Printemps / Été 2025'}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream leading-[1.0] mb-8">
            {isRTL ? (
              <>أحذية خارج الزمن<br /><em className="italic font-light">للأناقة</em><br />العصرية.</>
            ) : (
              <>Chaussures<br /><em className="italic font-light">pour l&apos;Élégance</em><br />Moderne.</>
            )}
          </h1>
          <p className="text-cream/60 text-sm md:text-base font-light leading-relaxed mb-10 max-w-md">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/shop" className="btn-outline-light inline-block">
              {t.shopNow}
            </Link>
            <Link href="/shop?category=men" className="text-cream/60 text-xs tracking-widest uppercase underline underline-offset-4 self-center hover:text-cream transition-colors">
              {t.viewMens}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-8 h-1.5 bg-cream'
                    : 'w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-[9px] tracking-[0.3em] uppercase text-cream/40">{t.scroll}</span>
        <div className="w-px h-12 bg-cream/20" />
      </div>
    </section>
  );
}
