// components/Footer.tsx
"use client";

import { Link } from "../../navigation"; 
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Footer');
  
  const expertiseItems = t.raw('expertise.items');
  const resourceItems = t.raw('resources.items');

  return (
    <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Colonne 1: Identité */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Link href="/" className="flex flex-col group">
                <div className="flex items-end gap-1">
                  <span className="font-heading font-black tracking-tighter text-2xl lg:text-3xl text-white">
                    CREDDA
                  </span>
                  <span className="font-serif font-black italic text-accent text-xl lg:text-2xl text-accent">
                    ULPGL
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40 mt-1">
                  {t('identity.badge')}
                </span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed font-light max-w-xs">
                {t('identity.description')}
              </p>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-none border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2: Expertise */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              {t('expertise.title')}
            </h4>
            <ul className="space-y-5">
              {expertiseItems.map((item: string) => (
                <li key={item} className="group">
                  <Link href="/research" className="text-sm text-white/50 hover:text-white transition-all flex items-center gap-3">
                    <span className="w-1 h-1 bg-accent scale-0 group-hover:scale-100 transition-transform duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Ressources */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              {t('resources.title')}
            </h4>
            <ul className="space-y-5 text-sm text-white/50">
              {resourceItems.map((item: { label: string; href: string }, index: number) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="hover:text-accent flex items-center justify-between group transition-all"
                  >
                    <span className="font-medium">{item.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                  {t('resources.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              {t('contact.title')}
            </h4>
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-500">
                  <MapPin size={18} className="text-accent group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {t('contact.address.line1')} <br /> {t('contact.address.line2')}
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-500">
                  <Phone size={18} className="text-accent group-hover:text-primary transition-colors" />
                </div>
                <a href="tel:+243812345678" className="text-sm text-white/60 font-light hover:text-white transition-colors">
                  {t('contact.phone')}
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-all duration-500">
                  <Mail size={18} className="text-accent group-hover:text-primary transition-colors" />
                </div>
                <a href="mailto:contact@credda-ulpgl.org" className="text-sm text-white/60 font-light hover:text-white transition-colors">
                  {t('contact.email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-12">
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">
              {t('bottom.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-8 text-[9px] uppercase font-bold text-white/40 tracking-[0.3em]">
              <a href="/legal" className="hover:text-accent transition-colors">{t('bottom.legal')}</a>
              <a href="/privacy" className="hover:text-accent transition-colors">{t('bottom.privacy')}</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
               <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
               <span className="text-[9px] uppercase font-black text-white/40 tracking-widest italic">
                 {t('bottom.system')}
               </span>
            </div>
            <div className="text-[10px] font-heading font-bold text-white/20">
              {t('bottom.affiliation')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}