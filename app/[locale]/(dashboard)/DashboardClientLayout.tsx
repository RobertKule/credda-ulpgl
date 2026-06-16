"use client";

import React, { useState } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Scale, 
  Megaphone, 
  Users, 
  UserCircle, 
  Menu, 
  X, 
  ShieldCheck,
  LogOut,
  Image as ImageIcon,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  Mail
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "@/components/shared/ThemeProvider";
import { signOut } from "next-auth/react";
import { m as motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { name: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard, roles: ["RESEARCHER", "ADMIN", "EDITOR", "SUPERADMIN"] },
  { name: "Publications", href: "/admin/publications", icon: FileText, roles: ["RESEARCHER", "ADMIN", "EDITOR", "SUPERADMIN"] },
  { name: "Clinique Juridique", href: "/admin/clinique", icon: Scale, roles: ["ADMIN", "EDITOR", "SUPERADMIN"] },
  { name: "Annonces", href: "/admin/announcements", icon: Megaphone, roles: ["ADMIN", "EDITOR", "SUPERADMIN"] },
  { name: "Galerie", href: "/admin/gallery", icon: ImageIcon, roles: ["ADMIN", "EDITOR", "SUPERADMIN"] },
  { name: "Messages", href: "/admin/messages", icon: Mail, roles: ["ADMIN", "SUPERADMIN"] },
  { name: "Gestion des Accès", href: "/admin/users", icon: Users, roles: ["SUPERADMIN"] },
  { name: "Mon Profil", href: "/admin/profile", icon: UserCircle, roles: ["RESEARCHER", "ADMIN", "EDITOR", "SUPERADMIN"] },
];

export default function DashboardClientLayout({
  children,
  locale,
  session
}: {
  children: React.ReactNode;
  locale: string;
  session: Session | null;
}) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const userRole = session?.user?.role || "USER";

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="bg-green-800 p-1.5 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span>CREDDA</span>
            </div>
          ) : (
            <div className="bg-green-800 p-1.5 rounded-lg mx-auto">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto overflow-x-hidden scrollbar-none">
          {filteredNavItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={`/${locale}${item.href}`}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                  isActive 
                    ? "bg-green-50 dark:bg-green-700/10 text-green-800 dark:text-green-500 font-semibold" 
                    : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-green-800" : "group-hover:text-slate-900 dark:group-hover:text-zinc-100")} />
                {isSidebarOpen && <span className="text-sm truncate">{item.name}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 p-2 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
          <button className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 dark:text-zinc-400 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 font-bold text-green-800">
            <ShieldCheck className="w-6 h-6" />
            <span>CREDDA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            
            {/* Quick Locale Toggle */}
            <div className="flex bg-slate-100 dark:bg-green-950/40 p-1 rounded-full border border-slate-200 dark:border-green-900/40">
              {["fr", "en", "sw"].map((l) => (
                <Link
                  key={l}
                  href={pathname.replace(`/${locale}`, `/${l}`)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                    locale === l 
                      ? "bg-white dark:bg-green-800/60 text-green-800 dark:text-green-300 shadow-sm" 
                      : "text-slate-400 hover:text-green-700 dark:text-zinc-500 dark:hover:text-green-400"
                  )}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-green-950/50 text-slate-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/40 hover:text-green-800 dark:hover:text-green-300 transition-colors border border-slate-200 dark:border-green-900/40"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-zinc-800 mx-2" />

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-3 pr-2 group cursor-pointer relative">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{session?.user?.name || "Chercheur"}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none">{userRole}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-green-400 dark:from-green-800 dark:to-green-500 border-2 border-white dark:border-green-900 shadow-sm flex items-center justify-center text-white font-bold overflow-hidden">
                 {session?.user?.image ? (
                   <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   session?.user?.name?.[0] || "C"
                 )}
              </div>
              
              {/* Simple Tooltip-like dropdown on hover for now */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 p-2 transform translate-y-2 group-hover:translate-y-0">
                 <Link href={`/${locale}/admin/profile`} className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-semibold">
                    <UserCircle className="w-4 h-4" /> Profil
                 </Link>
                 <button 
                  onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                  className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 text-xs font-semibold"
                 >
                    <LogOut className="w-4 h-4" /> Déconnexion
                 </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-slate-50/50 dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white dark:bg-zinc-900 animate-in slide-in-from-top duration-300">
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-green-800">
              <ShieldCheck className="w-6 h-6" />
              <span>CREDDA</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={`/${locale}${item.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 text-lg font-medium"
              >
                <item.icon className="w-6 h-6 text-green-800" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-8 border-t border-slate-200 dark:border-zinc-800">
            <button className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 font-bold flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
