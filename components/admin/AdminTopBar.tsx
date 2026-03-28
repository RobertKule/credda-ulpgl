"use client";

import { Search, Sun, Moon, Bell, Maximize2, BellDot, Loader2, ArrowRight, FileText, BookOpen, Languages, Check, Menu, X, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Link, useRouter, usePathname } from "@/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const LOCALES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "sw", label: "Kiswahili", flag: "🇨🇩" },
];

export default function AdminTopBar({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const tSearch = useTranslations("AdminDashboard.search");
  const tUI = useTranslations("AdminDashboard.ui");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({ unreadMessagesCount: 0, newCasesCount: 0 });

  // Global Search Logic
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/global-search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangOpen]);

  return (
    <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-40 transition-all duration-500">
      <div className="h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6">
        
        {/* Mobile Menu & Logo */}
        {!isMobileSearchOpen && (
          <div className="flex items-center gap-4 lg:hidden animate-in fade-in duration-300">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
              className="p-3 bg-muted/40 rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-95"
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
               <span className="text-primary-foreground font-black text-xl italic">C</span>
            </div>
          </div>
        )}

        {/* Barre de Recherche Premium avec Dropdown */}
        <div className={`flex-1 max-w-2xl relative group ${isMobileSearchOpen ? 'flex fixed inset-x-0 top-0 h-20 bg-background z-50 px-4 items-center bg-card shadow-2xl scale-100' : 'hidden md:block scale-95 md:scale-100'} transition-all duration-300`}>
           <div className={`absolute inset-y-0 ${isMobileSearchOpen ? 'left-8' : 'left-4'} flex items-center pointer-events-none z-10 transition-colors ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`}>
              <Search size={18} strokeWidth={2.5} />
           </div>
           <Input 
             ref={searchInputRef}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             onFocus={() => setIsSearchFocused(true)}
             onBlur={() => {
                setTimeout(() => {
                  setIsSearchFocused(false);
                }, 200);
             }}
             placeholder={tSearch("placeholder")}
             className={`w-full ${isMobileSearchOpen ? 'pl-16' : 'pl-12'} h-12 bg-muted/40 border-transparent focus:border-primary/50 rounded-2xl font-bold text-xs uppercase tracking-widest focus-visible:ring-primary/10 transition-all placeholder:text-muted-foreground/40 text-foreground`}
           />
           
           {isMobileSearchOpen && (
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                className="ml-2 p-3 text-muted-foreground hover:text-primary md:hidden"
              >
                <X size={20} />
              </button>
           )}
           
           <AnimatePresence>
             {(isSearchFocused || isMobileSearchOpen) && searchQuery.length >= 2 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className={`absolute ${isMobileSearchOpen ? 'top-20' : 'top-14'} left-0 w-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-[100]`}
               >
                 <div className="p-4 border-b border-border bg-muted/30">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{tSearch("results")}</span>
                 </div>
                 <div className="max-h-80 overflow-y-auto custom-scrollbar">
                   {isSearching ? (
                     <div className="p-10 text-center">
                        <Loader2 className="animate-spin mx-auto text-primary mb-3" size={24} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tSearch("searching")}</p>
                     </div>
                   ) : searchResults.length > 0 ? (
                     <div className="py-2">
                       {searchResults.map((result: any) => (
                         <Link 
                           key={`${result.type}-${result.id}`} 
                           href={result.href}
                           onClick={() => {
                             setIsMobileSearchOpen(false);
                             setIsSearchFocused(false);
                           }}
                           className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-all group"
                         >
                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                               {result.type === 'Article' ? <FileText size={18} /> : result.type === 'Publication' ? <BookOpen size={18} /> : result.type === 'User' ? <Users size={18} /> : <Search size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold text-foreground truncate">{result.title}</p>
                               <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary/60 mt-0.5">{result.type}</p>
                            </div>
                            <ArrowRight size={14} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                         </Link>
                       ))}
                     </div>
                   ) : (
                     <div className="p-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{tSearch("noResults", { query: searchQuery })}</p>
                     </div>
                   )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {!isSearchFocused && !isMobileSearchOpen && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                 <span className="text-[9px] font-black bg-muted/60 px-2 py-1 rounded-md text-muted-foreground/60 uppercase tracking-tighter">⌘</span>
                 <span className="text-[9px] font-black bg-muted/60 px-2 py-1 rounded-md text-muted-foreground/60 uppercase tracking-tighter">K</span>
              </div>
           )}
        </div>

        {/* Actions Client-Side */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
           
           {/* Mobile Search Toggle Icon */}
           {!isMobileSearchOpen && (
             <button 
               onClick={() => {
                 setIsMobileSearchOpen(true);
                 setTimeout(() => searchInputRef.current?.focus(), 200);
               }}
               className="md:hidden p-3 bg-muted/40 rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-95"
             >
                <Search size={20} />
             </button>
           )}

           <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

           {/* Theme Switcher */}
           <button 
             onClick={toggleTheme} 
             title={tUI("theme")}
             className="relative w-12 h-12 flex items-center justify-center bg-muted/40 rounded-2xl text-muted-foreground hover:text-primary transition-all overflow-hidden group active:scale-95"
           >
              <div className={`absolute transition-transform duration-500 ${theme === 'dark' ? 'translate-y-0' : 'translate-y-12'}`}>
                 <Moon size={20} />
              </div>
              <div className={`absolute transition-transform duration-500 ${theme === 'light' ? 'translate-y-0' : '-translate-y-12'}`}>
                 <Sun size={20} />
              </div>
           </button>

           {/* Language Switcher */}
           <div className="relative" ref={langRef}>
             <button
               onClick={() => setIsLangOpen(prev => !prev)}
               className="w-12 h-12 flex items-center justify-center bg-muted/40 rounded-2xl text-muted-foreground hover:text-primary transition-all active:scale-95"
               title={tUI("language")}
             >
               <Languages size={20} />
             </button>
             <AnimatePresence>
               {isLangOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 8, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 8, scale: 0.95 }}
                   transition={{ duration: 0.15 }}
                   className="absolute right-0 top-14 w-44 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[200]"
                 >
                   {LOCALES.map((lang) => (
                     <button
                       key={lang.code}
                       onClick={() => {
                         setIsLangOpen(false);
                         router.replace(pathname, { locale: lang.code as any });
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                         locale === lang.code ? 'text-primary' : 'text-foreground/70'
                       }`}
                     >
                       <span className="text-lg">{lang.flag}</span>
                       <span className="text-[11px] font-black uppercase tracking-widest flex-1">{lang.label}</span>
                       {locale === lang.code && <Check size={12} className="text-primary" />}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

            {/* Notifications */}
            <button 
              className="w-12 h-12 flex items-center justify-center bg-muted/40 rounded-2xl text-muted-foreground hover:text-primary transition-all relative active:scale-95 group"
              title={tUI("notifications")}
            >
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              {stats.newCasesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-primary text-primary-foreground text-[10px] font-black rounded-md flex items-center justify-center ring-4 ring-background shadow-xl">
                  {stats.newCasesCount > 9 ? '9+' : stats.newCasesCount}
                </span>
              )}
           </button>

           <div className="h-8 w-[1px] bg-border mx-2 hidden lg:block" />

            {/* User Profile Summary */}
            <div 
              className="hidden lg:flex items-center gap-4 bg-muted/40 pl-4 pr-2 py-1.5 rounded-2xl border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
              title={tUI("profile")}
            >
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                   {session?.user?.name || 'Administrateur'}
                 </p>
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60 leading-none">
                   {(session?.user as any)?.role || 'Super Admin'}
                 </p>
              </div>
              <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center text-xs font-black shadow-lg shadow-primary/5 group-hover:scale-105 transition-transform">
                 {session?.user?.name?.[0] || 'A'}
              </div>
           </div>

        </div>
      </div>
    </header>
  );
}
