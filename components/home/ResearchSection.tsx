"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";
import GSAPReveal from "@/components/shared/GSAPReveal";

export default function ResearchSection({ articles = [] }: { articles: any[] }) {
    const t = useTranslations('HomePage');

    return (
        <section className="relative z-20 py-24 lg:py-40 bg-transparent overflow-hidden">
            {/* Dégradés d'accentuation subtils qui réagissent au scroll */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.05, 0.1, 0.05],
                        x: [-20, 20, -20] 
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-24 -left-24 w-[600px] h-[400px] bg-primary/20 rounded-md blur-[120px]"
                />
            </div>

            <div className="w-full px-6 lg:px-16 relative z-10">
                {/* HEADER DE LA SECTION */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 lg:mb-24 gap-10">
                    <GSAPReveal direction="left" className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="h-[1px] w-12 bg-primary" />
                            <Badge className="bg-primary/10 text-primary border-none rounded-md uppercase text-[10px] font-bold tracking-[0.4em] px-4 py-1.5">
                                {t('research.badge')}
                            </Badge>
                        </div>
                        
                        <FormattedHTML
                            html={t.raw('research.title')}
                            as="h3"
                            className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-black text-foreground leading-[0.95] tracking-tighter"
                        />
                        
                        <p className="text-lg lg:text-xl text-muted-foreground font-light max-w-xl leading-relaxed">
                            {t('research.description')}
                        </p>
                    </GSAPReveal>

                    <GSAPReveal direction="right">
                        <Link
                            href="/research"
                            className="group flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-foreground hover:text-primary transition-all"
                        >
                            <span className="border-b border-border group-hover:border-primary pb-3 transition-all">
                                {t('research.cta')}
                            </span>
                            <div className="w-16 h-16 rounded-md border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 group-hover:scale-110">
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </GSAPReveal>
                </div>

                {/* GRILLE D'ARTICLES - RESPONSIVE OPTIMISÉ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {articles?.slice(0, 4).map((article: any, idx: number) => (
                        <motion.div
                            key={article?.id || idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative flex flex-col h-full bg-background/40 dark:bg-card/20 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={article?.mainImage || "/images/director3.webp"}
                                    fill
                                    alt={article?.translations?.[0]?.title || "Research"}
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />

                                {/* Category Badge Floating */}
                                <div className="absolute top-4 left-4">
                                    <Badge variant="emerald" className="px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-emerald/20 bg-emerald/5 backdrop-blur-md">
                                        {article?.category?.translations?.[0]?.name || "Général"}
                                    </Badge>
                                </div>
                            </div>

                            {/* CONTENT AREA */}
                            <div className="p-8 lg:p-10 flex flex-col flex-1 min-h-[280px]">
                                <h4 className="text-xl lg:text-2xl font-fraunces font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors duration-500 line-clamp-3">
                                    {article?.translations?.[0]?.title || "Titre de recherche"}
                                </h4>

                                <p className="text-xs lg:text-sm text-muted-foreground line-clamp-3 font-light leading-relaxed mb-8 italic opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                                    &ldquo;{article?.translations?.[0]?.excerpt?.substring(0, 100) || "Résumé non disponible"}...&rdquo;
                                </p>

                                {/* FOOTER CARD */}
                                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={12} className="text-primary opacity-50" />
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {article?.createdAt ? new Date(article.createdAt).getFullYear() : "2026"}
                                        </span>
                                    </div>
                                    
                                    <Link
                                        href={`/research/${article?.slug || article?.id || '#'}`}
                                        className="relative overflow-hidden group/link px-4 py-2"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-foreground block transition-transform duration-500 group-hover/link:-translate-y-full">
                                            Lire plus
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-primary absolute top-2 left-4 translate-y-full transition-transform duration-500 group-hover/link:translate-y-0">
                                            Lire plus
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}