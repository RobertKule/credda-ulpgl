"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, BookOpen, User, ArrowRight, Loader2, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { searchEverything } from "@/services/search-actions";
import { ChevronRight } from "lucide-react";
export default function SearchModal({ isOpen, onClose, locale }: { isOpen: boolean; onClose: () => void; locale: string }) {
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

  // Debounce simple pour les suggestions
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
          {/* Overlay flou */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Fenêtre de recherche */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white shadow-2xl rounded-none overflow-hidden"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center p-6 border-b border-slate-100">
              <Search className="text-blue-600 mr-4" size={24} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chercher un rapport, un expert ou un article..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-serif text-slate-900 placeholder:text-slate-300"
              />
              <div className="flex items-center gap-3">
                {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
                <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!results && !loading && query.length < 2 && (
                <div className="p-10 text-center space-y-4">
                  <div className="flex justify-center gap-2 text-slate-300">
                    <Command size={40} strokeWidth={1} />
                  </div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Saisissez au moins 2 caractères</p>
                </div>
              )}

              {results && (
                <div className="space-y-6 p-4">
                  {/* Articles */}
                  {results.articles.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 px-2">Travaux & Analyses</h3>
                      {results.articles.map((a: any) => (
                        <Link key={a.id} href={`/research/${a.slug}`} onClick={onClose} className="flex items-center justify-between p-3 hover:bg-blue-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{a.translations[0].title}</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Publications */}
                  {results.publications.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 px-2">Bibliothèque PDF</h3>
                      {results.publications.map((p: any) => (
                        <Link key={p.id} href="/publications" onClick={onClose} className="flex items-center justify-between p-3 hover:bg-emerald-50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <BookOpen size={18} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{p.translations[0].title} ({p.year})</span>
                          </div>
                          <ArrowRight size={14} className="text-slate-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
              <span>Appuyez sur Entrée pour voir tout</span>
              <div className="flex gap-2">
                 <span className="px-1.5 py-0.5 border border-slate-200 bg-white">ESC</span> pour fermer
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}