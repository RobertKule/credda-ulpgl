"use client";

import React, { useState, useMemo, useEffect } from "react";
import { m as motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import PublicationCard from "@/components/ui/PublicationCard";

import { EditorialItem } from "@/types/editorial";

interface Category {
  id: string;
  name: string;
}

interface PublicationExplorerProps {
  initialArticles: EditorialItem[];
  categories: Category[];
  locale: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const ITEMS_PER_PAGE = 9;

export default function PublicationExplorer({
  initialArticles,
  categories,
  locale
}: PublicationExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  // Filtering & Sorting Logic
  const filteredArticles = useMemo(() => {
    let result = [...initialArticles];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(art => {
        return (
          art.title?.toLowerCase().includes(q) ||
          art.excerpt?.toLowerCase().includes(q) ||
          art.content?.toLowerCase().includes(q)
        );
      });
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter(art => art.category === categories.find(c => c.id === selectedCategory)?.name);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [initialArticles, search, selectedCategory, sortBy, categories]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  return (
    <div className="space-y-12">
      {/* TOOLBAR */}
      <div className="sticky top-28 z-30 mx-auto max-w-5xl w-full border border-primary">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-xl p-4 rounded-md border border-border/50">
        
        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search publications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background/50 border border-border/60 rounded-md py-3 pl-12 pr-10 outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all font-light text-sm"
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
               className="appearance-none w-full lg:w-48 bg-background/50 border border-border/60 rounded-md py-3 pl-6 pr-12 outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
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
               onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
               className="appearance-none w-full lg:w-48 bg-background/50 border border-border/60 rounded-md py-3 pl-6 pr-12 outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
             >
               <option value="newest">Newest First</option>
               <option value="oldest">Oldest First</option>
               <option value="title">Title A-Z</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
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
            {currentItems.length > 0 ? (
              currentItems.map((doc, i) => (
                <PublicationCard
                  key={doc.id}
                  doc={doc}
                  locale={locale}
                  delay={0}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-40 flex flex-col items-center justify-center space-y-6 bg-card/20 rounded-md border border-dashed border-border/50"
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-12">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* RESULTS COUNT */}
      <div className="flex justify-center pt-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
          Showing {currentItems.length} of {filteredArticles.length} / Global: {initialArticles.length}
        </span>
      </div>
    </div>
  );
}
