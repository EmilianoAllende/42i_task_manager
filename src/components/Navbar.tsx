"use client";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-brand-500 text-white p-1.5 rounded-lg">
          <LayoutDashboard size={20} />
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Taskflow
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {user?.name}
        </span>
        <button 
          onClick={logout} 
          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
