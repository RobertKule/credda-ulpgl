// components/shared/SearchModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, BookOpen, Loader2, Command, ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { searchEverything } from "@/services/search-actions";
import { useTranslations } from "next-intl";

export default function SearchModal({ isOpen, onClose, locale }: { isOpen: boolean; onClose: () => void; locale: string }) {
  const t = useTranslations('Search');
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const data = await searchEverything(query, locale);
      setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 md:pt-32">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0C0C0A]/90 backdrop-blur-xl"
          />

          {/* Search Window */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative w-full max-w-2xl bg-[#111110] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center p-8 border-b border-white/5 bg-[#161614]">
              <Search className="text-[#C9A84C] mr-6" size={24} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder') || "Search for research, publications..."}
                aria-label="Search query"
                className="flex-1 bg-transparent border-none outline-none text-2xl font-serif text-[#F5F2EC] placeholder:text-[#F5F2EC]/20"
              />
              <div className="flex items-center gap-4">
                {loading && <Loader2 className="animate-spin text-[#C9A84C]" size={20} />}
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/5 text-[#F5F2EC]/40 transition-colors"
                  aria-label="Close search"
                >
                  <X size={24} />
                </button>
              </div>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {!results && !loading && query.length < 2 && (
                <div className="p-20 text-center space-y-6">
                  <div className="flex justify-center text-[#C9A84C]/20">
                    <Command size={60} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] text-[#F5F2EC]/30 font-black uppercase tracking-[0.4em]">{t('min_chars') || "Type at least 2 characters"}</p>
                </div>
              )}

              {results && (
                <div className="space-y-10 p-4">
                  {/* Articles */}
                  {results.articles.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.4em] mb-6 px-4">{t('sections.articles') || "Research Articles"}</h3>
                      <div className="space-y-2">
                        {results.articles.map((a: any) => {
                           const title = a.translations.find((tr: any) => tr.language === locale)?.title || a.translations[0].title;
                           return (
                            <Link key={a.id} href={`/research/${a.slug}`} onClick={onClose} className="flex items-center justify-between p-4 hover:bg-white/5 transition-all group rounded-sm">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-sm">
                                  <FileText size={16} className="text-[#F5F2EC]/40 group-hover:text-[#C9A84C] transition-colors" />
                                </div>
                                <span className="text-base font-light text-[#F5F2EC]/80 group-hover:text-[#F5F2EC]">{title}</span>
                              </div>
                              <ChevronRight size={16} className="text-[#F5F2EC]/20 group-hover:text-[#C9A84C] transition-all transform group-hover:translate-x-1" />
                            </Link>
                           );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Publications */}
                  {results.publications.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.4em] mb-6 px-4">{t('sections.publications') || "Scientific Publications"}</h3>
                      <div className="space-y-2">
                        {results.publications.map((p: any) => {
                           const title = p.translations.find((tr: any) => tr.language === locale)?.title || p.translations[0].title;
                           return (
                            <Link key={p.id} href="/publications" onClick={onClose} className="flex items-center justify-between p-4 hover:bg-white/5 transition-all group rounded-sm">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-sm">
                                  <BookOpen size={16} className="text-[#F5F2EC]/40 group-hover:text-[#C9A84C] transition-colors" />
                                </div>
                                <span className="text-base font-light text-[#F5F2EC]/80 group-hover:text-[#F5F2EC]">{title} ({p.year})</span>
                              </div>
                              <ArrowRight size={16} className="text-[#F5F2EC]/20 group-hover:text-[#C9A84C] transition-all transform group-hover:translate-x-1" />
                            </Link>
                           );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 bg-[#161614] border-t border-white/5 flex justify-between items-center text-[9px] font-bold uppercase text-[#F5F2EC]/20 tracking-widest">
              <span className="flex items-center gap-2">
                <Command size={12} /> {t('footer_hint') || "Press enter to see all results"}
              </span>
              <div className="flex gap-4">
                 <span className="px-2 py-1 bg-white/5 border border-white/5 font-mono">ESC</span>
                 <span className="mt-1">{t('esc_hint') || "to close"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}