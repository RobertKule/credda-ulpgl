// app/[locale]/about/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, X, CheckCircle2, Target, 
  Globe2, Landmark, GraduationCap, ArrowRight,
  ShieldCheck, Award, Users2, BookOpenCheck, MapPin
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const t = useTranslations('about');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const values = [
    { key: 'excellence', icon: <Award className="text-blue-600" size={24} /> },
    { key: 'neutrality', icon: <ShieldCheck className="text-emerald-600" size={24} /> },
    { key: 'engagement', icon: <Users2 className="text-slate-900" size={24} /> },
    { key: 'innovation', icon: <GraduationCap className="text-purple-600" size={24} /> },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      
      {/* --- 1. HERO SECTION AVEC VIDÉO MODALE --- */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 bg-[#050a15]">
        <Image 
          src="/images/director3.webp" 
          alt="CREDDA Institution" 
          fill 
          className="object-cover opacity-30 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a15] via-transparent to-transparent" />

        <div className="relative z-10 container mx-auto px-6 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-blue-600 rounded-none px-6 py-2 uppercase tracking-[0.4em] text-[10px] mb-6 shadow-xl">
              {t('since')} 1995
            </Badge>
            <h1 className="text-5xl lg:text-8xl font-serif font-bold text-white leading-tight">
              {t('hero.title1')} <span className="text-blue-400 italic">{t('hero.title2')}</span> <br /> 
              {t('hero.title3')}
            </h1>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="group relative flex items-center justify-center w-28 h-28 bg-white rounded-full hover:bg-blue-600 transition-all duration-500 shadow-[0_0_60px_rgba(37,99,235,0.4)]"
            >
              <PlayCircle size={48} className="text-blue-900 group-hover:text-white transition-colors" />
              <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-20" />
            </button>
            <p className="text-white text-[10px] font-black uppercase tracking-[0.5em] opacity-70">{t('watch_video')}</p>
          </motion.div>
        </div>
      </section>

      {/* --- 2. SECTION HISTOIRE & MOSAÏQUE --- */}
      <section className="py-24 lg:py-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Bloc Images Mosaïque (Gauche) */}
          <div className="lg:col-span-6 relative h-[600px] w-full">
            <div className="absolute top-0 right-0 w-4/5 h-4/5 shadow-2xl overflow-hidden grayscale">
              <Image src="/images/director3.webp" alt="ULPGL Research" fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-3/5 border-[15px] border-white shadow-2xl overflow-hidden z-20">
              <Image src="/images/director3.webp" alt="Field Work" fill className="object-cover" />
            </div>
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute top-1/2 left-[-20px] bg-blue-600 p-8 text-white z-30 shadow-2xl hidden md:block"
            >
              <div className="text-4xl font-serif font-bold">25+</div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t('years_excellence')}</p>
            </motion.div>
          </div>

          {/* Texte Descriptif (Droite) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">{t('who_we_are')}</h2>
              <h3 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
                {t('mission_title')} <span className="italic">{t('mission_italic')}</span>.
              </h3>
            </div>
            
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              {t('mission_description')}
            </p>

            <ul className="space-y-4">
              {t.raw('achievements').map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-4 text-slate-700 font-medium">
                  <div className="bg-blue-50 p-1 rounded-full">
                    <CheckCircle2 className="text-blue-600" size={20} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-none h-14 px-10 shadow-lg shadow-blue-600/20">
              <Link href="/contact" className="uppercase font-bold tracking-widest text-xs">
                {t('contact_us')} <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- 3. MISSION, VISION & VALEURS (CARDS) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge className="bg-blue-600/10 text-blue-600 rounded-none mb-4 uppercase text-[9px] font-black border-none">
              {t('compass')}
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-tight">
              {t('mission_vision_title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-12 shadow-sm border-b-4 border-blue-600 space-y-6 hover:shadow-2xl transition-all duration-500">
               <Target size={40} className="text-blue-600" strokeWidth={1.5} />
               <h4 className="text-2xl font-serif font-bold text-slate-900">{t('mission')}</h4>
               <p className="text-slate-500 font-light leading-relaxed">{t('mission_text')}</p>
            </div>
            <div className="bg-white p-12 shadow-sm border-b-4 border-emerald-600 space-y-6 hover:shadow-2xl transition-all duration-500">
               <Globe2 size={40} className="text-emerald-600" strokeWidth={1.5} />
               <h4 className="text-2xl font-serif font-bold text-slate-900">{t('vision')}</h4>
               <p className="text-slate-500 font-light leading-relaxed">{t('vision_text')}</p>
            </div>
            <div className="bg-white p-12 shadow-sm border-b-4 border-slate-900 space-y-6 hover:shadow-2xl transition-all duration-500">
               <ShieldCheck size={40} className="text-slate-900" strokeWidth={1.5} />
               <h4 className="text-2xl font-serif font-bold text-slate-900">{t('values')}</h4>
               <p className="text-slate-500 font-light leading-relaxed">{t('values_text')}</p>
            </div>
          </div>

          {/* Valeurs additionnelles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {values.map((value, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white border border-slate-100">
                <div className="p-3 bg-slate-50 rounded-full mb-4">
                  {value.icon}
                </div>
                <h5 className="text-xs font-black uppercase tracking-widest text-slate-700">
                  {t(`values_list.${value.key}`)}
                </h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. SECTION CARTE & LOCALISATION --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <MapPin size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('location')}</span>
            </div>
            <h3 className="text-4xl font-serif font-bold text-slate-900">{t('find_us')}</h3>
            <p className="text-slate-500 font-light leading-relaxed">
              {t('location_description')}
            </p>
            <div className="pt-6 space-y-4 border-t border-slate-100">
               <p className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">{t('address')}</p>
               <p className="text-slate-500 text-sm font-light italic">
                 {t.raw('full_address').map((line: string, i: number) => (
                   <React.Fragment key={i}>
                     {line}<br />
                   </React.Fragment>
                 ))}
               </p>
            </div>
          </div>

          <div className="lg:col-span-8 h-[500px] w-full bg-slate-100 shadow-2xl relative overflow-hidden group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.102660144983!2d29.21980311475458!3d-1.6836423987723048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f81d11e5f8f%3A0xc36e3c5443c7b3c2!2sULPGL%20Salomon!5e0!3m2!1sfr!2s!4v1707600000000!5m2!1sfr!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </section>

      {/* --- 5. STATISTIQUES --- */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { key: 'years', value: '25+' },
              { key: 'publications', value: '450+' },
              { key: 'partners', value: '30+' },
              { key: 'beneficiaries', value: '12000+' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-serif font-bold text-blue-900">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                  {t(`stats.${stat.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. CTA FINAL --- */}
      <section className="py-24 bg-[#050a15] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl lg:text-6xl font-serif font-bold italic tracking-tight">
            {t('cta_title')}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 rounded-none h-14 px-12 uppercase font-black tracking-widest text-xs hover:bg-blue-700">
                {t('become_partner')}
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="outline" size="lg" className="border-white text-white hover:text-white hover:bg-blue-600 rounded-none h-14 px-12 uppercase font-black tracking-widest text-xs">
                {t('meet_team')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- MODAL VIDÉO --- */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-0"
          >
            <button 
              onClick={() => setIsVideoOpen(false)} 
              className="absolute top-6 right-6 z-[210] text-white/50 hover:text-white transition-colors p-3 bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full max-w-7xl aspect-video relative shadow-2xl"
            >
              <iframe 
                src="https://www.youtube.com/embed/V-MVLqjQMIc?autoplay=1&rel=0&modestbranding=1&showinfo=0" 
                className="absolute inset-0 w-full h-full border-none"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}