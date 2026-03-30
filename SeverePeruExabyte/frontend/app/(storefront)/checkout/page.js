'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو',
  'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس',
  'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر',
  'ورقلة', 'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف',
  'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة',
  'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان', 'تيميمون',
  'برج باجي مختار', 'أولاد جلال', 'بني عباس', 'إن صالح', 'إن قزام',
  'توقرت', 'جانت', 'المغير', 'المنيعة',
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    clearCart();
    setPlaced(true);
    setLoading(false);
  };

  if (placed) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-dark-green/10 flex items-center justify-center mb-8">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C3E35" strokeWidth="1.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-4xl font-light text-warm-black mb-4">تم تأكيد الطلب</h1>
        <p className="text-warm-gray text-sm mb-2 max-w-sm">شكراً لطلبك. سيتم التواصل معك قريباً لتأكيد التوصيل.</p>
        <p className="text-xs text-warm-gray mb-10 tracking-widest uppercase">طلب رقم #RS{Math.floor(Math.random() * 90000) + 10000}</p>
        <Link href="/shop" className="btn-primary inline-block">مواصلة التسوق</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen max-w-5xl mx-auto px-6 pb-24" dir="rtl">
      <h1 className="font-serif text-5xl font-light mb-16">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* معلومات الاتصال */}
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">معلومات المشتري</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">الاسم الأول</label>
                  <input required type="text" className="input-field" placeholder="محمد" />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">اللقب</label>
                  <input required type="text" className="input-field" placeholder="بن علي" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">رقم الهاتف</label>
                <input required type="tel" className="input-field" placeholder="05 XX XX XX XX" dir="ltr" />
              </div>
            </div>
          </div>

          {/* معلومات التوصيل */}
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">عنوان التوصيل</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">العنوان الكامل</label>
                <input required type="text" className="input-field" placeholder="رقم، شارع، حي..." />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">الولاية</label>
                <select required className="input-field bg-white" defaultValue="">
                  <option value="" disabled>اختر الولاية</option>
                  {WILAYAS.map((w, i) => (
                    <option key={i} value={w}>{String(i + 1).padStart(2, '0')} - {w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] text-warm-gray mb-2">البلدية</label>
                <input required type="text" className="input-field" placeholder="البلدية" />
              </div>
            </div>
          </div>

          {/* طريقة الدفع */}
          <div>
            <h2 className="font-serif text-2xl font-light mb-6">طريقة الدفع</h2>
            <div className="p-6 bg-beige/40 border border-beige flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-green/10 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C3E35" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-black">الدفع عند الاستلام</p>
                <p className="text-xs text-warm-gray mt-0.5">ادفع نقداً عند وصول طلبك</p>
              </div>
              <div className="mr-auto">
                <div className="w-4 h-4 rounded-full bg-dark-green border-2 border-dark-green flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cream" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full py-4 bg-warm-black text-cream text-xs font-semibold tracking-[0.2em] hover:bg-dark-green transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري تأكيد الطلب...' : `تأكيد الطلب — ${total.toFixed(2)} دج`}
          </button>
        </form>

        {/* ملخص الطلب */}
        <div className="bg-cream border border-beige p-8 h-fit">
          <h2 className="font-serif text-2xl font-light mb-8">ملخص الطلب</h2>
          {items.length === 0 ? (
            <p className="text-sm text-warm-gray">سلتك فارغة. <Link href="/shop" className="underline">تسوق الآن</Link></p>
          ) : (
            <div className="space-y-6">
              {items.map(({ key, product, size, qty }) => (
                <div key={key} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-warm-gray text-xs mt-1">مقاس {size} × {qty}</p>
                  </div>
                  <span>{(parseFloat(product.price) * qty).toFixed(2)} دج</span>
                </div>
              ))}
              <div className="border-t border-beige pt-4 flex justify-between font-semibold">
                <span>المجموع</span>
                <span>{total.toFixed(2)} دج</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
