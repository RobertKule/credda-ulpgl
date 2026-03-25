// components/admin/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { usePathname } from "next/navigation";
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
          fixed lg:sticky top-0 left-0 z-50 mt-32
          h-screen bg-[#000000] border-r border-white/5
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-black font-bold text-lg">C</span>
                </div>
                <div>
                  <p className="font-serif font-bold text-white leading-tight">CREDDA</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-[#C9A84C]">Admin Portal</p>
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
            <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-black font-bold text-lg">C</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              const Icon = iconMap[item.icon];

              if (!Icon) return null;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center mx-3 px-4 py-3 rounded-md
                      transition-all duration-300 group
                      ${isActive 
                        ? 'bg-white/5 border-l-2 border-[#C9A84C] text-white shadow-sm' 
                        : 'text-white/70 hover:bg-white/5 hover:backdrop-blur-md hover:text-white border-l-2 border-transparent'
                      }
                    `}
                  >
                    <Icon size={20} className={`
                      shrink-0 transition-transform
                      ${isActive ? 'text-[#C9A84C]' : 'text-white/50 group-hover:text-white'}
                      ${isOpen ? 'mr-4' : 'mx-auto'}
                    `} />
                    
                    {isOpen && (
                      <span className={`
                        text-sm font-medium whitespace-nowrap
                        ${isActive ? 'text-white' : 'text-white/70'}
                      `}>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className="border-t border-white/5 p-4">
          <div className={`
            flex items-center gap-3 px-3 py-3 rounded-xl bg-transparent hover:bg-white/5 transition-colors
            ${!isOpen && 'justify-center'}
          `}>
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <UserCircle size={18} className="text-white/70" />
            </div>
            
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Admin</p>
                  <p className="text-[8px] font-black uppercase tracking-wider text-[#C9A84C]">Super Admin</p>
                </div>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:block"
                  aria-label="Déconnexion"
                  onClick={() => {
                    document.cookie = "token=; path=/; max-age=0";
                    window.location.href = `/${locale}/login`;
                  }}
                >
                  <LogOut size={16} className="text-white/50 hover:text-red-400 transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Bouton de bascule pour desktop */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center w-full mt-4 p-2 bg-white/5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label={isOpen ? "Réduire" : "Développer"}
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
}