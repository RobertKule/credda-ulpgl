// components/admin/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  UserCircle, 
  Mail, 
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Scale,
  Calendar,
  Layout
} from "lucide-react";

// ✅ Map des icônes
const iconMap: Record<string, any> = {
  LayoutDashboard,
  FileText,
  BookOpen,
  UserCircle,
  Mail,
  Users,
  Scale,
  Calendar,
  Layout
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

  // ✅ Écouter l'événement du bouton menu
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggle-sidebar', handleToggleSidebar);
  }, []);

  // ✅ Détecter la taille d'écran
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

  // ✅ Fermer la sidebar après navigation sur mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // ✅ Fermeture au clic en dehors (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById('admin-sidebar');
        const menuButton = document.getElementById('menu-button');
        if (sidebar && !sidebar.contains(e.target as Node) && 
            menuButton && !menuButton.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  const fullMenuItems = [
    ...menuItems,
    { href: "/admin/profile", label: "Mon Profil", icon: "UserCircle" },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen bg-[#06080a] border-r border-white/5
          transition-all duration-300 ease-in-out
          flex flex-col text-white
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-0 lg:w-20'}
          overflow-hidden
        `}
      >
        {/* Header Sidebar */}
        <div className={`
          h-20 border-b border-white/5 flex items-center
          ${isOpen ? 'px-6 justify-between' : 'px-0 justify-center'}
        `}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-3 group/logo cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <span className="text-white font-black text-lg">C</span>
                </div>
                <div>
                  <p className="font-serif font-bold text-white leading-tight">CREDDA</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-blue-500">Admin Portal v2</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X size={20} className="text-white/50" />
              </button>
            </>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform cursor-pointer">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5 px-3">
            {fullMenuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              const Icon = iconMap[item.icon];

              if (!Icon) return null;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3.5 rounded-xl
                      transition-all duration-300 group relative
                      ${isActive 
                        ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <Icon size={18} className={`
                      shrink-0 transition-all duration-300
                      ${isActive ? 'text-blue-500 scale-110' : 'text-white/30 group-hover:text-blue-400'}
                      ${isOpen ? 'mr-4' : 'mx-auto'}
                    `} />
                    
                    {isOpen && (
                      <span className={`
                        text-xs font-bold uppercase tracking-widest whitespace-nowrap
                        ${isActive ? 'text-blue-400' : ''}
                      `}>
                        {item.label}
                      </span>
                    )}

                    {isActive && (
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className="border-t border-white/5 p-4 bg-[#0a0c0e]/50 backdrop-blur-md">
          <div className={`
            flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group
            ${!isOpen && 'justify-center'}
          `}>
            <div className="w-9 h-9 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <UserCircle size={20} />
            </div>
            
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-tight text-white truncate">{session?.user?.name || 'Admin'}</p>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500">En ligne</p>
                  </div>
                </div>
                <button 
                  className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all group/logout"
                  aria-label="Déconnexion"
                  onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                >
                  <LogOut size={16} className="text-white/30 group-hover/logout:text-red-500 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Bouton de bascule pour desktop */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center w-full mt-4 p-2 bg-white/5 rounded-xl hover:bg-white/10 text-white/30 hover:text-white transition-all border border-transparent hover:border-white/5"
            aria-label={isOpen ? "Réduire" : "Développer"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}