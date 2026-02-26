"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function ResearchSection({ articles }: { articles: any[] }) {
    const t = useTranslations('HomePage');

    return (
        <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], x: [0, 20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-[300px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[300px] lg:h-[400px] bg-blue-600/5 rounded-[100%] blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-[-10%] w-[400px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[500px] bg-emerald-600/5 rounded-[100%] blur-[80px] sm:blur-[100px] lg:blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 sm:mb-12 lg:mb-16 xl:mb-20 gap-6 lg:gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4 lg:space-y-6"
                    >
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="h-[2px] w-8 sm:w-10 lg:w-12 bg-blue-600" />
                            <Badge className="bg-blue-600/10 text-blue-700 border-none rounded-none uppercase text-[8px] sm:text-[9px] lg:text-[10px] font-black tracking-[0.2em] px-2 sm:px-3 py-1">
                                {t('research.badge')}
                            </Badge>
                        </div>
                        <FormattedHTML
                            html={t.raw('research.title')}
                            as="h3"
                            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-slate-900 leading-[1.1]"
                        />
                        <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-light max-w-md sm:max-w-lg lg:max-w-xl">
                            {t('research.description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/research"
                            className="group flex items-center gap-3 sm:gap-4 lg:gap-6 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 hover:text-blue-600 transition-all"
                        >
                            <span className="border-b-2 border-slate-200 group-hover:border-blue-600 pb-1 sm:pb-2 transition-all">{t('research.cta')}</span>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <ArrowRight size={12} className="sm:w-14 sm:h-14 lg:w-16 lg:h-16" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {articles?.slice(0, 4).map((article: any, idx: number) => (
                        <motion.div
                            key={article?.id || idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white border border-slate-100 p-2 flex flex-col h-full hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                <Image
                                    src={article?.mainImage || "/images/director3.webp"}
                                    fill
                                    alt={article?.translations?.[0]?.title || "Research"}
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-all duration-500" />

                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
                                    <div className="bg-white/90 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 text-[6px] sm:text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                        {article?.category?.translations?.[0]?.name || "Général"}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                                <h4 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-slate-950 mb-2 sm:mb-3 lg:mb-4 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {article?.translations?.[0]?.title || "Titre de recherche"}
                                </h4>

                                <p className="text-[10px] sm:text-xs lg:text-xs text-slate-500 line-clamp-2 sm:line-clamp-3 font-light leading-relaxed mb-4 sm:mb-6 lg:mb-8 italic">
                                    "{article?.translations?.[0]?.excerpt?.substring(0, 80) || "Résumé non disponible"}"
                                </p>

                                <div className="mt-auto pt-4 sm:pt-5 lg:pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-blue-600 rounded-full" />
                                        <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {article?.createdAt ? new Date(article.createdAt).getFullYear() : "2025"}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/research/${article?.slug || article?.id || '#'}`}
                                        className="text-[7px] sm:text-[8px] lg:text-[9px] font-black uppercase tracking-tighter text-slate-900 overflow-hidden relative group/link"
                                    >
                                        <span className="inline-block transition-transform duration-300 group-hover/link:-translate-y-full">Accéder</span>
                                        <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover/link:translate-y-0 text-blue-600">Accéder</span>
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
