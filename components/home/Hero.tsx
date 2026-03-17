"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Play, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import ParallaxWrapper from "@/components/shared/ParallaxWrapper";

interface HeroProps {
  slides: {
    title: string;
    desc: string;
  }[];
}

export default function Hero({ slides }: HeroProps) {
  const t = useTranslations('HomePage');

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary">
      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/60 via-transparent to-primary/90" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(26,54,93,0.4)_100%)]" />
      
      {/* Video/Image Background with Parallax */}
      <ParallaxWrapper speed={0.4} className="absolute inset-0 w-full h-full scale-110">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-50 grayscale-[0.3]"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
      </ParallaxWrapper>

      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-accent">
                {t('hero.badge') || "Institutional Excellence"}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-black text-white leading-[0.9] tracking-tighter mb-8">
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="block italic"
                >
                  {t('hero.title_part1') || "Justice"}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-accent"
                >
                  {t('hero.title_part2') || "& Research"}
                </motion.span>
              </span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed mb-12 border-l border-white/10 pl-8 ml-1"
            >
              {t('hero.slides.0.desc')}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <Link 
                href="/publications" 
                className="group relative px-10 py-5 bg-accent text-primary font-heading font-black uppercase tracking-widest text-xs overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.cta_publications')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              <Link 
                href="/about" 
                className="group flex items-center gap-4 text-white hover:text-accent transition-colors"
              >
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500">
                  <Play size={16} fill="currentColor" className="ml-1" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{t('hero.cta_contact')}</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements / Decorative */}
      <div className="absolute bottom-12 left-12 z-20 hidden lg:block">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white/5 border border-white/10 glass flex items-center justify-center">
            <Landmark size={20} className="text-accent" />
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">Affiliation</p>
            <p className="text-[10px] font-serif italic text-white/60">ULPGL University, Goma</p>
          </div>
        </div>
      </div>

      {/* Bottom Progress Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-20">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="h-full bg-accent origin-left"
        />
      </div>
    </section>
  );
}
