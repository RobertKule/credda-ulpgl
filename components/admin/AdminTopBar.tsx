"use client";

import { Search, Sun, Moon, Bell, Maximize2, BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function AdminTopBar({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState({ unreadMessagesCount: 0, newCasesCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
    // Refresh every 2 minutes
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0C0C0A]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-40 transition-all duration-500">
      <div className="h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6">
        
        {/* Barre de Recherche Premium */}
        <div className={`flex-1 max-w-2xl transition-all duration-500 relative group hidden md:block`}>
           <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors ${isSearchFocused ? 'text-[#C9A84C]' : 'text-slate-400'}`}>
              <Search size={18} strokeWidth={2.5} />
           </div>
           <Input 
             ref={searchInputRef}
             onFocus={() => setIsSearchFocused(true)}
             onBlur={() => setIsSearchFocused(false)}
             placeholder="Rechercher un article, un membre ou une donnée..."
             className={`w-full pl-12 h-12 bg-slate-50 dark:bg-white/5 border-transparent dark:border-transparent rounded-2xl font-bold text-xs uppercase tracking-widest focus-visible:ring-[#C9A84C]/10 focus:border-[#C9A84C]/50 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white`}
           />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
              <span className="text-[9px] font-black bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-md text-slate-500 uppercase tracking-tighter">⌘</span>
              <span className="text-[9px] font-black bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-md text-slate-500 uppercase tracking-tighter">K</span>
           </div>
        </div>

        {/* Actions Client-Side */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
           
           {/* Mobile Search Trigger */}
           <button className="md:hidden p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-[#C9A84C] transition-all active:scale-95">
              <Search size={20} />
           </button>

           <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5 mx-2 hidden sm:block" />

           {/* Theme Switcher */}
           <button 
             onClick={toggleTheme} 
             className="relative w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-[#C9A84C] dark:hover:text-[#C9A84C] transition-all overflow-hidden group active:scale-95"
           >
              <div className={`absolute transition-transform duration-500 ${theme === 'dark' ? 'translate-y-0' : 'translate-y-12'}`}>
                 <Moon size={20} />
              </div>
              <div className={`absolute transition-transform duration-500 ${theme === 'light' ? 'translate-y-0' : '-translate-y-12'}`}>
                 <Sun size={20} />
              </div>
           </button>

           {/* Notifications */}
           <button className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-[#C9A84C] transition-all relative active:scale-95 group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {stats.newCasesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#C9A84C] text-[#0C0C0A] text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#0C0C0A] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                  {stats.newCasesCount > 9 ? '9+' : stats.newCasesCount}
                </span>
              )}
           </button>

           <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5 mx-2 hidden lg:block" />

           {/* User Profile Summary */}
           <div className="hidden lg:flex items-center gap-4 bg-slate-50 dark:bg-white/5 pl-4 pr-2 py-1.5 rounded-2xl border border-transparent hover:border-[#C9A84C]/10 transition-all cursor-pointer group">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-[#C9A84C] transition-colors">
                   {session?.user?.name || 'Administrateur'}
                 </p>
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60 leading-none">
                   {(session?.user as any)?.role || 'Super Admin'}
                 </p>
              </div>
              <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center text-[#0C0C0A] text-xs font-black shadow-lg shadow-[#C9A84C]/20 group-hover:scale-105 transition-transform">
                 {session?.user?.name?.[0] || 'A'}
              </div>
           </div>

        </div>
      </div>
    </header>
  );
}
