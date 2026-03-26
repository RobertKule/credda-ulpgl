"use client";

import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowRight, Search, Sun, Moon, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";
import { useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Seuil un peu plus haut pour l'élégance
      
      const sections = ["about", "research", "clinical", "publications", "team"];
      let currentSection = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tickerItems = Object.values(t.raw("ticker") || {});
  const expertiseLinks = [
    { href: "/research", label: t("research"), id: "research" },
    { href: "/clinical", label: t("clinical"), id: "clinical" },
    { href: "/publications", label: t("publications"), id: "publications" },
    { href: "/programmes", label: t("programmes"), id: "programmes" },
  ];

  const institutionLinks = [
    { href: "/about", label: t("about"), id: "about" },
    { href: "/team", label: t("team"), id: "team" },
    { href: "/events", label: t("events"), id: "events" },
    { href: "/gallery", label: t("gallery"), id: "gallery" }
  ];

  const loginHref = session ? "/admin" : "/login";
  const loginLabel = session ? t("dashboard") : t("login");

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1 shadow-inner">
      {["fr", "en", "sw"].map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`text-[9px] font-bold w-8 h-8 flex items-center justify-center transition-all rounded-full ${
            locale === l ? "bg-[#C9A84C] text-[#0C0C0A] shadow-md" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      {/* 1. TOP TICKER */}
      <div className="fixed top-0 w-full z-[100] bg-[#0C0C0A] border-b border-white/5 py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item: any, i) => (
            <span key={i} className="mx-12 text-[10px] font-outfit font-medium uppercase tracking-[0.4em] text-[#F5F2EC]/60 flex items-center gap-4">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION - FLOATING & CENTERED ON SCROLL */}
      <header 
        className={`fixed left-0 right-0 z-[90] transition-all duration-500 ease-in-out px-4 lg:px-0 mt-4 ${
          isScrolled 
          ? "top-4 lg:top-6" 
          : "top-8 lg:top-10"
        }`}
      >
        <div
          className={`container mx-auto transition-all duration-500 ease-in-out relative flex items-center justify-between ${
            isScrolled 
            ? "max-w-6xl h-16 bg-background/80 backdrop-blur-xl border border-border/50 rounded-full px-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
            : "max-w-full h-20 bg-transparent px-6"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="flex flex-col group py-1">
            <span className="font-bricolage font-black text-xl lg:text-2xl tracking-tighter text-foreground leading-none">
              CREDDA<span className="text-[#C9A84C] animate-pulse">·</span>CDE
            </span>
            {!isScrolled && (
              <span className="text-[7px] uppercase tracking-[0.6em] font-bold text-[#C9A84C]/60 mt-0.5">Legal Excellence</span>
            )}
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavDropdown label="Expertise" links={expertiseLinks} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} pathname={pathname} activeSection={activeSection} isScrolled={isScrolled} />
            <div className="w-[1px] h-4 bg-border/40 mx-2" />
            <NavDropdown label="L'Institution" links={institutionLinks} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} pathname={pathname} activeSection={activeSection} isScrolled={isScrolled} />
          </nav>

          {/* ACTIONS & TOOLS */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-foreground/40 hover:text-[#C9A84C] transition-all hover:scale-110">
              <Search size={18} strokeWidth={1.5} />
            </button>
            
            <LanguageSwitcher />

            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background/50 text-foreground/60 hover:text-[#C9A84C] transition-all">
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <Link
              href={loginHref}
              className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                isScrolled ? "text-foreground/50 hover:text-primary" : "text-foreground/40 hover:text-primary"
              }`}
            >
              {loginLabel}
            </Link>

            <Link
              href="/contact"
              className={`px-6 py-2.5 bg-[#C9A84C] text-[#0C0C0A] text-[9px] font-black uppercase tracking-[0.2em] rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg`}
            >
              {t("contact")}
              <ArrowRight size={12} strokeWidth={3} />
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden p-2 text-foreground" onClick={() => setIsOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU OVERLAY - (Inchangé par rapport à la version précédente avec scrollable nav) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] flex h-[100dvh] flex-col bg-background text-foreground overflow-hidden"
          >
            {/* Header Mobile */}
            <div className="shrink-0 flex items-center justify-between border-b border-border bg-card/40 p-6 backdrop-blur-md">
              <span className="font-bricolage text-xl font-black tracking-tighter">CREDDA<span className="text-[#C9A84C]">·</span>CDE</span>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full"><X size={24} /></button>
            </div>

            {/* Scrollable Nav Area */}
            <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-12 overscroll-contain scrollbar-hide">
              <MobileGroup label="Expertise" links={expertiseLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />
              <MobileGroup label="L'Institution" links={institutionLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />
            </nav>

            {/* Footer Mobile Fixe */}
            <div className="shrink-0 border-t border-border bg-card/95 p-6 pb-[env(safe-area-inset-bottom,24px)] space-y-4">

              {/* THEME TOGGLE + LANGUAGE SWITCHER */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 flex-1 p-3 rounded-xl border border-border bg-background/60 text-foreground/70 hover:text-primary hover:border-primary/40 transition-all"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    {theme === "dark" ? "Mode Clair" : "Mode Sombre"}
                  </span>
                </button>
                <div className="flex items-center gap-1 rounded-xl border border-border bg-background/60 p-2">
                  {["fr", "en", "sw"].map((l) => (
                    <Link
                      key={l}
                      href={pathname}
                      locale={l}
                      onClick={() => setIsOpen(false)}
                      className={`text-[9px] font-black w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                        locale === l ? "bg-[#C9A84C] text-[#0C0C0A] shadow-md" : "text-foreground/50 hover:text-foreground"
                      }`}
                    >
                      {l.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href={loginHref} onClick={() => setIsOpen(false)} className="flex items-center justify-between w-full p-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 text-foreground">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A84C]/60">Accès Membre</span>
                    <span className="text-sm font-bold uppercase tracking-widest">{loginLabel}</span>
                 </div>
                 <ArrowRight size={18} className="text-[#C9A84C]" />
              </Link>

              <Link href="/contact" onClick={() => setIsOpen(false)} className="group relative block w-full py-5 bg-[#C9A84C] text-[#0C0C0A] text-center font-bold uppercase tracking-[0.4em] text-[10px] rounded-xl overflow-hidden active:scale-95 transition-all">
                <span className="relative z-10 flex items-center justify-center gap-3">{t("contact")} <ArrowRight size={16} /></span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
    </>
  );
}

// --- SOUS-COMPOSANTS ---

function NavDropdown({ label, links, activeDropdown, setActiveDropdown, pathname, activeSection, isScrolled }: any) {
  const isOpen = activeDropdown === label;
  return (
    <div className="relative group" onMouseEnter={() => setActiveDropdown(label)} onMouseLeave={() => setActiveDropdown(null)}>
      <button className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
        isOpen ? "text-[#C9A84C]" : "text-foreground/60 hover:text-foreground"
      }`}>
        {label} <ChevronDown size={12} className={`transition-transform duration-500 ${isOpen ? "rotate-180" : "opacity-30"}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 5, scale: 0.98 }} 
            className={`absolute top-full left-0 w-60 bg-background/95 backdrop-blur-2xl border border-border shadow-2xl p-2 z-[110] ${isScrolled ? "mt-2 rounded-2xl" : "rounded-sm"}`}
          >
            <div className="flex flex-col gap-1">
              {links.map((link: any) => {
                const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
                return (
                  <Link key={link.href} href={link.href} className={`px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-between ${isActive ? "bg-[#C9A84C] text-[#0C0C0A]" : "hover:bg-foreground/5 text-foreground/70"}`}>
                    {link.label} <ArrowRight size={12} className={isActive ? "opacity-100" : "opacity-0"} />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileGroup({ label, links, pathname, activeSection, setIsOpen }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C9A84C]">{label}</span>
        <div className="h-[1px] w-full bg-border/50" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {links.map((link: any, i: number) => {
          const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
          return (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center justify-between rounded-xl border p-4 transition-all ${isActive ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]" : "border-border bg-card/50"}`}>
              <span className="text-lg font-bold font-fraunces">{link.label}</span>
              <ArrowRight size={14} className={isActive ? "text-[#C9A84C]" : "opacity-20"} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}