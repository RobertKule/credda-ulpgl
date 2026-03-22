// components/shared/Navbar.tsx
"use client";

import { Link, usePathname } from "./../../navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ArrowRight, Search, Sun, Moon } from "lucide-react";
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
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tickerItems = Object.values(t.raw("ticker") || {});

  const navLinks = [
    { href: "/about", label: t("about") },
    { href: "/research", label: t("research") },
    { href: "/programmes", label: t("programmes") },
    { href: "/publications", label: t("publications") },
    { href: "/events", label: t("events") },
    { href: "/gallery", label: t("gallery") }
  ];

  const loginHref = session ? "/admin" : "/login";
  const loginLabel = session ? t("dashboard") : t("login");

  const langPills = (
    <div className="flex items-center gap-1.5 bg-[var(--border)]/30 p-1 rounded-sm border border-[var(--border)] flex-shrink-0">
      {["fr", "en", "sw"].map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={`text-[9px] font-outfit font-bold w-7 h-7 flex items-center justify-center transition-all rounded-sm ${
            locale === l
              ? "bg-[#C9A84C] text-[#0C0C0A]"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  const themeBtn = (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-sm border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors"
      aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  const loginBtnClass =
    "inline-flex items-center justify-center px-4 py-2.5 border border-[#C9A84C] text-[#C9A84C] text-[9px] font-outfit font-semibold uppercase tracking-widest hover:bg-[#C9A84C] hover:text-[#0C0C0A] transition-all rounded-sm flex-shrink-0";

  return (
    <>
      <div className="fixed top-0 w-full z-[100] bg-[#111110] border-b border-white/5 py-1.5 overflow-hidden light:bg-[#F0EDE6] light:border-black/5">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...tickerItems, ...tickerItems].map((item: any, i) => (
            <span
              key={i}
              className="mx-12 text-[10px] font-outfit font-medium uppercase tracking-[0.2em] text-[#F5F2EC]/60 flex items-center gap-4 light:text-[#1A1814]/55"
            >
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`fixed top-8 left-0 right-0 z-50 h-16 flex items-center transition-all duration-500 ${
          isScrolled ? "py-0" : ""
        }`}
      >
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isScrolled
              ? "bg-[#0C0C0A]/95 backdrop-blur-md border-b border-white/10 shadow-lg light:bg-[#F8F6F1]/95 light:border-black/10"
              : "bg-transparent"
          }`}
        />

        <div className="container mx-auto px-4 md:px-6 relative flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-4 group flex-shrink-0 min-w-0">
            <div className="relative flex flex-col items-start translate-y-0.5">
              <span className="font-bricolage font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tighter text-[#F5F2EC] leading-none light:text-[#1A1814]">
                CREDDA<span className="text-[#C9A84C]">·</span>CDE
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] font-outfit font-medium text-[#F5F2EC]/40 mt-1 pl-0.5 light:text-[#1A1814]/45">
                Research & Legal Clinic
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-end min-w-0">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className={`relative px-3 py-2 text-[10px] font-outfit font-medium uppercase tracking-[0.2em] transition-all group whitespace-nowrap ${
                  pathname === link.href
                    ? "text-[#C9A84C]"
                    : "text-[#F5F2EC]/70 hover:text-[#F5F2EC] light:text-[#1A1814]/70 light:hover:text-[#1A1814]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[1px] bg-[#C9A84C] transition-transform duration-500 origin-left ${
                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            <div className="ml-4 flex items-center gap-4 border-l border-white/10 pl-6 light:border-black/10">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#F5F2EC]/40 hover:text-[#C9A84C] transition-colors light:text-[#1A1814]/45"
                title="Search"
              >
                <Search size={18} />
              </button>
              {langPills}
              {themeBtn}
              <Link href={loginHref} className={loginBtnClass}>
                {loginLabel}
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-[#C9A84C] text-[#0C0C0A] text-[10px] font-outfit font-bold uppercase tracking-widest hover:bg-[#E8C97A] transition-all flex items-center gap-2 ring-1 ring-[#C9A84C]/20 flex-shrink-0"
              >
                {t("contact")}
                <ArrowRight size={12} />
              </Link>
            </div>
          </nav>

          <div className="hidden md:flex lg:hidden items-center gap-3 flex-shrink-0">
            {langPills}
            {themeBtn}
            <Link href={loginHref} className={loginBtnClass}>
              {loginLabel}
            </Link>
            <button
              type="button"
              className="p-2 text-[#F5F2EC]/80 hover:text-[#C9A84C] light:text-[#1A1814]"
              onClick={() => setIsOpen(true)}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="p-2 text-[#F5F2EC]/80 hover:text-[#C9A84C] light:text-[#1A1814]"
              onClick={() => setIsOpen(true)}
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-[200] bg-[#0C0C0A] flex flex-col light:bg-[#F8F6F1]"
          >
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 light:border-black/10">
              <span className="font-bricolage font-extrabold tracking-tighter text-2xl text-[#F5F2EC] light:text-[#1A1814]">
                CREDDA<span className="text-[#C9A84C]">·</span>CDE
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-3 bg-white/5 text-[#F5F2EC] rounded-full hover:bg-[#C9A84C] hover:text-[#0C0C0A] transition-all light:bg-black/5 light:text-[#1A1814]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-center">
              <nav className="space-y-4 md:space-y-6 max-w-2xl mx-auto w-full">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-[clamp(1.75rem,8vw,2rem)] font-fraunces font-bold text-[#F5F2EC] hover:text-[#C9A84C] transition-colors leading-tight light:text-[#1A1814]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="p-8 md:p-12 border-t border-white/5 bg-[#111110] flex flex-col gap-4 light:bg-[#F0EDE6] light:border-black/10">
              <div className="flex gap-2 justify-center">
                {["fr", "en", "sw"].map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 max-w-[5rem] text-center py-3 text-xs font-outfit font-bold border rounded-sm ${
                      locale === l
                        ? "bg-[#C9A84C] text-[#0C0C0A] border-[#C9A84C]"
                        : "text-[#F5F2EC]/50 border-white/10 light:text-[#1A1814]/50 light:border-black/10"
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4 py-3 border border-[#C9A84C]/50 text-[#C9A84C] rounded-sm"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              <Link
                href={loginHref}
                onClick={() => setIsOpen(false)}
                className="w-full py-4 border border-[#C9A84C] text-[#C9A84C] text-center text-[10px] font-outfit font-bold uppercase tracking-[0.2em]"
              >
                {loginLabel}
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full py-5 bg-[#C9A84C] text-[#0C0C0A] text-center text-xs font-outfit font-bold uppercase tracking-[0.2em]"
              >
                {t("contact")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
    </>
  );
}
