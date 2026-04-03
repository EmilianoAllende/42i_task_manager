"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <nav className="h-16 border-b border-surface-border bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-brand-500 text-white p-1.5 rounded-lg flex items-center justify-center">
          <Image
            src="/icons/icono_taskit.png"
            alt="Taskit icon"
            width={20}
            height={20}
            className="object-contain"
            unoptimized
          />
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Taskit
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {user?.name}
        </span>
      </div>
    </nav>
  );
}
