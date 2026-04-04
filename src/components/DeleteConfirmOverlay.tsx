"use client";

import { AlertTriangle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export default function DeleteConfirmOverlay({ onCancel, onConfirm, deleting }: Props) {
  const { t } = useLang();

  return (
    <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm border border-red-100 dark:border-red-900/30 text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{t('confirm_title')}</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{t('confirm_msg')}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium shadow-md transition-all disabled:opacity-50"
          >
            {deleting ? t('deleting') : t('confirm_yes')}
          </button>
        </div>
      </div>
    </div>
  );
}
