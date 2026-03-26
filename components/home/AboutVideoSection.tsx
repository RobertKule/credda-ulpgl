'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Play, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutVideoSection() {
  const [showVideo, setShowVideo] = useState(false);
  const t = useTranslations('HomePage');

  return (
    <section className="relative py-24 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                {t('video.badge')}
              </span>
            </div>
            
            <h2 className="font-fraunces text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter">
              {t.rich('video.title', {
                primary: (chunks) => <span className="text-primary italic font-light">{chunks}</span>
              })}
            </h2>
            
            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl border-l border-primary/20 pl-6">
              {t('video.description')}
            </p>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-fraunces text-primary">2008</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">
                  {t('video.since')}
                </span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-fraunces text-primary">ULPGL</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-60">
                  {t('video.institution')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Video Cabinet */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="lg:w-1/2 relative group"
            style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          >
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
            
            {/* Video Container with Glassmorphism Border */}
            <div className="relative z-10 p-2 sm:p-4 rounded-[2rem] bg-background/40 backdrop-blur-xl border border-white/10 shadow-3xl overflow-hidden shadow-primary/5 group-hover:shadow-primary/10 transition-all duration-700">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner bg-black flex items-center justify-center">
                {/* Lazy Load Video on Click */}
                {!showVideo ? (
                  <button 
                    className="absolute inset-0 w-full h-full cursor-pointer group/vid border-none bg-transparent p-0"
                    onClick={() => setShowVideo(true)}
                    aria-label={t('video.watch')}
                  >
                    <img 
                      src="https://img.youtube.com/vi/V-MVLqjQMIc/maxresdefault.jpg" 
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover opacity-60 group-hover/vid:opacity-80 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-primary/90 flex items-center justify-center text-primary-foreground shadow-2xl group-hover/vid:scale-110 transition-transform duration-500">
                        <Play size={32} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/V-MVLqjQMIc?si=JqKvqg3gxTAFmRsw&start=4&autoplay=1" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              
              {/* Subtle Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/5">
                  <Play size={12} className="text-primary fill-primary" />
                  <span className="text-[8px] uppercase font-bold tracking-widest text-white/80">
                    {t('video.watch')}
                  </span>
                </div>
                <Info size={16} className="text-white/40" />
              </div>
            </div>

            {/* Floating elements for depth */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-md blur-xl border border-primary/10"
            />
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary/10 rounded-md blur-lg border border-primary/20"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
