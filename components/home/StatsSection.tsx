"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Landmark, FileText, Globe, Users, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const Counter = ({ value, duration = 2 }: { value: number | string; duration?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (isInView) {
            const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
            const hasPlus = value.toString().includes("+");

            let start = 0;
            const increment = numericValue / (duration * 60);
            const timer = setInterval(() => {
                start += increment;
                if (start >= numericValue) {
                    setDisplayValue(numericValue + (hasPlus ? "+" : ""));
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.round(start) + (hasPlus ? "+" : ""));
                }
            }, 1000 / 60);

            return () => clearInterval(timer);
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{displayValue}</span>;
};

const StatIcon = ({ icon: Icon, className = "w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8" }: { icon: LucideIcon; className?: string }) => {
    return <Icon className={className} strokeWidth={1.2} />;
};

export default function StatsSection({ stats }: { stats: any }) {
    const t = useTranslations('HomePage');

    return (
        <section className="bg-slate-50/50 py-8 sm:py-12 lg:py-16 xl:py-20 border-y border-slate-100 relative z-20">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {[
                        { v: new Date().getFullYear() - 2008, l: t('stats.years'), icon: Landmark },
                        { v: stats?.totalResources || 0, l: t('stats.pubs'), icon: FileText },
                        { v: 15, l: t('stats.partners'), icon: Globe },
                        { v: 12000, l: t('stats.cases'), icon: Users },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left group"
                        >
                            <div className="text-blue-600 transition-transform duration-500 group-hover:scale-110 shrink-0 mb-2 sm:mb-0">
                                <StatIcon icon={s.icon} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 leading-none mb-1 sm:mb-2">
                                    <Counter value={s.v} />
                                </div>
                                <div className="text-[10px] sm:text-[11px] lg:text-xs font-medium text-slate-500 leading-snug max-w-[120px] sm:max-w-[140px] lg:max-w-[150px]">
                                    {s.l}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
