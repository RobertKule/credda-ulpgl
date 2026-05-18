"use client";

import dynamic from "next/dynamic";
import { m as motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "@/navigation";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

const AfricaGlobe = dynamic(() => import("@/components/home/AfricaGlobe"), {
  ssr: false,
  loading: () => null,
});

const Typewriter = ({ text }: { text: string }) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    let index = 0;
    setCurrentText("");

    const timer = setInterval(() => {
      setCurrentText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) clearInterval(timer);
    }, 80);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {currentText}
      <span className="inline-block w-[4px] h-[0.8em] bg-primary ml-1 animate-pulse" />
    </>
  );
};

export default function Hero({
  testimonials = [],
  team = [],
}: {
  testimonials?: any[];
  team?: any[];
}) {
  const t = useTranslations("HomePage");
  const locale = useLocale();

  const titleWords: string[] = t.raw('hero.title_carousel') || ["Excellence"];

  const [titleWordIndex, setTitleWordIndex] = useState(0);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leftIndex, setLeftIndex] = useState(0);
  const [centerIndex, setCenterIndex] = useState(0);

  const partners = [
    {
      id: "credda",
      logo: "/logocredda.png",
      subtitle: t("hero.subtitle_credda"),
    },
    {
      id: "ulpgl",
      logo: "/logoulpgl.webp",
      subtitle: t("hero.subtitle_ulpgl"),
    },
  ];

  const leftItems = t.raw("hero.carousel") || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleWordIndex((p) => (p + 1) % (titleWords.length || 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [titleWords.length]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-32 lg:pt-36 pb-0">

      {/* ✅ BACKGROUND GRADIENT LAYER */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-black dark:via-background dark:to-emerald-950/20" />

        {/* Radial glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-400/20 blur-[120px] rounded-full dark:bg-primary/10" />

        {/* Secondary glow */}
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-teal-300/20 blur-[140px] rounded-full dark:bg-emerald-500/10" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 w-full flex flex-col items-center">

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/5 px-5 py-2 rounded-full border border-primary/20 mb-4"
        >
          <span className="text-primary text-[11px] font-bold uppercase tracking-widest">
            {t("hero.badge")}
          </span>
        </motion.div>

        {/* TITLE */}
        <h1 className="text-center font-serif text-5xl md:text-7xl font-black leading-tight max-w-6xl">
          <span>{t("hero.title_prefix")}</span>{" "}
          <span className="text-primary inline-block min-w-[300px]">
            <AnimatePresence mode="wait">
              <motion.span key={titleWordIndex}>
                <Typewriter text={titleWords[titleWordIndex]} />
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-center text-muted-foreground mt-6 max-w-2xl">
          {partners[activePartnerIndex].subtitle}
        </p>

        {/* CTA */}
        <div className="flex gap-6 mt-8">
          <Link
            href="/publications"
            className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition"
          >
            {t("hero.discover")}
          </Link>

          <Link
            href="/publications"
            className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10"
          >
            <ArrowUpRight />
          </Link>
        </div>

      </div>
    </section>
  );
}