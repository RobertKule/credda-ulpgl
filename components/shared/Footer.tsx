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
    <footer className="bg-[#050a15] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Colonne 1: Identité */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-3xl font-serif font-bold tracking-tighter">
                CREDDA<span className="text-blue-500">.ULPGL</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs">
                {t('identity.description')}
              </p>
            </div>
            <div className="flex gap-5">
              <a 
                href="https://facebook.com/creddaulpgl" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com/creddaulpgl" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-400 transition-all"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://linkedin.com/company/credda-ulpgl" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-800 transition-all"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2: Expertise */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              {t('expertise.title')}
            </h4>
            <ul className="space-y-4">
              {expertiseItems.map((item: string) => (
                <li key={item} className="group">
                  <Link href="/research" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Navigation Rapide */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              {t('resources.title')}
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              {resourceItems.map((item: { label: string; href: string }, index: number) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="hover:text-white flex items-center justify-between group"
                  >
                    {item.label} 
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-blue-400 font-bold italic mt-4 block hover:text-blue-300 transition-colors">
                  {t('resources.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              {t('contact.title')}
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  {t('contact.address.line1')} <br /> {t('contact.address.line2')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <a 
                  href="tel:+243812345678" 
                  className="text-sm text-slate-400 font-light hover:text-white transition-colors"
                >
                  {t('contact.phone')}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <a 
                  href="mailto:contact@credda-ulpgl.org" 
                  className="text-sm text-slate-400 font-light hover:text-white transition-colors"
                >
                  {t('contact.email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {t('bottom.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-6 text-[9px] uppercase font-bold text-slate-600 tracking-widest">
              <a 
                href="/legal" 
                className="hover:text-blue-400 transition-colors"
              >
                {t('bottom.legal')}
              </a>
              <a 
                href="/privacy" 
                className="hover:text-blue-400 transition-colors"
              >
                {t('bottom.privacy')}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">
               {t('bottom.system')}
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}