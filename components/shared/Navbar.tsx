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
          className={`text-[9px] font-bold w-9 h-9 flex items-center justify-center transition-all rounded-full ${locale === l
              ? "scale-110 bg-[#C9A84C] text-[#0C0C0A] shadow-lg"
              : "text-foreground/65 hover:bg-background/80 hover:text-foreground"
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

      {/* 2. MAIN NAVIGATION */}
      <header className={`fixed top-8 left-0 right-0 z-[90] transition-all duration-700 ${isScrolled ? "h-16" : "h-22"}`}>
        <div className={`absolute inset-0 transition-all duration-700 ${isScrolled ? "bg-background/85 backdrop-blur-2xl border-b border-border shadow-2xl" : "bg-transparent"}`} />

        <div className="container mx-auto px-6 relative flex items-center justify-between h-full">
          <Link href="/" className="flex flex-col group py-2">
            <span className="font-bricolage font-black text-2xl md:text-3xl tracking-tighter text-foreground leading-none">
              CREDDA<span className="text-[#C9A84C] animate-pulse">·</span>CDE
            </span>
            <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-[#C9A84C]/60 mt-1">Legal Excellence</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4">
            <NavDropdown label="Expertise" links={expertiseLinks} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} pathname={pathname} activeSection={activeSection} />
            <div className="w-[1px] h-4 bg-border/40 mx-2" />
            <NavDropdown label="L'Institution" links={institutionLinks} activeDropdown={activeDropdown} setActiveDropdown={setActiveDropdown} pathname={pathname} activeSection={activeSection} />
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-foreground/40 hover:text-[#C9A84C] transition-all"><Search size={20} /></button>
            <LanguageSwitcher />
            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center border border-border rounded-full text-foreground/60 bg-white/5">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
            <Link href="/contact" className="px-8 py-3.5 bg-[#C9A84C] text-[#0C0C0A] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-2 shadow-xl">
              {t("contact")} <ArrowRight size={14} />
            </Link>
          </div>

          <button className="lg:hidden p-3 text-foreground" onClick={() => setIsOpen(true)}><Menu size={32} /></button>
        </div>
      </header>

      {/* 3. MOBILE MENU OVERLAY - FULLY RESPONSIVE */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            // h-[100dvh] occupe toute la hauteur mobile sans scroll du body
            className="fixed inset-0 z-[200] flex h-[100dvh] flex-col bg-background text-foreground overflow-hidden"
          >
            {/* 1. Header Fixe (Ne bouge pas) - Shrink 0 */}
            <div className="shrink-0 flex items-center justify-between border-b border-border bg-card/40 p-6 backdrop-blur-md">
              <span className="font-bricolage text-xl font-black tracking-tighter">
                CREDDA<span className="text-[#C9A84C]">·</span>CDE
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {/* 2. Zone de Navigation SCROLLABLE - Flex 1 */}
            <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-12 overscroll-contain">
              <MobileGroup label="Expertise" links={expertiseLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />

              <MobileGroup label="L'Institution" links={institutionLinks} pathname={pathname} activeSection={activeSection} setIsOpen={setIsOpen} />

              {/* --- LE BOUTON DE CONNEXION (REMIS ICI) --- */}
              <div className="pt-4 border-t border-white/5">
                <Link
                  href={loginHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-[#C9A84C]"
                >
                  <span>{loginLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </nav>

            {/* 3. Footer Fixe (Ne bouge pas) - Shrink 0 */}
            <div className="shrink-0 border-t border-border bg-card/95 p-6 pb-[env(safe-area-inset-bottom,24px)]">
              <button
                onClick={() => setIsFooterExpanded(!isFooterExpanded)}
                className="w-full flex items-center justify-between mb-6 pb-2 border-b border-white/5"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/70">
                  {isFooterExpanded ? "Moins d'options" : "Plus d'options"}
                </span>
                <motion.div animate={{ rotate: isFooterExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isFooterExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50">Langue</span>
                        <LanguageSwitcher />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50">Thème</span>
                        <button onClick={toggleTheme} className="w-full h-10 flex items-center justify-between px-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold">
                          <span className="opacity-60">{theme === "dark" ? "Sombre" : "Clair"}</span>
                          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="group relative block w-full py-5 bg-[#C9A84C] text-[#0C0C0A] text-center font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl overflow-hidden active:scale-95 transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t("contact")} <ArrowRight size={16} />
                </span>
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

function NavDropdown({ label, links, activeDropdown, setActiveDropdown, pathname, activeSection }: any) {
  const isOpen = activeDropdown === label;
  return (
    <div className="relative group" onMouseEnter={() => setActiveDropdown(label)} onMouseLeave={() => setActiveDropdown(null)}>
      <button className={`flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isOpen ? "text-primary" : "text-foreground/50 hover:text-foreground"}`}>
        {label} <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? "rotate-180 text-primary" : "opacity-30"}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 w-64 bg-background/95 backdrop-blur-3xl border border-border shadow-2xl p-2 z-[110]">
            <div className="flex flex-col gap-1">
              {links.map((link: any) => {
                const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
                return (
                  <Link key={link.href} href={link.href} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-between ${isActive ? "bg-[#C9A84C] text-[#0C0C0A]" : "hover:bg-white/5 text-foreground/70"}`}>
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
        <div className="h-[1px] w-full bg-[#C9A84C]/10" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {links.map((link: any, i: number) => {
          const isActive = pathname === link.href || (pathname === "/" && activeSection === link.id);
          return (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`flex items-center justify-between rounded-lg border p-4 transition-all ${isActive ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]" : "border-border bg-card/50"}`}>
              <span className="text-lg font-bold font-fraunces">{link.label}</span>
              <ArrowRight size={14} className={isActive ? "text-[#C9A84C]" : "opacity-20"} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}