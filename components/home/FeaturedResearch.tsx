// components/home/FeaturedResearch.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

interface FeaturedResearchProps {
  research: any[];
}

export default function FeaturedResearch({ research }: FeaturedResearchProps) {
  const t = useTranslations('HomePage');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="w-full relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center mx-auto mb-20 lg:mb-24 space-y-6">
          <GSAPReveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <BookOpen size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {t('research.badge') || "OUR RESEARCH"}
              </span>
            </div>
          </GSAPReveal>

          <GSAPReveal direction="up" delay={0.2}>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-fraunces font-black tracking-tighter leading-[1.1] text-foreground">
              {t.rich('research.title_insight', {
                  span: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
              }) || (
                  <>
                      Explorez notre <span className="text-primary italic font-light">Recherche</span>
                  </>
              )}
            </h2>
          </GSAPReveal>

          <GSAPReveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl leading-relaxed">
              {t('research.description') || "Explore our latest scientific contributions and legal investigations across the African continent."}
            </p>
          </GSAPReveal>
        </div>

        {/* RESEARCH GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {research?.slice(0, 3).map((item, idx) => {
            const categories = item.categories?.map((c: any) => c.translations?.[0]?.name) || ["Investigation"];
            const formattedDate = new Date(item.createdAt).toLocaleDateString("fr-FR", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            return (
              <motion.div
                key={item.id || idx}
                variants={cardVariants}
                className="group relative bg-card p-6 md:p-8 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-none border border-border/5 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]"
              >
                {/* Border Animation Lines */}
                <span className="absolute top-0 left-1/2 h-0.5 w-0 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out z-10" />
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out z-10" />
                <span className="absolute left-0 top-1/2 w-0.5 h-0 bg-primary group-hover:h-full group-hover:top-0 transition-all duration-500 ease-out z-10" />
                <span className="absolute right-0 top-1/2 w-0.5 h-0 bg-primary group-hover:h-full group-hover:top-0 transition-all duration-500 ease-out z-10" />

                <Link href={`/research/${item.slug}`} className="block space-y-4">
                  {/* Image Area */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image 
                      src={item.mainImage || "/images/recheche.webp"} 
                      alt={item.translations?.[0]?.title || "Research"} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>

                  {/* Meta Area */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] md:text-xs">
                        <span className="text-muted-foreground font-medium uppercase tracking-wider">{formattedDate}</span>
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest">
                            {categories.slice(0, 2).map((cat, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="opacity-30">·</span>}
                                    <span>{cat}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-fraunces font-black text-foreground leading-[1.2] tracking-tight group-hover:text-primary transition-colors duration-500 line-clamp-2">
                         {item.translations?.[0]?.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                         {item.translations?.[0]?.excerpt || "Investigating the intersection of legal architecture and humanitarian imperatives."}
                         {" "}
                         <span className="text-primary font-bold hover:underline ml-1">
                            {t('research.read_more') || "Lire plus"}
                         </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* BOTTOM CTA */}
        <GSAPReveal direction="up" delay={0.5}>
          <div className="mt-20 flex justify-center">
              <Link 
                  href="/publications" 
                  className="group flex items-center gap-6 px-12 py-5 bg-foreground text-background rounded-full transition-all duration-500 hover:scale-105 shadow-xl"
              >
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                      {t('research.cta_view_all') || "Explore all research"}
                  </span>
                  <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
          </div>
        </GSAPReveal>
      </div>
    </div>
  );
}
