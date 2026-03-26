// components/admin/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  UserCircle, 
  Mail, 
  Users,
  LogOut,
  ChevronLeft,
  X,
  Scale,
  Calendar,
  Layout,
  Menu,
  Megaphone,
  MessageSquare
} from "lucide-react";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  FileText,
  BookOpen,
  UserCircle,
  Mail,
  Users,
  Scale,
  Calendar,
  Layout,
  Megaphone,
  MessageSquare
};

interface MenuItem {
  href: string;
  label: string;
  icon: string;
}

interface AdminSidebarProps {
  locale: string;
  menuItems: MenuItem[];
}

export default function AdminSidebar({ locale, menuItems }: AdminSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  }, []);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const fullMenuItems = [
    ...menuItems,
    { href: "/admin/profile", label: "Mon Profil", icon: "UserCircle" },
  ];

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
    const interval = setInterval(fetchStats, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed lg:sticky top-0 left-0 z-[110]
          h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5
          transition-all duration-500 ease-in-out
          flex flex-col text-slate-900 dark:text-white
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-80' : 'w-0 lg:w-24'}
          overflow-hidden shadow-2xl
        `}
      >
        {/* BOUTON RÉDUCTEUR STICKY TOP */}
        <div className={`
          sticky top-0 z-20 h-20 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center
          ${isOpen ? 'px-6 justify-between' : 'px-0 justify-center'}
        `}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] rounded-md flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
                  <span className="text-[#0C0C0A] font-black text-xl">C</span>
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-black text-slate-900 dark:text-white leading-none tracking-tight transition-colors">CREDDA</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#C9A84C] dark:text-[#C9A84C]/80 mt-1">Admin v2.5</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md transition-all hover:text-[#C9A84C] active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-[#C9A84C] hover:text-[#0C0C0A] hover:scale-110 active:scale-90 rounded-md transition-all shadow-xl"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-10 overflow-y-auto custom-scrollbar px-3 space-y-1">
          <div className={`mb-6 flex items-center gap-4 ${isOpen ? 'px-4' : 'justify-center'}`}>
             <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5" />
             {isOpen && <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-white/30 whitespace-nowrap transition-colors">Principal</span>}
             <div className="h-[1px] flex-1 bg-slate-200 dark:bg-white/5" />
          </div>

          <ul className="space-y-2">
            {fullMenuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              const Icon = iconMap[item.icon];

              if (!Icon) return null;

              return (
                <li key={item.href} className="relative px-3">
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-4 rounded-md
                      transition-all duration-300 group relative z-10
                      ${isActive 
                        ? 'text-[#C9A84C]' 
                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-[#C9A84C]/5 dark:bg-[#C9A84C]/10 rounded-md border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <Icon size={20} className={`
                      shrink-0 transition-all duration-500 relative z-20
                      ${isActive ? 'text-[#C9A84C] scale-110' : 'text-slate-300 dark:text-white/20 group-hover:text-[#C9A84C] group-hover:scale-110'}
                      ${isOpen ? 'mr-5' : 'mx-auto'}
                    `} strokeWidth={isActive ? 2.5 : 2} />
                    
                    {isOpen && (
                      <span className={`
                        text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors relative z-20
                        ${isActive ? 'text-[#C9A84C]' : ''}
                      `}>
                        {item.label}
                      </span>
                    )}

                    {/* Numeric Badges */}
                    {isOpen && item.label === "Messages" && stats.unreadMessagesCount > 0 && (
                      <span className="ml-auto bg-[#C9A84C] text-[#0C0C0A] text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-[#C9A84C]/20 border border-[#0C0C0A]/10 relative z-20">
                        {stats.unreadMessagesCount}
                      </span>
                    )}
                    
                    {isOpen && item.label === "Dashboard" && stats.newCasesCount > 0 && (
                      <span className="ml-auto bg-emerald text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-emerald/20 relative z-20">
                        {stats.newCasesCount}
                      </span>
                    )}

                    {!isOpen && ((item.label === "Messages" && stats.unreadMessagesCount > 0) || (item.label === "Dashboard" && stats.newCasesCount > 0)) && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-[#C9A84C] rounded-md ring-2 ring-white dark:ring-[#0C0C0A] animate-pulse z-30" />
                    )}

                    {isActive && (
                       <motion.div 
                         layoutId="active-bar"
                         className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A84C] rounded-r-full shadow-[0_0_15px_rgba(201,168,76,0.5)] z-30" 
                       />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar Apparence Bento */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-white/5 pb-8 transition-colors">
          {isOpen ? (
            <div className={`flex items-center gap-4 p-4 rounded-md bg-white dark:bg-[#C9A84C]/5 border border-slate-200 dark:border-white/5 group hover:border-[#C9A84C]/20 transition-all duration-500 shadow-sm`}>
              <div className="w-11 h-11 bg-[#C9A84C] rounded-md flex items-center justify-center text-[#0C0C0A] text-sm font-black shadow-lg shadow-[#C9A84C]/30 group-hover:rotate-12 transition-transform">
                {session?.user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white truncate transition-colors">{session?.user?.name || 'Administrateur'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-md bg-emerald animate-pulse shadow-[0_0_8px_var(--color-emerald-glow)]" />
                   <p className="text-[8px] font-black uppercase tracking-widest text-emerald transition-colors">Actif</p>
                </div>
              </div>
              <button 
                className="p-2.5 hover:bg-red-50 dark:hover:bg-red-500 rounded-md transition-all group/logout shadow-sm hover:shadow-red-500/20 active:scale-90"
                aria-label="Déconnexion"
                onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              >
                <LogOut size={16} className="text-slate-300 dark:text-white/30 group-hover/logout:text-red-600 dark:group-hover/logout:text-white transition-colors" />
              </button>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-[#C9A84C] rounded-md flex items-center justify-center text-[#0C0C0A] font-black shadow-xl">
                  {session?.user?.name?.[0] || 'A'}
                </div>
                <button 
                  className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-white/5 hover:bg-red-500 text-slate-500 hover:text-white rounded-md transition-all group/logout active:scale-90 shadow-sm"
                  onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                >
                   <LogOut size={20} className="transition-colors" />
                </button>
             </div>
          )}
        </div>
      </aside>
    </>
  );
}