"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { showToast } from 'nextjs-toast-notify';
import { LogIn } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast.error(data.error || t('login_failed'), {
          position: "top-right",
          duration: 3000,
          transition: "popUp",
        });
        return;
      }

      showToast.success(t('login_success'), {
        position: "top-right",
        duration: 2000,
        transition: "popUp",
      });
      
      login(data.user);
    } catch (err) {
      showToast.error('An unexpected error occurred', {
        position: "top-right",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500">
              <LogIn size={24} />
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-center mb-2">{t('welcome_back')}</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">{t('welcome_back')}</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">{t('email')}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border outline-none focus:ring-2 focus:ring-brand-500 transition-all dark:bg-slate-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('password')}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-surface-border outline-none focus:ring-2 focus:ring-brand-500 transition-all dark:bg-slate-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-all focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('saving') : t('login')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('no_account')}{' '}
            <Link href="/register" className="text-brand-500 hover:text-brand-400 font-medium transition-colors">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
