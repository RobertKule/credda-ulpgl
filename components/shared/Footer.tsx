// components/shared/Footer.tsx
"use client";

import { Link, usePathname } from "../../navigation"; 
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('Footer');
  
  const expertiseItems = t.raw('expertise.items');
  const resourceItems = t.raw('resources.items');

  return (
    <footer className="bg-background text-foreground pt-32 pb-12 border-t border-border overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Identity */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Link href="/" className="flex flex-col group" aria-label="CREDDA CDE Home">
                <span className="font-bricolage font-extrabold text-3xl tracking-tighter text-foreground">
                  CREDDA<span className="text-primary">·</span>CDE
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] font-outfit font-medium text-muted-foreground mt-2">
                  {t('identity.badge')}
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed font-outfit font-light max-w-xs">
                {t('identity.description')}
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" }
              ].map(({ Icon, label }, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-12 h-12 border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-500 group"
                  aria-label={`Follow us on ${label}`}
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Expertise */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-primary">
              {t('expertise.title')}
            </h4>
    <ul className="space-y-5">
      {Array.isArray(expertiseItems) && expertiseItems.map((item: string) => (
        <li key={item} className="group">
          <Link href="/research" className="text-sm text-muted-foreground hover:text-primary transition-all flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* Column 3: Resources */}
  <div className="space-y-10">
    <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-primary">
      {t('resources.title')}
    </h4>
    <ul className="space-y-5 text-sm text-muted-foreground">
      {Array.isArray(resourceItems) && resourceItems.map((item: { label: string; href: string }, index: number) => (
        <li key={index}>
          <Link 
            href={item.href} 
            className="hover:text-primary flex items-center justify-between group transition-all"
          >
            <span className="font-light">{item.label}</span>
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </Link>
        </li>
      ))}
              <li className="pt-4">
                <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 text-[10px] font-outfit font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                  {t('resources.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-outfit font-bold uppercase tracking-[0.3em] text-primary">
              {t('contact.title')}
            </h4>
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                  <MapPin size={18} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground font-outfit font-light leading-relaxed">
                  {t('contact.address.line1')} <br /> {t('contact.address.line2')}
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                  <Phone size={18} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <a href={`tel:${t('contact.phone')}`} className="text-sm text-muted-foreground font-outfit font-light hover:text-foreground transition-colors">
                  {t('contact.phone')}
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                  <Mail size={18} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <a href={`mailto:${t('contact.email')}`} className="text-sm text-muted-foreground font-outfit font-light hover:text-foreground transition-colors">
                  {t('contact.email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-outfit font-medium">
              {t('bottom.copyright', { year: currentYear })}
            </p>
            <div className="flex gap-8 text-[9px] uppercase font-outfit font-bold text-muted-foreground/40 tracking-[0.3em]">
              <Link href="/legal" className="hover:text-primary transition-colors">{t('bottom.legal')}</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">{t('bottom.privacy')}</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-muted border border-border flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
               <span className="text-[9px] uppercase font-outfit font-bold text-muted-foreground tracking-widest">
                 {t('bottom.system')}
               </span>
            </div>
            <div className="text-[10px] font-outfit font-medium text-muted-foreground/40 uppercase tracking-widest">
              {t('bottom.affiliation')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}