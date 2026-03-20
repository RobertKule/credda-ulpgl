// components/shared/Footer.tsx
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
    <footer className="bg-[#0C0C0A] text-[#F5F2EC] pt-32 pb-12 border-t border-white/5 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Identity */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Link href="/" className="flex flex-col group">
                <span className="font-bricolage font-extrabold text-3xl tracking-tighter text-[#F5F2EC]">
                  CREDDA<span className="text-[#C9A84C]">·</span>CDE
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-outfit font-medium text-[#F5F2EC]/40 mt-2">
                  {t('identity.badge')}
                </span>
              </Link>
              <p className="text-[#F5F2EC]/60 text-sm leading-relaxed font-outfit font-light max-w-xs">
                {t('identity.description')}
              </p>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-12 h-12 border border-white/5 flex items-center justify-center hover:bg-[#C9A84C] hover:border-[#C9A84C] hover:text-[#0C0C0A] transition-all duration-500 group"
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Expertise */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              {t('expertise.title')}
            </h4>
            <ul className="space-y-5">
              {expertiseItems.map((item: string) => (
                <li key={item} className="group">
                  <Link href="/research" className="text-sm text-[#F5F2EC]/50 hover:text-[#C9A84C] transition-all flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              {t('resources.title')}
            </h4>
            <ul className="space-y-5 text-sm text-[#F5F2EC]/50">
              {resourceItems.map((item: { label: string; href: string }, index: number) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="hover:text-[#C9A84C] flex items-center justify-between group transition-all"
                  >
                    <span className="font-light">{item.label}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-[#C9A84C]/20 text-[10px] font-outfit font-bold uppercase tracking-widest text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0C0C0A] transition-all">
                  {t('resources.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              {t('contact.title')}
            </h4>
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C9A84C] transition-all duration-500">
                  <MapPin size={18} className="text-[#C9A84C] group-hover:text-[#0C0C0A] transition-colors" />
                </div>
                <p className="text-sm text-[#F5F2EC]/60 font-outfit font-light leading-relaxed">
                  {t('contact.address.line1')} <br /> {t('contact.address.line2')}
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C9A84C] transition-all duration-500">
                  <Phone size={18} className="text-[#C9A84C] group-hover:text-[#0C0C0A] transition-colors" />
                </div>
                <a href={`tel:${t('contact.phone')}`} className="text-sm text-[#F5F2EC]/60 font-outfit font-light hover:text-[#F5F2EC] transition-colors">
                  {t('contact.phone')}
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#C9A84C] transition-all duration-500">
                  <Mail size={18} className="text-[#C9A84C] group-hover:text-[#0C0C0A] transition-colors" />
                </div>
                <a href={`mailto:${t('contact.email')}`} className="text-sm text-[#F5F2EC]/60 font-outfit font-light hover:text-[#F5F2EC] transition-colors">
                  {t('contact.email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <p className="text-[10px] text-[#F5F2EC]/30 uppercase tracking-[0.2em] font-outfit font-medium">
              {t('bottom.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-8 text-[9px] uppercase font-outfit font-bold text-[#F5F2EC]/20 tracking-[0.3em]">
              <Link href="/legal" className="hover:text-[#C9A84C] transition-colors">{t('bottom.legal')}</Link>
              <Link href="/privacy" className="hover:text-[#C9A84C] transition-colors">{t('bottom.privacy')}</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-white/5 border border-white/5 flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
               <span className="text-[9px] uppercase font-outfit font-bold text-[#F5F2EC]/40 tracking-widest">
                 {t('bottom.system')}
               </span>
            </div>
            <div className="text-[10px] font-outfit font-medium text-[#F5F2EC]/20 uppercase tracking-widest">
              {t('bottom.affiliation')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}