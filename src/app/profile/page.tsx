"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { showToast } from "nextjs-toast-notify";
import { AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const { t } = useLang();
  
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start 3-second countdown when modal opens
  useEffect(() => {
    if (showDeleteModal) {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Reset when closed
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(3);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showDeleteModal]);

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
      login({ ...user, name });
    } catch (err) {
      showToast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (!res.ok) throw new Error();

      showToast.success(t('delete_account_success'));
      setShowDeleteModal(false);
      logout();
    } catch (err) {
      showToast.error("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">{t('profile_title')}</h1>
      
      {/* Profile update form */}
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

      {/* Danger Zone */}
      <div className="mt-8 bg-surface border border-red-200 dark:border-red-900/40 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">{t('delete_account')}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('delete_account_msg')}</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium shadow-sm transition-all"
        >
          {t('delete_account')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border border-red-100 dark:border-red-900/30">
            <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">
              {t('delete_account_confirm')}
            </h3>
            <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
              {t('delete_account_msg')}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-5 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={countdown > 0 || deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center gap-2"
              >
                {deleting ? t('deleting') : countdown > 0 ? `${t('confirm_yes')} (${countdown}s)` : t('confirm_yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
