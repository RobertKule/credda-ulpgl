"use client";

import React, { useState, useMemo } from "react";
import { m as motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import PublicationCard from "@/components/ui/PublicationCard";

interface Category {
  id: string;
  name: string;
}

interface PublicationExplorerProps {
  initialArticles: any[];
  categories: Category[];
  locale: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PublicationExplorer({
  initialArticles,
  categories,
  locale
}: PublicationExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Filtering & Sorting Logic
  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(art => {
        const t = art.translations?.[0];
        return (
          t?.title?.toLowerCase().includes(q) ||
          t?.excerpt?.toLowerCase().includes(q) ||
          t?.content?.toLowerCase().includes(q)
        );
      });
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter(art => art.categoryId === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "title") {
        const titleA = a.translations?.[0]?.title || "";
        const titleB = b.translations?.[0]?.title || "";
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return result;
  }, [initialArticles, search, selectedCategory, sortBy]);

  return (
    <div className="space-y-12">
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-card/30 backdrop-blur-xl p-4 lg:p-6 rounded-[2rem] border border-border/50 sticky top-24 z-30 shadow-xl shadow-black/5">
        
        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search publications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border/60 rounded-xl py-3 pl-12 pr-10 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-light text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* FILTERS & SORT */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
          {/* CATEGORY SELECT */}
          <div className="relative">
             <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="appearance-none bg-background/50 border border-border/60 rounded-xl py-3 pl-6 pr-12 outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
             >
               <option value="all">All Categories</option>
               {categories.map(cat => (
                 <option key={cat.id} value={cat.id}>{cat.name}</option>
               ))}
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* SORT SELECT */}
          <div className="relative">
             <select
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as any)}
               className="appearance-none bg-background/50 border border-border/60 rounded-xl py-3 pl-6 pr-12 outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
             >
               <option value="newest">Newest First</option>
               <option value="oldest">Oldest First</option>
               <option value="title">Title A-Z</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* REVEAL ACTIVE FILTERS */}
      {(search || selectedCategory !== "all") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-2">Filters active:</span>
          {search && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              "{search}"
              <X size={12} className="cursor-pointer" onClick={() => setSearch("")} />
            </div>
          )}
          {selectedCategory !== "all" && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {categories.find(c => c.id === selectedCategory)?.name}
              <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory("all")} />
            </div>
          )}
          <button
            onClick={() => { setSearch(""); setSelectedCategory("all"); }}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline ml-4"
          >
            Clear all
          </button>
        </motion.div>
      )}

      {/* GRID */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((doc, i) => (
                <PublicationCard
                  key={doc.id}
                  doc={doc}
                  locale={locale}
                  delay={0} // Stagger handles by Presence
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-card/20 rounded-[2rem] border border-dashed border-border/50"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Search size={32} />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-foreground mb-2">No publications found</h4>
                  <p className="text-muted-foreground font-light max-w-xs mx-auto">
                    We couldn't find any papers matching your search or filter criteria.
                  </p>
                </div>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-[10px] font-bold uppercase tracking-widest"
                >
                  Reset Explorer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* RESULTS COUNT */}
      <div className="flex justify-center pt-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
          Showing {filteredArticles.length} / {initialArticles.length} Publications
        </span>
      </div>
    </div>
  );
}
