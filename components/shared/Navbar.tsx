// components/shared/Navbar.tsx
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
      setIsScrolled(window.scrollY > 20);
      
      // Scroll Spy Logic - Enhanced for better precision
      const sections = ["about", "research", "clinical", "publications", "team"];
      let currentSection = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si le haut de la section est dans le tiers supérieur de l'écran
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

  // Récupération sécurisée du ticker
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

  // Composants réutilisables pour éviter la duplication
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1 shadow-inner light:bg-muted/50">
      {["fr", "en", "sw"].map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`text-[9px] font-bold w-9 h-9 flex items-center justify-center transition-all rounded-full ${
            locale === l
              ? "scale-110 bg-[#C9A84C] text-[#0C0C0A] shadow-lg"
              : "text-foreground/65 hover:bg-background/80 hover:text-foreground light:text-foreground/70"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="overflow-y-scroll h-screen">
       {/* 1. TOP TICKER - Effet d'urgence et prestige */}
      <div className="fixed top-0 w-full z-[100] bg-[#0C0C0A] border-b border-white/5 py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item: any, i) => (
            <span
              key={i}
              className="mx-12 text-[10px] font-outfit font-medium uppercase tracking-[0.4em] text-[#F5F2EC]/60 flex items-center gap-4"
            >
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header
        className={`fixed top-8 left-0 right-0 z-[90] transition-all duration-700 ${
          isScrolled ? "h-16" : "h-22"
        }`}
      >
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            isScrolled
              ? "bg-background/85 backdrop-blur-2xl border-b border-border shadow-2xl"
              : "bg-transparent"
          }`}
        />

        <div className="container mx-auto px-6 relative flex items-center justify-between h-full">
          {/* LOGO */}
          <Link href="/" className="flex flex-col group py-2">
            <span className="font-bricolage font-black text-2xl md:text-3xl tracking-tighter text-foreground leading-none">
              CREDDA<span className="text-[#C9A84C] animate-pulse">·</span>CDE
            </span>
            <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-[#C9A84C]/60 mt-1 transition-colors group-hover:text-[#C9A84C]">
              Legal Excellence
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-4">
            <NavDropdown 
              label="Expertise" 
              links={expertiseLinks} 
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              pathname={pathname}
              activeSection={activeSection}
            />
            <div className="w-[1px] h-4 bg-border/40 mx-2" />
            <NavDropdown 
              label="L'Institution" 
              links={institutionLinks} 
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              pathname={pathname}
              activeSection={activeSection}
            />
          </nav>

          {/* ACTIONS & TOOLS */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-foreground/40 hover:text-[#C9A84C] transition-all hover:scale-110 active:scale-90"
              title="Recherche"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <LanguageSwitcher />

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-[#C9A84C]/50 transition-all text-foreground/60 bg-white/5 active:scale-95 transition-all"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="w-[1px] h-6 bg-border/50" />

            <Link
              href={loginHref}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors light:text-foreground/60 drop-shadow-sm"
            >
              {loginLabel}
            </Link>

            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[#C9A84C] text-[#0C0C0A] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl"
            >
              {t("contact")}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden p-3 text-foreground hover:text-[#C9A84C] transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* 3. MOBILE MENU OVERLAY - Style Awwwards */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden overscroll-contain bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          >
            {/* Header mobile - Shrink 0 (Fixed height) */}
            <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 overflow-x-hidden border-b border-border bg-card/40 p-5 backdrop-blur-md sm:p-8">
              <Link
                href="/"
                className="font-bricolage text-xl font-black tracking-tighter text-foreground sm:text-2xl md:text-3xl"
                onClick={() => setIsOpen(false)}
              >
                CREDDA<span className="text-[#C9A84C]">·</span>CDE
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-[#C9A84C] hover:text-black transition-all"
              >
                <X size={28} />
              </button>
            </div>

            {/* Liens du menu mobile - Flex 1 (Scroll area) */}
            <nav className="min-h-0 flex-1 space-y-10 overflow-x-hidden overflow-y-auto px-5 py-8  sm:space-y-12 sm:px-8 sm:py-10">
              <MobileGroup label="Expertise" links={expertiseLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />
              <MobileGroup label="Institution" links={institutionLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />
            </nav>

            {/* Footer mobile - Shrink 0 (Fixed bottom) */}
            <div className="shrink-0 overflow-x-hidden border-t border-border bg-card/95 p-5 sm:p-8">
              <button 
                onClick={() => setIsFooterExpanded(!isFooterExpanded)}
                className="w-full flex items-center justify-between mb-8 pb-3 border-b border-white/5 group"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/70 transition-colors group-hover:text-[#C9A84C]">
                  {isFooterExpanded ? "Moins d'options" : "Plus d'options"}
                </span>
                <motion.div
                  animate={{ rotate: isFooterExpanded ? 180 : 0 }}
                  className="text-muted-foreground/70 group-hover:text-[#C9A84C]"
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence mode="wait">
                {isFooterExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="space-y-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/80">Langue</span>
                        <LanguageSwitcher />
                      </div>
                      <div className="space-y-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/80">Thème</span>
                        <button 
                          onClick={toggleTheme} 
                          className="w-full h-11 flex items-center justify-between px-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-[#C9A84C] hover:text-black transition-all"
                        >
                          <span className="opacity-60">{theme === "dark" ? "Sombre" : "Clair"}</span>
                          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-10 pb-10 border-b border-white/5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/80">Accès Privé</span>
                      <Link
                        href={loginHref}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] border-b border-[#C9A84C]/40 pb-1"
                      >
                        {loginLabel}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/contact"
                className="group relative block w-full py-6 bg-[#C9A84C] text-[#0C0C0A] text-center font-bold uppercase tracking-[0.5em] text-[11px] shadow-2xl overflow-hidden active:scale-95 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {t("contact")}
                  <ArrowRight size={16} />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
      </div>
  );
}

// --- SOUS-COMPOSANTS ---

function NavDropdown({ label, links, activeDropdown, setActiveDropdown, pathname, activeSection }: any) {
  const isOpen = activeDropdown === label;
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setActiveDropdown(label)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 drop-shadow-sm ${
          isOpen ? "text-primary" : "text-foreground/50 hover:text-foreground light:text-foreground/70"
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? "rotate-180 text-primary" : "opacity-30"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="absolute top-full left-0 w-64 bg-background/95 backdrop-blur-3xl border border-border shadow-2xl p-2 z-[110]"
          >
            <div className="flex flex-col gap-1">
              {links.map((link: any) => {
                const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-between group/item ${
                      isActive ? "bg-[#C9A84C] text-[#0C0C0A]" : "hover:bg-white/5 text-foreground/70"
                    }`}
                  >
                    {link.label}
                    <ArrowRight size={12} className={`transition-transform duration-500 ${isActive ? "opacity-100" : "opacity-0 -translate-x-2 group-hover/item:opacity-50 group-hover/item:translate-x-0"}`} />
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C] whitespace-nowrap">{label}</span>
        <div className="h-[1px] w-full bg-[#C9A84C]/10" />
      </div>
      <div className="grid grid-cols-1 gap-3">
        {links.map((link: any, i: number) => {
          const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
          return (
            <motion.div
              key={link.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex min-h-[4.5rem] items-center justify-between rounded-lg border p-4 transition-all sm:p-5 ${
                  isActive 
                    ? "border-[#C9A84C]/40 bg-[#C9A84C]/12 text-[#C9A84C]" 
                    : "border-border bg-card/50 text-foreground hover:border-border/80 light:bg-muted/40"
                }`}
              >
                <div className="min-w-0 flex-1 pr-3">
                   <span className="mb-1 block text-[10px] uppercase tracking-widest text-[#C9A84C]/70">0{i+1}</span>
                   <span className="text-lg font-bold leading-snug text-foreground sm:text-xl font-fraunces">{link.label}</span>
                </div>
                <div className={`w-8 h-8 rounded-full border border-current flex items-center justify-center transition-all ${isActive ? "bg-[#C9A84C] text-black" : "opacity-20"}`}>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

}