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

const HeroCarousel = dynamic(() => import("@/components/home/HeroCarousel"), {
  ssr: false,
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
    <section className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col items-center justify-end overflow-hidden pt-32 lg:pt-36 group">

      {/* ✅ BACKGROUND CAROUSEL LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroCarousel />
        
        {/* Institutional Vignette & Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background/90 z-[5]" />
        
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] z-[6]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
        
        {/* Top Glow */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/40 to-transparent z-[7] pointer-events-none" />
      </div>

      <div className="relative z-10 container mx-auto px-6 w-full flex flex-col justify-end flex-grow pb-12 lg:pb-20">
        
        <div className="flex flex-col lg:flex-row items-end justify-between w-full h-full gap-12">
          
          {/* BOTTOM LEFT: LOGOS & INSTITUTION */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 pointer-events-auto scale-90 sm:scale-100 origin-left"
          >
            <div className="flex items-center gap-3 md:gap-4 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image src="/logocredda.png" alt="CREDDA Logo" fill className="object-contain" />
              </div>
              <div className="w-[1px] h-6 md:h-8 bg-white/20" />
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image src="/logoulpgl.webp" alt="ULPGL Logo" fill className="object-contain" />
              </div>
              <div className="ml-1 md:ml-2 flex flex-col">
                <span className="text-white text-base md:text-lg font-bold leading-none tracking-tight">CREDDDA</span>
                <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">ULPGL GOMA</span>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM RIGHT: CONTENT BLOCK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:max-w-xl bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto relative overflow-hidden group/card"
          >
            <div className="relative z-10">
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 bg-primary/20 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-primary/30 mb-4 md:mb-6 transition-transform group-hover/card:scale-105">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  {t("hero.badge")}
                </span>
              </div>

              {/* TITLE */}
              <h1 className="font-serif text-3xl md:text-5xl font-black leading-tight text-white mb-4 md:mb-6">
                <span>{t("hero.title_prefix")}</span>{" "}
                {/*
                  Ghost spacer technique: the invisible span always occupies the
                  width/height of the longest word, preventing any layout shift.
                  The visible typewriter is layered on top via absolute positioning.
                */}
                <span className="text-primary block relative">
                  {/* Invisible ghost — reserves space for the longest word */}
                  <span
                    aria-hidden
                    className="invisible select-none pointer-events-none whitespace-pre-wrap"
                  >
                    {titleWords.reduce(
                      (a: string, b: string) => (a.length >= b.length ? a : b),
                      ""
                    )}
                  </span>

                  {/* Actual typewriter — floats above ghost, never disturbs layout */}
                  <span className="absolute inset-0 flex items-start">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={titleWordIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Typewriter text={titleWords[titleWordIndex]} />
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              {/* SUBTITLE */}
              <p className="text-white/80 font-medium text-sm md:text-base mb-6 md:mb-8 max-w-lg leading-relaxed">
                {t("hero.institutional_description")}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link
                  href="/publications"
                  className="bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all flex items-center gap-2"
                >
                  {t("hero.discover")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/about"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-base font-bold backdrop-blur-sm border border-white/10 transition-all"
                >
                  {t("cta.about")}
                </Link>
              </div>
            </div>
            
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          </motion.div>

        </div>

      </div>
    </section>
  );
}