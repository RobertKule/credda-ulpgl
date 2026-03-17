// components/shared/Navbar.tsx
"use client";

import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Globe, Menu, X, Search, Mail,
  Landmark, ExternalLink, ChevronDown,
  ArrowRight, ShieldCheck, Newspaper, Scale
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";

type LabelType = {
  fr: string;
  en: string;
  sw: string;
};

type NavLink = {
  href?: string;
  label: LabelType;
  dropdown?: { href: string; label: LabelType; icon: any }[];
};

export default function Navbar() {
  const locale = useLocale() as keyof LabelType;
  const pathname = usePathname();
  const t = useTranslations('Navbar');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: t('institution') },
    {
      label: t('expertise'),
      dropdown: [
        { href: "/research", label: t('research'), icon: Newspaper },
        { href: "/clinical", label: t('clinical'), icon: Scale },
        { href: "/publications", label: t('library'), icon: ShieldCheck },
      ]
    },
    { href: "/team", label: t('researchers') },
    { href: "/gallery", label: t('gallery') },
    { href: "/contact", label: t('contact') },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? "py-3" : "py-6"}`}>
        {/* GLASS BACKGROUND */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ${
            isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 opacity-100" : "opacity-0"
          }`} 
        />

        <div className="container mx-auto px-6 relative flex items-center justify-between">
          
          {/* LOGO AREA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-primary flex items-center justify-center text-white font-black text-xl">C</div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-heading font-black tracking-tighter transition-all duration-500 ${isScrolled ? "text-lg text-primary" : "text-2xl text-white"}`}>
                CREDDA<span className="text-accent">.</span>
              </span>
              <span className={`text-[9px] uppercase tracking-[0.3em] font-black text-slate-400 transition-all duration-500 block overflow-hidden ${isScrolled ? "opacity-0 h-0" : "opacity-100 h-auto mt-1"}`}>
                Research & Clinic
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, idx) => (
              <div 
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <>
                    <button className={`px-5 py-2 text-[10px] font-heading font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all group ${isScrolled ? "text-anthracite/80 hover:text-primary" : "text-white/90 hover:text-white"}`}>
                      {link.label}
                      <ChevronDown size={12} className={`transition-transform duration-500 ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full left-0 w-72 pt-4"
                        >
                          <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 overflow-hidden">
                            {link.dropdown.map((item, i) => (
                              <Link 
                                key={i}
                                href={item.href}
                                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-all group/item"
                              >
                                <div className="p-2 bg-slate-50 group-hover/item:bg-white group-hover/item:shadow-sm transition-all border border-transparent group-hover/item:border-slate-100">
                                  <item.icon size={18} className="text-primary/60 group-hover/item:text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-black uppercase tracking-wider text-anthracite">{item.label}</span>
                                  <span className="text-[9px] text-slate-400 font-medium">{t('consult')}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link 
                    href={link.href!}
                    className={`px-5 py-2 text-[10px] font-heading font-black uppercase tracking-[0.2em] transition-all relative group ${isScrolled ? "text-anthracite/80 hover:text-primary" : "text-white/90 hover:text-white"}`}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                )}
              </div>
            ))}

            {/* ACTION AREA */}
            <div className="ml-6 flex items-center gap-4 border-l border-slate-100 pl-8">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors ${isScrolled ? "text-anthracite/60 hover:text-primary" : "text-white/60 hover:text-white"}`}
                title={t('search')}
              >
                <Search size={18} />
              </button>

              {/* LOCALE SWITCHER */}
              <div className="flex gap-1.5">
                {['fr', 'en', 'sw'].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`text-[9px] font-black w-7 h-7 flex items-center justify-center transition-all ${
                      locale === l ? "bg-primary text-white" : "text-slate-400 hover:text-primary"
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <Link 
                href="/admin" 
                className={`ml-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg ${
                  isScrolled ? "bg-institutional-blue text-white hover:bg-black shadow-primary/10" : "bg-white text-primary hover:bg-accent hover:text-primary shadow-white/10"
                }`}
              >
                {t('portal')}
              </Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="lg:hidden p-2 text-primary border border-slate-100"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU FULLSCREEN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
               <span className="font-heading font-black tracking-tighter text-2xl">
                 CREDDA<span className="text-accent">.</span>
               </span>
               <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-full">
                 <X size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 flex flex-col justify-center">
              <nav className="space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {link.dropdown ? (
                      <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{link.label}</span>
                        <div className="flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                          {link.dropdown.map((item, j) => (
                            <Link 
                              key={j} 
                              href={item.href} 
                              onClick={() => setIsOpen(false)}
                              className="text-4xl font-serif font-black hover:text-primary transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link 
                        href={link.href!} 
                        onClick={() => setIsOpen(false)}
                        className="text-6xl font-serif font-black hover:text-accent transition-all leading-[0.9]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>
            </div>
            
            {/* MOBILE FOOTER */}
            <div className="p-12 border-t border-slate-100 bg-slate-50 flex flex-col gap-6">
               <div className="flex gap-4">
                 {['fr', 'en', 'sw'].map((l) => (
                    <Link key={l} href={pathname} locale={l} onClick={() => setIsOpen(false)} className={`text-xs font-black p-2 border ${locale === l ? 'bg-primary text-white border-primary' : 'border-slate-200'}`}>
                      {l.toUpperCase()}
                    </Link>
                 ))}
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 Centre de Recherche sur la Démocratie <br/> et le Développement en Afrique
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
      />
    </>
  );
}