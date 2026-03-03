// components/shared/Navbar.tsx
"use client";

import { Link, usePathname } from "./../../navigation";
import { useLocale } from "next-intl";
import {
  Globe, Menu, X, Search, Mail,
  Facebook, Twitter, Linkedin, ExternalLink, Landmark,
  ChevronRight, Camera, ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SearchModal from "./SearchModal";

// Définir les types pour les labels
type LabelType = {
  fr: string;
  en: string;
  sw: string;
};

type NavLink = {
  href?: string;
  label: LabelType;
  dropdown?: { href: string; label: LabelType }[];
};

export default function Navbar() {
  const locale = useLocale() as keyof LabelType; // ✅ Typer locale
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Détection du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdown && !(e.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  const navLinks: NavLink[] = [
    { href: "/about", label: { fr: "À Propos", en: "About", sw: "Kuhusu" } },
    {
      label: {
        fr: "Recherche & Clinique",
        en: "Research & Clinical",
        sw: "Utafiti na Kliniki"
      },
      dropdown: [
        { href: "/research", label: { fr: "Recherche", en: "Research", sw: "Utafiti" } },
        { href: "/clinical", label: { fr: "Clinique Juridique", en: "Legal Clinic", sw: "Kliniki ya Sheria" } },
        { href: "/publications", label: { fr: "Publications", en: "Publications", sw: "Machapisho" } },
      ]
    },
    { href: "/team", label: { fr: "Équipe", en: "Team", sw: "Timu" } },
    { href: "/gallery", label: { fr: "Galerie", en: "Gallery", sw: "Nyumba ya sanaa" } },
    { href: "/contact", label: { fr: "Contact", en: "Contact", sw: "Wasiliana" } },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-[100] transition-all duration-300">
        {/* TOP BAR */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#050a15] text-white overflow-hidden hidden lg:block"
            >
              <div className="container mx-auto px-6 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-6">
                  <a href="https://ulpgl.net" target="_blank" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <Landmark size={12} className="text-blue-500" />
                    Université Libre des Pays des Grands Lacs
                    <ExternalLink size={10} className="opacity-50" />
                  </a>
                  <span className="opacity-20">|</span>
                  <div className="flex items-center gap-2 opacity-70">
                    <Mail size={12} />
                    contact@credda-ulpgl.org
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 border-r border-white/10 pr-6 text-slate-400">
                    <a href="#" className="hover:text-white transition-colors"><Facebook size={14} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Twitter size={14} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin size={14} /></a>
                  </div>
                  <Link href="/admin" className="bg-blue-600 px-4 py-1 hover:bg-blue-500 transition-colors">
                    Portail Chercheur
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN NAVBAR */}
        <nav className={`w-full transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-xl h-16" : "bg-white h-24"
          } border-b border-slate-100`}>
          <div className="container mx-auto px-6 h-full flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex flex-col group relative z-[110]">
              <span className={`font-serif font-black tracking-tighter text-slate-900 transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl lg:text-3xl"
                }`}>
                CREDDA<span className="text-blue-600 group-hover:text-blue-500 transition-colors">.ULPGL</span>
              </span>
              {!isScrolled && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[8px] uppercase tracking-[0.3em] font-black text-slate-400"
                >
                  Research & Legal Clinic
                </motion.span>
              )}
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => {
                  const linkKey = link.href || `dropdown-${index}`;
                  const linkLabel = link.label[locale];
                  
                  return link.dropdown ? (
                    <div key={linkKey} className="relative dropdown-container">
                      <button
                        onClick={() => toggleDropdown(linkLabel)}
                        className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all relative group flex items-center gap-1"
                      >
                        {linkLabel}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === linkLabel ? 'rotate-180' : ''}`} />
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </button>

                      <AnimatePresence>
                        {openDropdown === linkLabel && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-slate-100 z-50"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-3 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-100 last:border-0"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.label[locale]}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={linkKey}
                      href={link.href!}
                      className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all relative group"
                    >
                      {linkLabel}
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  );
                })}
              </div>

              <div className="h-6 w-[1px] bg-slate-100 mx-2"></div>

              {/* LANGUE */}
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-100">
                <Globe size={14} className="text-blue-600" />
                {['fr', 'en', 'sw'].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`text-[10px] font-bold transition-all ${locale === l ? 'text-blue-600' : 'text-slate-300 hover:text-slate-600'}`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 transition-all rounded-none ${isScrolled ? "bg-blue-600 text-white" : "bg-slate-950 text-white shadow-lg"}`}
              >
                <Search size={18} />
              </button>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="lg:hidden flex items-center gap-2 relative z-[110]">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                aria-label="Recherche"
              >
                <Search size={24} />
              </button>

              <button
                className="p-2 text-slate-900 bg-slate-50 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU OVERLAY */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-[#050a15] text-white z-[100] flex flex-col p-10 pt-32 overflow-y-auto"
              >
                <div className="space-y-6">
                  {navLinks.map((link, idx) => {
                    const linkKey = link.href || `mobile-dropdown-${idx}`;
                    const linkLabel = link.label[locale];
                    
                    return (
                      <motion.div
                        key={linkKey}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                      >
                        {link.dropdown ? (
                          <div className="space-y-3">
                            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">
                              {linkLabel}
                            </p>
                            <div className="pl-4 space-y-3 border-l-2 border-blue-900">
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className="block text-2xl font-serif hover:text-blue-400 transition-colors"
                                >
                                  {item.label[locale]}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={link.href!}
                            onClick={() => setIsOpen(false)}
                            className="text-3xl font-serif font-bold hover:text-blue-400 flex items-center justify-between group"
                          >
                            {linkLabel}
                            <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-10 border-t border-white/10 space-y-6">
                  <div className="flex gap-6">
                    {['fr', 'en', 'sw'].map((l) => (
                      <Link
                        key={l}
                        href={pathname}
                        locale={l}
                        onClick={() => setIsOpen(false)}
                        className={`text-sm font-bold ${locale === l ? 'text-blue-400' : 'text-slate-500'}`}
                      >
                        {l.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                    CREDDA-ULPGL Official Hub
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
      />
    </>
  );
}