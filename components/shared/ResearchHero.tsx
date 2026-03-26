"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import Image from "next/image";

interface ResearchHeroProps {
  featuredArticle: any;
  locale: string;
}

export default function ResearchHero({ featuredArticle, locale }: ResearchHeroProps) {
  if (!featuredArticle) return null;

  const translation = featuredArticle.translations?.[0];
  const categoryName = featuredArticle.category?.translations?.[0]?.name || "Featured Research";
  const publishDate = new Date(featuredArticle.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="relative w-full bg-[#050a15] overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-6 py-24 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">Latest Editorial Release</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-white leading-tight mb-8">
              {translation?.title}
            </h1>

            <p className="text-lg text-slate-300 font-light leading-relaxed mb-10 border-l border-white/10 pl-8 ml-1 max-w-xl italic">
              {translation?.excerpt || "A deep dive into the legal frameworks and socio-political challenges shaping the future of democracy and development in Africa."}
            </p>

            <div className="flex flex-wrap gap-8 mb-12 text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-500" />
                {publishDate}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-500" />
                CREDDA Research Lab
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
                <BookOpen size={14} className="text-accent" />
                {categoryName}
              </div>
            </div>

            <Link 
              href={`/research/${featuredArticle.slug}`}
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-primary font-heading font-black uppercase tracking-widest text-[10px] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Read Full Paper <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] lg:aspect-[16/10] overflow-hidden border border-white/10 shadow-3xl"
          >
            <Image 
              src={featuredArticle.mainImage || "/images/hero-poster.webp"} 
              alt={translation?.title || "Featured Research"} 
              fill 
              priority
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050a15]/80 via-transparent to-transparent" />
            
            {/* Magazine-style badge */}
            <div className="absolute top-10 right-10 bg-accent p-6 flex flex-col items-center justify-center text-primary transform rotate-3 shadow-xl">
               <span className="text-[10px] font-black uppercase tracking-widest">Scientific</span>
               <span className="text-3xl font-serif font-black italic">Edition</span>
               <span className="text-[8px] font-black uppercase tracking-[0.3em] mt-2">March 2026</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
