"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { 
  Menu, X, Home, User as UserIcon, Moon, Sun, Globe, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLang();
  
  // Collapse state
  const [isOpen, setIsOpen] = useState(true);
  // Theme state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read stored theme on mount and apply it
    const stored = localStorage.getItem('taskit_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('taskit_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem('taskit_theme', 'dark');
      setIsDark(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  if (!user) return null;

  return (
    <div 
      className={`
        bg-surface border-r border-surface-border transition-all duration-300 ease-in-out
        flex flex-col h-full relative z-40
        ${isOpen ? 'w-32 md:w-50' : 'w-8 md:w-16'}
      `}
    >
      {/* Header / Toggle */}
      <div className="h-16 flex items-center justify-between px-1 md:px-4 border-b border-surface-border overflow-hidden">
        {isOpen && <span className="font-bold text-base md:text-xl text-brand-600 dark:text-brand-400 truncate">Taskit</span>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 md:p-1.5 rounded-lg hover:bg-surface-hover text-slate-500 ml-auto shrink-0"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-1 md:px-3 overflow-hidden">
        <Link 
          href="/board" 
          className="flex items-center gap-1 md:gap-3 px-1 md:px-3 py-2.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          title={t('home')}
        >
          <Home size={20} className="shrink-0 mx-auto md:mx-0" />
          {isOpen && <span className="font-medium text-sm md:text-base truncate mx-auto">{t('home')}</span>}
        </Link>
        <Link 
          href="/profile" 
          className="flex items-center gap-1 md:gap-3 px-1 md:px-3 py-2.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          title={t('profile')}
        >
          <UserIcon size={20} className="shrink-0 mx-auto md:mx-0" />
          {isOpen && <span className="font-medium text-sm md:text-base truncate mx-auto">{t('profile')}</span>}
        </Link>
      </div>

      {/* Utilities / Bottom */}
      <div className="border-t border-surface-border p-1 md:p-3 flex flex-col gap-2 overflow-hidden">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-1 md:gap-3 px-1 md:px-3 py-2.5 rounded-lg hover:bg-surface-hover text-slate-700 dark:text-slate-300 transition-colors w-full"
          title={t('theme')}
        >
          {isDark ? <Sun size={20} className="shrink-0 mx-auto md:mx-0" /> : <Moon size={20} className="shrink-0 mx-auto md:mx-0" />}
          {isOpen && <span className="font-medium text-sm md:text-base truncate mx-auto">{t('theme')}</span>}
        </button>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1 md:gap-3 px-1 md:px-3 py-2.5 rounded-lg hover:bg-surface-hover text-slate-700 dark:text-slate-300 transition-colors w-full"
          title={t('language')}
        >
          <Globe size={20} className="shrink-0 mx-auto md:mx-0" />
          {isOpen && (
            <span className="font-medium text-sm md:text-base truncate mx-auto">
              {language === 'en' ? 'English' : 'Español'}
            </span>
          )}
        </button>

        <button 
          onClick={logout}
          className="flex items-center gap-1 md:gap-3 px-1 md:px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors w-full mt-2"
          title={t('logout')}
        >
          <LogOut size={20} className="shrink-0 mx-auto md:mx-0" />
          {isOpen && <span className="font-medium text-sm md:text-base truncate mx-auto">{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
}
