'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="pt-32 min-h-screen max-w-md mx-auto px-6 pb-24">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-light text-warm-black mb-2">
          {tab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-warm-gray text-sm">
          {tab === 'login' ? 'Sign in to your account' : 'Join the Rym Shoes circle'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-beige mb-10">
        {['login', 'register'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs tracking-widest uppercase transition-colors duration-200
              ${tab === t ? 'text-warm-black border-b-2 border-dark-green' : 'text-warm-gray'}`}
          >
            {t === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {tab === 'register' && (
          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Full Name</label>
            <input type="text" required className="input-field" placeholder="James Sterling" />
          </div>
        )}
        <div>
          <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Email Address</label>
          <input type="email" required className="input-field" placeholder="james@sterling.co" />
        </div>
        <div>
          <label className="block text-[9px] tracking-[0.2em] uppercase text-warm-gray mb-2">Password</label>
          <input type="password" required className="input-field" placeholder="••••••••" />
        </div>
        {tab === 'login' && (
          <div className="text-right">
            <a href="#" className="text-[10px] tracking-widest uppercase text-warm-gray hover:text-warm-black underline underline-offset-2 transition-colors">
              Forgot Password?
            </a>
          </div>
        )}
        <button
          type="submit"
          className="w-full py-4 bg-warm-black text-cream text-xs font-semibold tracking-[0.2em] uppercase hover:bg-dark-green transition-colors duration-300"
        >
          {submitted ? '✓ Done' : tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-warm-gray mt-8">
        By continuing, you agree to our{' '}
        <a href="#" className="underline underline-offset-2">Terms</a> and{' '}
        <a href="#" className="underline underline-offset-2">Privacy Policy</a>.
      </p>
    </div>
  );
}
