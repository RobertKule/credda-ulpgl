"use client";

import React, { useRef } from "react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { m as motion, useScroll, useTransform } from "framer-motion";
import { FormattedHTML } from "@/components/ui/FormattedHTML";

export default function CtaSection() {
    const t = useTranslations('HomePage');
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 0.95]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.65, 0.45, 0.65]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
        >
            {/* BACKGROUND IMAGE */}
            <motion.div style={{ scale }} className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                    style={{ backgroundImage: "url('/images/imgCTA.jpg')" }}
                />

                {/* CLEAN OVERLAY */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-background/50 dark:bg-background/85"
                />
            </motion.div>

            {/* CTA CARD */}
            <div className="container relative z-10 px-6 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="
                        max-w-3xl w-full
                        rounded-2xl
                        p-10 md:p-14

                        bg-background/60 dark:bg-background/30
                        backdrop-blur-2xl

                        border border-border/20
                        shadow-[0_30px_120px_-40px_rgba(0,0,0,0.35)]

                        flex flex-col items-center text-center

                        transition-all duration-500
                        hover:border-primary/30
                        hover:shadow-[0_40px_140px_-50px_rgba(0,0,0,0.45)]
                    "
                >
                    {/* BADGE */}
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        whileInView={{ opacity: 1, letterSpacing: "0.45em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-[10px] md:text-[11px] font-black uppercase text-primary mb-8"
                    >
                        {t('cta.badge') ?? "REJOIGNEZ-NOUS"}
                    </motion.p>

                    {/* TITLE */}
                    <FormattedHTML
                        html={t.raw('cta.title')}
                        as="h2"
                        className="
                            text-3xl md:text-5xl lg:text-6xl
                            font-serif font-black
                            text-foreground
                            leading-[1.1]
                            tracking-tight
                            mb-10
                        "
                    />

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-lg">
                        
                        {/* PRIMARY */}
                        <Link
                            href="/contact"
                            className="
                                flex-1
                                px-8 py-4 md:py-5
                                bg-primary text-white
                                font-black uppercase text-[10px] md:text-[11px]
                                tracking-[0.25em]
                                rounded-lg

                                transition-all duration-300
                                hover:scale-[1.03]
                                hover:bg-primary/90
                                active:scale-95

                                shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]
                            "
                        >
                            {t('cta.partner')}
                        </Link>

                        {/* SECONDARY */}
                        <Link
                            href="/about"
                            className="
                                flex-1
                                px-8 py-4 md:py-5
                                rounded-lg

                                bg-muted/40 dark:bg-white/5
                                border border-border/20

                                text-foreground
                                font-black uppercase text-[10px] md:text-[11px]
                                tracking-[0.25em]

                                backdrop-blur-md

                                transition-all duration-300
                                hover:bg-muted/60 dark:hover:bg-white/10
                                hover:border-primary/30
                                hover:scale-[1.03]
                                active:scale-95
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