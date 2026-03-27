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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("AdminDashboard.sidebar");
  const pathname = usePathname();
  // Strip locale prefix (e.g. /fr/admin → /admin)
  const localelessPath = pathname.replace(/^\/[a-z]{2}(?=\/)/, '') || pathname;
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
    { href: "/admin/profile", label: t("profile"), icon: "UserCircle" },
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
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed lg:sticky top-0 left-0 z-[110]
          h-screen bg-card border-r border-border
          transition-all duration-500 ease-in-out
          flex flex-col text-foreground
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-80' : 'w-0 lg:w-24'}
          overflow-hidden shadow-2xl
        `}
      >
        {/* BOUTON RÉDUCTEUR STICKY TOP */}
        <div className={`
          sticky top-0 z-20 h-20 border-b border-border bg-card/80 backdrop-blur-md flex items-center
          ${isOpen ? 'px-6 justify-between' : 'px-0 justify-center'}
        `}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-primary-foreground font-black text-xl">C</span>
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-black text-foreground leading-none tracking-tight transition-colors">CREDDA</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/80 mt-1">Admin v2.5</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-muted rounded-md transition-all hover:text-primary active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 flex items-center justify-center bg-muted hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-90 rounded-md transition-all shadow-xl"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-10 overflow-y-auto custom-scrollbar px-3 space-y-1">
          <div className={`mb-6 flex items-center gap-4 ${isOpen ? 'px-4' : 'justify-center'}`}>
             <div className="h-[1px] flex-1 bg-border" />
             {isOpen && <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 whitespace-nowrap transition-colors">{t("main")}</span>}
             <div className="h-[1px] flex-1 bg-border" />
          </div>

          <ul className="space-y-2">
            {fullMenuItems.map((item) => {
              const isActive = localelessPath === item.href || 
                (item.href !== '/admin' && localelessPath?.startsWith(item.href));
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
                        ? 'text-primary' 
                        : 'text-muted-foreground/60 hover:text-foreground'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-primary/5 rounded-md border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <Icon size={20} className={`
                      shrink-0 transition-all duration-500 relative z-20
                      ${isActive ? 'text-primary scale-110' : 'text-muted-foreground/30 group-hover:text-primary group-hover:scale-110'}
                      ${isOpen ? 'mr-5' : 'mx-auto'}
                    `} strokeWidth={isActive ? 2.5 : 2} />
                    
                    {isOpen && (
                      <span className={`
                        text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors relative z-20
                        ${isActive ? 'text-primary' : ''}
                      `}>
                        {item.label}
                      </span>
                    )}

                    {/* Numeric Badges */}
                    {isOpen && item.href === "/admin/messages" && stats.unreadMessagesCount > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-primary/20 border border-black/10 relative z-20">
                        {stats.unreadMessagesCount}
                      </span>
                    )}
                    
                    {isOpen && item.href === "/admin" && stats.newCasesCount > 0 && (
                      <span className="ml-auto bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-emerald-500/20 relative z-20">
                        {stats.newCasesCount}
                      </span>
                    )}

                    {!isOpen && ((item.href === "/admin/messages" && stats.unreadMessagesCount > 0) || (item.href === "/admin" && stats.newCasesCount > 0)) && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-md ring-2 ring-background animate-pulse z-30" />
                    )}

                    {isActive && (
                       <motion.div 
                         layoutId="active-bar"
                         className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-30" 
                       />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar Apparence Bento */}
        <div className="p-4 bg-muted/40 border-t border-border pb-8 transition-colors">
          {isOpen ? (
            <div className={`flex items-center gap-4 p-4 rounded-md bg-card border border-border group hover:border-primary/20 transition-all duration-500 shadow-sm`}>
              <div className="w-11 h-11 bg-primary/10 text-primary border border-primary/20 rounded-md flex items-center justify-center text-sm font-black shadow-lg shadow-primary/5 group-hover:rotate-12 transition-transform">
                {session?.user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-tight text-foreground truncate transition-colors">{session?.user?.name || 'Administrateur'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-md bg-emerald-500 animate-pulse" />
                   <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 transition-colors">{t("active")}</p>
                </div>
              </div>
              <button 
                className="p-2.5 hover:bg-destructive/10 dark:hover:bg-destructive rounded-md transition-all group/logout shadow-sm active:scale-90"
                aria-label={t("logout")}
                onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              >
                <LogOut size={16} className="text-muted-foreground/30 group-hover/logout:text-destructive dark:group-hover/logout:text-destructive-foreground transition-colors" />
              </button>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-md flex items-center justify-center font-black shadow-xl">
                  {session?.user?.name?.[0] || 'A'}
                </div>
                <button 
                  className="w-12 h-12 flex items-center justify-center bg-muted hover:bg-destructive text-muted-foreground hover:text-destructive-foreground rounded-md transition-all group/logout active:scale-90 shadow-sm"
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