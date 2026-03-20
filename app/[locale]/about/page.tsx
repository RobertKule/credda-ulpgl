// app/[locale]/about/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Target,
  Globe2, GraduationCap, ArrowRight,
  ShieldCheck, Award, Users2, MapPin, Scale, BookOpen, FileText, Landmark
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations('about');

  const legalFoundations = [
    "Constitution RDC du 18 février 2006",
    "Loi no 22/030 du 15 juillet 2022 (peuples autochtones pygmées)",
    "Déclaration universelle des droits de l'homme",
    "Charte africaine des droits de l'homme et des peuples",
    "Convention sur la diversité biologique",
    "Déclaration ONU sur les droits des peuples autochtones"
  ];

  return (
    <main className="min-h-screen bg-[#0C0C0A] overflow-x-hidden">

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-48 pb-40 overflow-hidden bg-black flex items-center justify-center">
        {/* VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden scale-[1.3]">
           <iframe 
             src="https://www.youtube.com/embed/V-MVLqjQMIc?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=V-MVLqjQMIc&start=12" 
             className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-video min-w-full min-h-full"
             frameBorder="0"
             allow="autoplay; encrypted-media"
           />
           <div className="absolute inset-0 bg-[#0C0C0A]/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 rounded-none px-6 py-2 uppercase font-outfit font-bold tracking-[0.4em] text-[10px] mb-12">
                Héritage Scientifique • {t('since')} 2008
              </Badge>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-fraunces font-extrabold text-[#F5F2EC] leading-[0.85] mb-12 italic">
                {t('hero.title1')} <span className="text-[#C9A84C]">{t('hero.title2')}</span> <br />
                {t('hero.title3')}
              </h1>
              <p className="text-xl text-[#F5F2EC]/40 font-outfit font-light max-w-3xl mx-auto leading-relaxed border-t border-white/5 pt-10">
                Le CREDDA combine excellence académique et action concrète pour bâtir un État de droit exemplaire en Afrique centrale.
              </p>
            </motion.div>
        </div>
      </section>

      {/* --- 2. MISSION & VISION --- */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-12">
         <div className="grid md:grid-cols-3 gap-8">
            <Card 
               icon={<Target className="text-[#C9A84C]" />} 
               title={t('mission')} 
               text={t('mission_text')} 
            />
            <Card 
               icon={<Globe2 className="text-[#C9A84C]" />} 
               title={t('vision')} 
               text={t('vision_text')} 
            />
            <Card 
               icon={<ShieldCheck className="text-[#C9A84C]" />} 
               title={t('values')} 
               text={t('values_text')} 
            />
         </div>
      </section>

      {/* --- 3. HISTOIRE & ACHIEVEMENTS --- */}
      <section className="py-32 bg-[#111110] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="relative aspect-square">
                  <div className="absolute inset-0 border border-[#C9A84C]/20 -translate-x-6 -translate-y-6" />
                  <div className="w-full h-full relative overflow-hidden">
                     <Image src="/images/director3.webp" alt="Research Action" fill className="object-cover grayscale" />
                  </div>
                  <div className="absolute bottom-12 right-12 bg-[#0C0C0A] p-10 border border-[#C9A84C]/30">
                     <p className="text-5xl font-fraunces font-extrabold text-[#C9A84C]">25+</p>
                     <p className="text-[10px] uppercase font-outfit font-bold tracking-widest text-[#F5F2EC]/40 pt-2">{t('years_excellence')}</p>
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="space-y-6">
                     <span className="text-[10px] font-outfit font-bold uppercase tracking-[0.4em] text-[#C9A84C]">{t('who_we_are')}</span>
                     <h2 className="text-4xl md:text-6xl font-fraunces font-bold text-[#F5F2EC] leading-tight">
                        {t('mission_title')} <span className="italic text-[#C9A84C]">{t('mission_italic')}</span>.
                     </h2>
                  </div>
                  
                  <p className="text-lg text-[#F5F2EC]/50 font-outfit font-light leading-loose">
                     {t('mission_description')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {t.raw('achievements').map((item: string, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start">
                           <CheckCircle2 className="text-[#C9A84C] shrink-0" size={18} />
                           <span className="text-xs text-[#F5F2EC]/70 uppercase font-outfit font-bold tracking-widest">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 4. FONDEMENTS JURIDIQUES (NEW) --- */}
      <section className="py-32 max-w-7xl mx-auto px-6 lg:px-12">
         <div className="text-center mb-24">
            <span className="text-[10px] font-outfit font-bold uppercase tracking-[0.4em] text-[#C9A84C] block mb-6">Cadre Légal</span>
            <h2 className="text-4xl md:text-6xl font-fraunces font-bold text-[#F5F2EC]">Fondements <span className="italic-accent">Juridiques</span></h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalFoundations.map((foundation, idx) => (
               <div key={idx} className="p-10 border border-white/5 bg-white/5 hover:border-[#C9A84C]/30 transition-all group">
                  <Landmark className="text-[#C9A84C]/40 group-hover:text-[#C9A84C] mb-8 transition-colors" size={32} />
                  <p className="text-[#F5F2EC] font-bricolage font-bold text-xl leading-snug">
                     {foundation}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* --- 5. LOCATION & CONTACT --- */}
      <section className="py-32 bg-[#111110] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[#C9A84C]">
                    <MapPin size={24} />
                    <span className="text-[10px] font-outfit font-bold uppercase tracking-[0.4em]">{t('location')}</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-fraunces font-bold text-[#F5F2EC]">
                    {t('find_us')}
                  </h3>
               </div>
               <p className="text-lg text-[#F5F2EC]/40 font-outfit font-light leading-relaxed">
                 {t('location_description')}
               </p>
               <div className="pt-10 border-t border-white/5">
                 <p className="text-[10px] uppercase tracking-widest font-outfit font-bold text-[#C9A84C] mb-4">{t('address')}</p>
                 <p className="text-[#F5F2EC] font-fraunces text-2xl italic leading-relaxed">
                   {t.raw('full_address').join(', ')}
                 </p>
               </div>
               
               <Button asChild className="bg-[#C9A84C] text-[#0C0C0A] rounded-none py-8 px-12 font-outfit font-bold uppercase tracking-widest text-[10px] hover:bg-[#E8C97A]">
                  <Link href="/contact" className="flex gap-4">
                     {t('contact_us')} <ArrowRight size={14} />
                  </Link>
               </Button>
            </div>

            <div className="aspect-square bg-black border border-white/10 p-4">
               <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.102660144983!2d29.21980311475458!3d-1.6836423987723048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f81d11e5f8f%3A0xc36e3c5443c7b3c2!2sULPGL%20Salomon!5e0!3m2!1sfr!2s!4v1707600000000!5m2!1sfr!2s"
                 className="w-full h-full grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                 allowFullScreen
                 loading="lazy"
               />
            </div>
         </div>
      </section>

    </main>
  );
}

function Card({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
   return (
      <div className="p-16 border border-white/5 bg-[#111110] group hover:border-[#C9A84C]/30 transition-all">
         <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-10 group-hover:scale-110 transition-transform border border-white/5">
            {icon}
         </div>
         <h4 className="text-3xl font-bricolage font-bold text-[#F5F2EC] mb-8">{title}</h4>
         <p className="text-[#F5F2EC]/40 font-outfit font-light leading-relaxed">{text}</p>
      </div>
   );
}