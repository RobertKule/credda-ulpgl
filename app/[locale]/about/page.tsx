// app/[locale]/about/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Target,
  Globe2, GraduationCap, ArrowRight,
  ShieldCheck, Award, Users2, MapPin
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { key: 'excellence', icon: <Award className="text-blue-600" size={24} /> },
    { key: 'neutrality', icon: <ShieldCheck className="text-emerald-600" size={24} /> },
    { key: 'engagement', icon: <Users2 className="text-slate-900" size={24} /> },
    { key: 'innovation', icon: <GraduationCap className="text-purple-600" size={24} /> },
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* --- 1. HERO SECTION WITH INLINE VIDEO --- */}
      <section className="relative pt-32 pb-24 bg-[#050a15]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />

        <div className="relative z-10 container mx-auto px-6 space-y-16">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-6 py-2 uppercase tracking-[0.4em] text-[10px] mb-8 shadow-xl">
                {t('since')} 2008
              </Badge>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-serif font-bold text-white leading-[1.1] mb-6">
                {t('hero.title1')} <span className="text-blue-500 italic font-light">{t('hero.title2')}</span> <br />
                {t('hero.title3')}
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="w-full max-w-6xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-[0_20px_100px_rgba(37,99,235,0.2)] relative border border-white/10 group"
          >
            <div className="absolute inset-0 bg-blue-900/20 pointer-events-none group-hover:bg-transparent transition-colors duration-700 z-10" />
            <iframe
              src="https://www.youtube.com/embed/V-MVLqjQMIc?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0&loop=1&playlist=V-MVLqjQMIc"
              className="absolute inset-0 w-full h-full border-none scale-105"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      {/* --- 2. SECTION HISTOIRE & MOSAÏQUE --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          <div className="lg:col-span-6 relative h-[700px] w-full group">
            <GSAPReveal direction="left" delay={0.2} className="w-full h-full">
              <div className="absolute top-0 right-0 w-4/5 h-[80%] shadow-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 origin-top-right group-hover:scale-[1.02]">
                <Image src="/images/director3.webp" alt="ULPGL Research" fill className="object-cover" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-0" />
              </div>
              <div className="absolute bottom-0 left-0 w-2/3 h-2/3 border-[12px] border-white shadow-2xl overflow-hidden z-20 grayscale-[50%] group-hover:grayscale-0 transition-all duration-1000 origin-bottom-left group-hover:scale-[1.05]">
                <Image src="/images/director3.webp" alt="Field Work" fill className="object-cover" />
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute top-1/2 left-[-30px] bg-[#050a15] p-10 text-white z-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hidden md:block"
              >
                <div className="text-6xl font-serif font-bold text-blue-500 mb-2">25+</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 leading-relaxed max-w-[120px]">{t('years_excellence')}</p>
              </motion.div>
            </GSAPReveal>
          </div>

          <div className="lg:col-span-6 space-y-12">
            <GSAPReveal direction="up" delay={0.2} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-blue-600" />
                <h2 className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">{t('who_we_are')}</h2>
              </div>
              <h3 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-[1.1]">
                {t('mission_title')} <br /><span className="italic text-slate-500 font-light">{t('mission_italic')}</span>.
              </h3>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.4}>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                {t('mission_description')}
              </p>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.6}>
              <ul className="space-y-6">
                {t.raw('achievements').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-5 text-slate-700 text-lg font-light">
                    <div className="mt-1 bg-blue-50 p-2 rounded-full shrink-0">
                      <CheckCircle2 className="text-blue-600" size={20} strokeWidth={2.5} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.8}>
              <Button asChild size="lg" className="bg-[#050a15] hover:bg-blue-600 rounded-none h-16 px-12 shadow-2xl transition-all duration-300 group mt-4">
                <Link href="/contact" className="uppercase font-black tracking-widest text-[11px] flex gap-4 items-center">
                  <span>{t('contact_us')}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </GSAPReveal>
          </div>
        </div>
      </section>

      {/* --- 3. MISSION, VISION & VALEURS (CARDS) --- */}
      <section className="py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <GSAPReveal direction="up" className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <Badge className="bg-transparent text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 uppercase text-[10px] font-black tracking-[0.3em]">
              {t('compass')}
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
              {t('mission_vision_title')}
            </h2>
          </GSAPReveal>

          <div className="grid md:grid-cols-3 gap-0 border border-slate-200 bg-white">
            <GSAPReveal direction="up" delay={0.2} className="p-16 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-blue-50/50 transition-colors duration-500 group">
              <Target size={48} className="text-blue-600 mb-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
              <h4 className="text-3xl font-serif font-bold text-slate-900 mb-6">{t('mission')}</h4>
              <p className="text-slate-500 font-light leading-relaxed text-lg">{t('mission_text')}</p>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.4} className="p-16 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-emerald-50/50 transition-colors duration-500 group">
              <Globe2 size={48} className="text-emerald-600 mb-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
              <h4 className="text-3xl font-serif font-bold text-slate-900 mb-6">{t('vision')}</h4>
              <p className="text-slate-500 font-light leading-relaxed text-lg">{t('vision_text')}</p>
            </GSAPReveal>

            <GSAPReveal direction="up" delay={0.6} className="p-16 hover:bg-slate-50 transition-colors duration-500 group">
              <ShieldCheck size={48} className="text-slate-900 mb-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
              <h4 className="text-3xl font-serif font-bold text-slate-900 mb-6">{t('values')}</h4>
              <p className="text-slate-500 font-light leading-relaxed text-lg">{t('values_text')}</p>
            </GSAPReveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 bg-slate-200 border border-slate-200">
            {values.map((value, idx) => (
              <GSAPReveal key={idx} direction="up" delay={0.2 + (idx * 0.1)} className="flex flex-col items-center justify-center p-12 bg-white hover:bg-slate-50 transition-colors">
                <div className="mb-6 scale-125 opacity-80">
                  {value.icon}
                </div>
                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  {t(`values_list.${value.key}`)}
                </h5>
              </GSAPReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. SECTION CARTE --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-5 space-y-10">
            <GSAPReveal direction="left" delay={0.2} className="space-y-6">
              <div className="flex items-center gap-4 text-blue-600">
                <MapPin size={24} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('location')}</span>
              </div>
              <h3 className="text-4xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight">
                {t('find_us')}
              </h3>
            </GSAPReveal>

            <GSAPReveal direction="left" delay={0.4}>
              <p className="text-xl text-slate-500 font-light leading-relaxed">
                {t('location_description')}
              </p>
            </GSAPReveal>

            <GSAPReveal direction="left" delay={0.6} className="pt-8 border-t border-slate-200">
              <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-4">{t('address')}</p>
              <p className="text-slate-600 text-lg font-light italic leading-relaxed">
                {t.raw('full_address').map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {line}<br />
                  </React.Fragment>
                ))}
              </p>
            </GSAPReveal>
          </div>

          <div className="lg:col-span-7">
            <GSAPReveal direction="right" delay={0.4} className="h-[600px] w-full bg-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.1)] relative border-[16px] border-white group overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.102660144983!2d29.21980311475458!3d-1.6836423987723048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f81d11e5f8f%3A0xc36e3c5443c7b3c2!2sULPGL%20Salomon!5e0!3m2!1sfr!2s!4v1707600000000!5m2!1sfr!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105"
              />
            </GSAPReveal>
          </div>
        </div>
      </section>

      {/* --- 5. STATISTIQUES --- */}
      <section className="py-24 bg-[#050a15] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 divide-x divide-white/10 border-y border-white/10 py-16">
            {[
              { key: 'years', value: '25+' },
              { key: 'publications', value: '450+' },
              { key: 'partners', value: '30+' },
              { key: 'beneficiaries', value: '12K+' }
            ].map((stat, idx) => (
              <GSAPReveal key={idx} direction="up" delay={0.2 + (idx * 0.1)} className="text-center px-4">
                <div className="text-5xl lg:text-7xl font-serif font-bold text-blue-400 mb-6">{stat.value}</div>
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-widest text-slate-400">
                  {t(`stats.${stat.key}`)}
                </div>
              </GSAPReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. CTA FINAL --- */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-16 px-6">
          <GSAPReveal direction="up" delay={0.2}>
            <h2 className="text-5xl lg:text-7xl font-serif font-bold italic tracking-tight text-slate-900">
              {t('cta_title')}
            </h2>
          </GSAPReveal>
          <GSAPReveal direction="up" delay={0.4} className="flex flex-wrap justify-center gap-6">
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 rounded-none h-16 px-14 uppercase font-black tracking-widest text-[11px] hover:bg-blue-700 shadow-xl shadow-blue-600/30">
                {t('become_partner')}
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="outline" size="lg" className="border-slate-200 text-slate-900 hover:text-white hover:bg-[#050a15] hover:border-[#050a15] rounded-none h-16 px-14 uppercase font-black tracking-widest text-[11px] transition-all duration-300">
                {t('meet_team')}
              </Button>
            </Link>
          </GSAPReveal>
        </div>
      </section>

    </main>
  );
}