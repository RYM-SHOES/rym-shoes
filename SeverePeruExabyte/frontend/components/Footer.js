import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-warm-black text-cream/70 pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-cream/10">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl text-cream mb-4 tracking-widest">Rym SHOES</h3>
            <p className="text-sm leading-relaxed text-cream/50">
              Timeless footwear crafted for those who understand that true luxury whispers.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Shop</h5>
            <ul className="space-y-3">
              {[['New Arrivals', '/shop#new'], ['Men', '/shop?category=men'], ['Women', '/shop?category=women'], ['All Products', '/shop#all']].map(([label, href]) => (
                <li key={label}><Link href={href} className="text-sm text-cream/50 hover:text-cream transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Help</h5>
            <ul className="space-y-3">
              {['Sizing Guide', 'Shipping & Returns', 'Care Instructions', 'Contact Us'].map(label => (
                <li key={label}><a href="#" className="text-sm text-cream/50 hover:text-cream transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-cream mb-6">Company</h5>
            <ul className="space-y-3">
              {['Our Story', 'Craftsmanship', 'Sustainability', 'Press'].map(label => (
                <li key={label}><a href="#" className="text-sm text-cream/50 hover:text-cream transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30 tracking-wider">© 2025 Rym Shoes. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-cream/30">
            <a href="#" className="hover:text-cream transition-colors">Privacy</a>
            <a href="#" className="hover:text-cream transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
