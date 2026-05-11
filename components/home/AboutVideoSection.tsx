'use client'

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Link } from "@/navigation";

export default function AboutVideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const t = useTranslations('HomePage');

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-black flex items-center">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted={isMuted}
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-40' : 'opacity-20'}`}
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl space-y-8 md:space-y-12">
          
          {/* Badge/Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter text-white uppercase font-sans">
              {t.rich('video.title_alt', {
                line1: (chunks) => <span className="block">{chunks}</span>,
                line2: (chunks) => <span className="block text-[#C4A45C]">{chunks}</span>,
                default: "UBORA WA KIAKADEMIA"
              }) || (
                <>
                  <span className="block">UBORA WA</span>
                  <span className="block text-[#C4A45C]">KIAKADEMIA</span>
                </>
              )}
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-xl"
          >
            {t('video.description')}
          </motion.p>

          {/* CTA Button Item Style from Ref */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/about" 
              className="inline-flex items-center group bg-[#0D1645] hover:bg-[#C4A45C] transition-colors duration-500 rounded-lg overflow-hidden border border-white/10"
            >
              <span className="px-8 py-4 text-white group-hover:text-black font-bold uppercase tracking-widest text-sm">
                {t('research.read_more')}
              </span>
              <div className="bg-white/10 px-5 py-4 border-l border-white/5 group-hover:bg-black/10">
                <ArrowRight className="text-white group-hover:text-black transition-transform group-hover:translate-x-1" size={20} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Pagination Style Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`h-[2px] transition-all duration-700 ${i === 2 ? 'w-12 bg-[#C4A45C]' : 'w-6 bg-white/20'}`} 
          />
        ))}
      </div>

      {/* Video Control Toggles (Bottom Right) */}
      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-6">
        <button 
          onClick={toggleMute} 
          className="text-white/40 hover:text-[#C4A45C] transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button 
          onClick={togglePlay} 
          className="text-white/40 hover:text-[#C4A45C] transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

    </section>
  );
}
