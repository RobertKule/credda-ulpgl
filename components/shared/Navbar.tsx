// components/shared/Navbar.tsx
"use client";

import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Menu, X, ArrowRight, Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tickerItems = Object.values(t.raw('ticker') || {});

  const navLinks = [
    { href: "/about", label: t('about') },
    { href: "/research", label: t('research') },
    { href: "/programmes", label: "Programmes" },
    { href: "/publications", label: t('publications') },
    { href: "/events", label: "Événements" },
  ];

  return (
    <>
      {/* NEWS TICKER */}
      <div className="fixed top-0 w-full z-[100] bg-[#111110] border-b border-white/5 py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item: any, i) => (
            <span key={i} className="mx-12 text-[10px] font-outfit font-medium uppercase tracking-[0.2em] text-[#F5F2EC]/60 flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header 
        className={`fixed top-8 w-full z-[99] transition-all duration-700 ${
          isScrolled ? "py-2" : "py-6"
        }`}
      >
        {/* BACKGROUND */}
        <div 
          className={`absolute inset-0 transition-all duration-700 ${
            isScrolled 
              ? "bg-[#0C0C0A]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
              : "bg-transparent"
          }`} 
        />

        <div className="container mx-auto px-6 relative flex items-center justify-between">
          
          {/* LOGO AREA */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative flex flex-col items-start translate-y-1">
              <span className="font-bricolage font-extrabold text-2xl lg:text-3xl tracking-tighter text-[#F5F2EC] leading-none">
                CREDDA<span className="text-[#C9A84C]">·</span>CDE
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] font-outfit font-medium text-[#F5F2EC]/40 mt-1 pl-0.5">
                Research & Legal Clinic
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx}
                href={link.href}
                className={`relative px-4 py-2 text-[10px] font-outfit font-medium uppercase tracking-[0.2em] transition-all group ${
                  pathname === link.href ? "text-[#C9A84C]" : "text-[#F5F2EC]/70 hover:text-[#F5F2EC]"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-4 right-4 h-[1px] bg-[#C9A84C] transition-transform duration-500 origin-left ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}

            {/* ACTION AREA */}
            <div className="ml-6 flex items-center gap-6 border-l border-white/10 pl-8">
              {/* SEARCH BUTTON */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#F5F2EC]/40 hover:text-[#C9A84C] transition-colors"
                title="Rechercher"
              >
                <Search size={18} />
              </button>

              {/* LOCALE SWITCHER */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-sm border border-white/5">
                {['fr', 'en', 'sw'].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`text-[9px] font-outfit font-bold w-7 h-7 flex items-center justify-center transition-all ${
                      locale === l 
                        ? "bg-[#C9A84C] text-[#0C0C0A]" 
                        : "text-[#F5F2EC]/40 hover:text-[#F5F2EC]/70"
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              {/* AUTH BUTTON */}
              <Link
                href={session ? "/admin" : "/login"}
                className="px-4 py-2.5 border border-[#C9A84C] text-[#C9A84C] text-[9px] font-outfit font-semibold uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0C0C0A] transition-all rounded-sm"
              >
                {session ? 'Dashboard' : t('login') || 'Se connecter'}
              </Link>

              {/* CONTACT BUTTON */}
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-[#C9A84C] text-[#0C0C0A] text-[10px] font-outfit font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-all flex items-center gap-2 ring-1 ring-[#C9A84C]/20"
              >
                {t('contact')}
                <ArrowRight size={12} />
              </Link>
            </div>
          </nav>

          {/* MOBILE TOGGLE AREA */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#F5F2EC]/60 hover:text-[#C9A84C] transition-colors"
            >
              <Search size={22} />
            </button>
            <button 
              className="p-2 text-[#F5F2EC]/80 hover:text-[#C9A84C] transition-colors"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0C0C0A] flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-white/5">
               <span className="font-bricolage font-extrabold tracking-tighter text-2xl text-[#F5F2EC]">
                 CREDDA<span className="text-[#C9A84C]">·</span>CDE
               </span>
               <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 bg-white/5 text-[#F5F2EC] rounded-full hover:bg-[#C9A84C] hover:text-[#0C0C0A] transition-all"
              >
                 <X size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 flex flex-col justify-center">
              <nav className="space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-5xl font-fraunces font-extrabold text-[#F5F2EC] hover:text-[#C9A84C] transition-all leading-tight block"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
            
            <div className="p-12 border-t border-white/5 bg-[#111110] flex flex-col gap-6">
               <div className="flex gap-2">
                 {['fr', 'en', 'sw'].map((l) => (
                    <Link 
                      key={l} 
                      href={pathname} 
                      locale={l} 
                      onClick={() => setIsOpen(false)} 
                      className={`flex-1 text-center py-3 text-xs font-outfit font-bold border ${
                        locale === l 
                          ? 'bg-[#C9A84C] text-[#0C0C0A] border-[#C9A84C]' 
                          : 'text-[#F5F2EC]/40 border-white/5'
                      }`}
                    >
                      {l.toUpperCase()}
                    </Link>
                 ))}
               </div>
               
               <Link
                  href={session ? "/admin" : "/login"}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 border border-[#C9A84C] text-[#C9A84C] text-center text-[10px] font-outfit font-bold uppercase tracking-[0.2em]"
                >
                  {session ? "Tableau de Bord" : "Accès Admin"}
               </Link>

               <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-5 bg-[#C9A84C] text-[#0C0C0A] text-center text-xs font-outfit font-bold uppercase tracking-[0.2em]"
                >
                  {t('contact')}
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
      />
    </>
  );
}