"use client";

import Image from "next/image";
import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowUpRight, Sun, Moon, ChevronDown, ArrowRight, LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "./ThemeProvider";
import AnnouncementBell from "./AnnouncementBell";

interface Announcement {
  id: string;
  content: string;
  title?: string | null;
  level: "INFO" | "WARNING" | "URGENT";
}

export default function Navbar({ announcements = [] }: { announcements?: Announcement[] }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Primary Links
  const primaryLinks = [
    { href: "/", label: t("home", { fallback: "Accueil" }) },
    { href: "/about", label: t("about", { fallback: "L'Institution" }) },
    { href: "/publications", label: t("publications", { fallback: "Publications" }) },
  ];

  // Secondary Links (Dropdown)
  const secondaryLinks = [
    { href: "/media-center", label: t("mediaCenter", { fallback: "Media Center" }) },
    { href: "/announcements", label: t("announcements", { fallback: "Annonces" }) },
    { href: "/team", label: t("team", { fallback: "Équipe" }) },
    { href: "/contact", label: t("contact", { fallback: "Contact" }) },
  ];

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "sw", label: "Kiswahili", flag: "🇹🇿" },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled
            ? "top-4 lg:top-6 px-4 md:px-10 pointer-events-none"
            : "top-0 px-0 pointer-events-auto bg-background/95 backdrop-blur-xl border-b border-border/40"
        }`}
      >
        <div 
          className={`container mx-auto flex items-center justify-between transition-all duration-700 pointer-events-auto ${
            isScrolled
              ? "max-w-5xl bg-background/80 backdrop-blur-2xl rounded-full px-6 py-2 border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              : "max-w-full bg-transparent py-5 lg:py-8 px-6 lg:px-12"
          }`}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-500 ${isScrolled ? "w-7 h-7" : "w-8 h-8 lg:w-10 lg:h-10"}`}>
              <Image
                src="/logocredda.png"
                alt="CREDDA Logo"
                fill
                className="object-contain group-hover:rotate-6 transition-transform"
                priority
              />
            </div>
            <span className={`font-serif font-black tracking-tighter text-foreground transition-all duration-500 ${isScrolled ? "text-lg" : "text-xl lg:text-3xl"}`}>
              CREDDA
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-bold transition-all duration-300 relative group px-2 py-1 ${
                    pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}

            {/* "Plus" Dropdown */}
            <div 
                className="relative"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
            >
                <button className="flex items-center gap-1.5 text-[13px] font-bold text-foreground/70 hover:text-foreground transition-all py-1">
                    Plus <ChevronDown size={14} className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isMoreOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-52"
                        >
                            <div className="bg-popover/90 dark:bg-card/95 backdrop-blur-3xl rounded-2xl border border-border/50 shadow-2xl p-2 flex flex-col gap-1">
                                {secondaryLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="px-4 py-2.5 rounded-xl text-[12px] font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all text-center"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </nav>

          {/* ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Lang Dropdown */}
            <div 
                className="relative"
                onMouseEnter={() => setIsLangOpen(true)}
                onMouseLeave={() => setIsLangOpen(false)}
            >
                <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/20 transition-all duration-500 font-black text-[10px] uppercase ${isScrolled ? "bg-muted/40" : "bg-white/5"}`}>
                    <span className="text-base leading-none">{currentLang.flag}</span>
                    <span className="text-foreground/80">{currentLang.code}</span>
                    <ChevronDown size={12} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isLangOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 pt-4 w-40"
                        >
                            <div className="bg-popover/90 dark:bg-card/95 backdrop-blur-3xl rounded-2xl border border-border/50 shadow-2xl p-2 flex flex-col gap-1">
                                {languages.map((l) => (
                                    <Link
                                        key={l.code}
                                        href={pathname}
                                        locale={l.code}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                                            locale === l.code 
                                            ? "bg-primary text-white" 
                                            : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                                        }`}
                                    >
                                        <span className="text-lg leading-none">{l.flag}</span>
                                        <span>{l.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-[1px] h-4 bg-border/20 mx-1" />

            {/* Announcement Bell */}
            <AnnouncementBell announcements={announcements} />

            <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-muted-foreground hover:text-primary bg-muted/40 border border-border/10"
            >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Auth Action */}
            <div className="flex items-center gap-2 relative">
              {session ? (
                <>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 transition-all duration-300 rounded-full border border-border/20 p-1 pr-3 ${isScrolled ? "bg-muted/40" : "bg-white/5"} hover:bg-muted/60`}
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden text-xs">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        session.user?.name?.[0] || "U"
                      )}
                    </div>
                    {!isScrolled && (
                      <div className="text-left hidden xl:block">
                        <div className="text-[11px] font-bold text-foreground leading-tight truncate max-w-[100px]">{session.user?.name || "Utilisateur"}</div>
                        <div className="text-[9px] text-muted-foreground uppercase font-black">{session.user?.role || "USER"}</div>
                      </div>
                    )}
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 w-56 bg-popover/95 backdrop-blur-3xl border border-border/50 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1"
                      >
                        <Link 
                          href="/admin" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <LayoutDashboard size={16} /> Tableau de Bord
                        </Link>
                        <Link 
                          href="/admin/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <UserCircle size={16} /> Mon Profil
                        </Link>
                        <div className="h-px w-full bg-border/20 my-1" />
                        <button 
                          onClick={() => { setIsProfileOpen(false); signOut({ callbackUrl: `/${locale}/login` }); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-600 hover:bg-red-500/10 transition-colors w-full text-left"
                        >
                          <LogOut size={16} /> Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center gap-2 font-bold transition-all duration-500 overflow-hidden ${
                    isScrolled 
                      ? "w-8 h-8 rounded-full bg-primary text-white justify-center hover:scale-105" 
                      : "px-6 py-2.5 rounded-full text-[13px] bg-primary text-white hover:opacity-90 shadow-md"
                  }`}
                >
                  {isScrolled ? <ArrowUpRight size={16} /> : "Connexion"}
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className={`lg:hidden flex items-center justify-center rounded-full transition-all duration-500 ${
              isScrolled ? "w-9 h-9 bg-primary text-white" : "w-10 h-10 bg-muted text-foreground border border-border"
            }`}
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
               <span className="font-serif font-black text-2xl tracking-tighter text-primary">CREDDA</span>
               <button 
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 flex items-center justify-center bg-muted rounded-full text-foreground"
               >
                  <X size={24} />
               </button>
            </div>
            
            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
              {[...primaryLinks, ...secondaryLinks].map((link, idx) => (
                <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                >
                    <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-base font-semibold tracking-wide py-3.5 flex items-center justify-between border-b border-border/20 group ${
                            pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        {link.label}
                        <ArrowRight size={16} className={`transition-all duration-300 ${pathname === link.href ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60 group-hover:translate-x-1"}`} />
                    </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Footer Actions */}
            <div className="p-8 border-t border-border/50 flex flex-col gap-6 bg-muted/30">
               <div className="flex items-center justify-between">
                  {/* Theme Switch */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 font-bold text-sm text-foreground/80"
                  >
                    <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border shadow-sm">
                        {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
                    </div>
                    {theme === "dark" ? "Mode Clair" : "Mode Sombre"}
                  </button>

                  {/* Lang Switch */}
                  <div className="flex gap-1.5 p-1 bg-card border border-border rounded-full">
                    {languages.map((l) => (
                      <Link
                        key={l.code}
                        href={pathname}
                        locale={l.code}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                          locale === l.code ? "bg-primary text-white shadow-md scale-110" : "text-muted-foreground hover:bg-muted"
                        }`}
                        title={l.label}
                      >
                        <span className="text-lg">{l.flag}</span>
                      </Link>
                    ))}
                  </div>
               </div>

               <Link
                href={session ? "/admin" : "/login"}
                onClick={() => setIsOpen(false)}
                className="w-full h-16 bg-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-lg shadow-xl shadow-primary/20 transition-transform active:scale-95"
              >
                {session ? "Tableau de Bord" : "Connexion Institutionnelle"}
                <ArrowRight size={24} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}