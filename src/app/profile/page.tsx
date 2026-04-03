"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { showToast } from "nextjs-toast-notify";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { t } = useLang();
  
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name })
      });

      if (!res.ok) throw new Error();

      showToast.success(t('update_success'));
      // Update local storage context
      login({ ...user, name });
    } catch (err) {
      showToast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">{t('profile_title')}</h1>
      
      <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('email')}</label>
            <input 
              type="text" 
              value={user.email} 
              disabled
              className="w-full px-4 py-3 rounded-lg border border-surface-border bg-surface-hover text-slate-500 cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">{t('name')}</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-surface-border bg-surface outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading || name === user.name}
            className="w-full md:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-50"
          >
            {loading ? t('saving') : t('update_profile')}
          </button>
        </form>
      </div>
    </div>
  );
}
