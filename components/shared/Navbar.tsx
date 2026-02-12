"use client";

import { Link } from "./../../navigation";
import { useLocale } from "next-intl";
import { 
  Globe, Menu, X, Search, Mail, Phone, 
  Facebook, Twitter, Linkedin, ExternalLink, Landmark 
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Détecter le défilement pour l'effet Sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      
      {/* --- 1. TOP BAR --- 
          Elle disparaît complètement quand on scrolle de plus de 40px
      */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#050a15] text-white overflow-hidden hidden md:block"
          >
            <div className="container mx-auto px-6 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-6">
                <a href="https://ulpgl.net" target="_blank" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Landmark size={12} className="text-blue-500" />
                  Université Libre des Pays des Grands Lacs
                  <ExternalLink size={10} className="opacity-50" />
                </a>
                <div className="flex items-center gap-2 opacity-70">
                  <Mail size={12} />
                  contact@credda-ulpgl.org
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                  <Facebook size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
                  <Twitter size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
                  <Linkedin size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
                </div>
                <Link href="/admin" className="bg-blue-600 px-3 py-1 hover:bg-blue-500 transition-colors">
                  Portail Chercheur
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 2. MAIN NAVBAR --- 
          Elle reste toujours collée (sticky/fixed)
      */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg h-16" : "bg-white h-20"
      } border-b border-slate-100`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex flex-col group">
            <span className={`font-serif font-black tracking-tighter text-slate-900 transition-all ${
              isScrolled ? "text-xl" : "text-2xl"
            }`}>
              CREDDA<span className="text-blue-600 group-hover:text-blue-500 transition-colors">.ULPGL</span>
            </span>
            {!isScrolled && (
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-500 animate-in fade-in duration-500">
                Centre de Recherche Scientifique
              </span>
            )}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
            <Link href="/research" className="hover:text-blue-600 transition-colors">Recherche</Link>
            <Link href="/clinical" className="hover:text-blue-600 transition-colors">Clinique</Link>
            <Link href="/publications" className="hover:text-blue-600 transition-colors">Publications</Link>
            <Link href="/team" className="hover:text-blue-600 transition-colors">Équipe</Link>
            
            <div className="h-6 w-[1px] bg-slate-200"></div>

            {/* SÉLECTEUR DE LANGUE */}
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <Globe size={14} className="text-blue-600" />
              {['fr', 'en', 'sw'].map((l) => (
                <Link 
                  key={l} 
                  href="/" 
                  locale={l}
                  className={`transition-all ${locale === l ? 'text-blue-600 font-black' : 'text-slate-400 hover:text-blue-400'}`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
            
            <button className={`p-2 transition-all rounded-full ${isScrolled ? "bg-blue-600 text-white" : "bg-slate-900 text-white"}`}>
              <Search size={18} />
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 p-8 flex flex-col gap-6 font-bold uppercase text-xs tracking-widest overflow-hidden"
            >
              <Link href="/research" onClick={() => setIsOpen(false)}>Recherche</Link>
              <Link href="/clinical" onClick={() => setIsOpen(false)}>Clinique</Link>
              <Link href="/publications" onClick={() => setIsOpen(false)}>Publications</Link>
              <Link href="/team" onClick={() => setIsOpen(false)}>Notre Équipe</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}