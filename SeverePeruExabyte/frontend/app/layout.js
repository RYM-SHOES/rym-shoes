import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'Rym SHOES — Timeless Shoes',
  description: 'Luxury footwear with a timeless aesthetic. Timeless shoes for modern elegance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
