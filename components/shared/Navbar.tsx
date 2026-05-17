"use client";

import Image from "next/image";
import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowUpRight, Search, Sun, Moon, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: t("about", { fallback: "Qui nous sommes" }) },
    { href: "/research", label: t("research", { fallback: "Recherche" }) },
    { href: "/clinical", label: t("clinical", { fallback: "Agir" }) },
    { href: "/publications", label: t("publications", { fallback: "Publications" }) },
    { href: "/contact", label: t("contact", { fallback: "Contact" }) },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm py-4 border-b border-border"
            : "bg-transparent py-5 lg:py-8"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
              <Image
                src="/logocredda.png"
                alt="CREDDA Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif font-black text-xl lg:text-2xl tracking-tighter text-foreground">
              CREDDA
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium transition-colors duration-200 text-foreground/70 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS (Theme, Lang, Login) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Lang Toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-full p-1 border border-border">
                {["fr", "en", "sw"].map((l) => (
                    <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`text-[10px] font-bold uppercase w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                        locale === l 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    >
                    {l}
                    </Link>
                ))}
            </div>

            <button
               onClick={toggleTheme}
               className="w-9 h-9 flex items-center justify-center rounded-full transition-colors bg-muted text-foreground/80 hover:bg-muted/80 border border-border"
               aria-label="Toggle Theme"
            >
               {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={session ? "/admin" : "/login"}
                className="px-6 py-2.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
              >
                {session ? "Dashboard" : "Connexion"}
              </Link>
              <Link
                href={session ? "/admin" : "/login"}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 bg-primary text-primary-foreground shadow-sm"
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 rounded-full bg-muted text-foreground"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] bg-background lg:hidden flex flex-col p-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
               <Link href="/" className="font-bricolage text-2xl font-black">
                CREDDA
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 py-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-semibold opacity-80 hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-border flex flex-col gap-4">
              <div className="flex gap-2">
                {["fr", "en", "sw"].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`flex-1 py-3 text-center rounded-xl text-xs font-bold uppercase transition-colors ${
                      locale === l ? "bg-foreground text-background" : "bg-muted text-foreground"
                    }`}
                  >
                    {l}
                  </Link>
                ))}
              </div>
              <button
                onClick={toggleTheme}
                className="w-full py-4 bg-muted text-foreground rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
              >
                {theme === "dark" ? <><Sun size={16}/> Mode Clair</> : <><Moon size={16}/> Mode Sombre</>}
              </button>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest"
              >
                {t("login", { fallback: "Connexion" })} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}