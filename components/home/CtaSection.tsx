"use client";

import React, { useRef } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function CtaSection() {
    const t = useTranslations('HomePage');
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Scroll Parallax Effect
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Suble zoom out as we scroll through
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 0.95]);
    const opacityOverlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.4, 0.6]);

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
        >
            {/* 1. LAYER: BACKGROUND IMAGE with PARALLAX */}
            <motion.div 
                style={{ scale }}
                className="absolute inset-0 z-0"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/images/bg-credda.jpg')" }}
                />
                {/* Mode-aware Dynamic Overlay: Light-tinted in light mode, Dark-tinted in dark mode */}
                <motion.div 
                    style={{ opacity: opacityOverlay }}
                    className="absolute inset-0 bg-background/40 dark:bg-background/80" 
                />
            </motion.div>

            {/* 2. LAYER: CENTERED TRANSPARENT CARD */}
            <div className="container relative z-10 px-6 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="
                        max-w-3xl w-full
                        bg-white/20 dark:bg-white/5
                        backdrop-blur-xl
                        rounded-none
                        p-8 md:p-14
                        shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)]
                        dark:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)]
                        flex flex-col items-center text-center
                        bg-background 
                    "
                >
                    <motion.p 
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-[10px] md:text-[11px] font-black uppercase text-foreground mb-8"
                    >
                        {t('cta.badge') ?? "REJOIGNEZ-NOUS"}
                    </motion.p>

                    <FormattedHTML
                        html={t.raw('cta.title')}
                        as="h2"
                        className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter mb-10"
                    />

                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full max-w-lg">
                        <Link 
                            href="/contact" 
                            className="
                                px-8 md:px-10 py-4 md:py-5 
                                bg-primary text-white 
                                font-black uppercase text-[10px] md:text-[11px] 
                                tracking-[0.3em] 
                                transition-all duration-500
                                hover:bg-slate-900 hover:text-white 
                                translate-y-0 hover:-translate-y-1
                                shadow-[0_15px_30px_-10px_rgba(20,135,100,0.3)]
                                rounded-md text-center whitespace-nowrap
                            "
                        >
                            {t('cta.partner')}
                        </Link>
                        
                        <Link 
                            href="/about" 
                            className="
                                px-8 md:px-10 py-4 md:py-5 
                                bg-slate-900/10 dark:bg-white/10 backdrop-blur-md
                                text-slate-900 dark:text-white 
                                font-black uppercase text-[10px] md:text-[11px] 
                                tracking-[0.3em] 
                                transition-all duration-500
                                hover:bg-slate-900/20 dark:hover:bg-white/20
                                translate-y-0 hover:-translate-y-1
                                rounded-md text-center whitespace-nowrap
                            "
                        >
                            {t('cta.about')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
