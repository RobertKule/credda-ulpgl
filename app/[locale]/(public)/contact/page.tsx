import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import React from "react";
import EditorialPageHero from "@/components/shared/EditorialPageHero";
import ContactForm from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/button";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  const formTranslations = {
    fields: {
      name: { label: t('form.fields.name.label'), placeholder: t('form.fields.name.placeholder') },
      email: { label: t('form.fields.email.label'), placeholder: t('form.fields.email.placeholder') },
      subject: { label: t('form.fields.subject.label'), placeholder: t('form.fields.subject.placeholder') },
      requestType: {
        label: t('form.fields.requestType.label'),
        placeholder: t('form.fields.requestType.placeholder'),
        options: {
          collaboration: t('form.fields.requestType.options.collaboration'),
          research: t('form.fields.requestType.options.research'),
          clinic: t('form.fields.requestType.options.clinic'),
          publication: t('form.fields.requestType.options.publication'),
          event: t('form.fields.requestType.options.event'),
          other: t('form.fields.requestType.options.other')
        }
      },
      message: { label: t('form.fields.message.label'), placeholder: t('form.fields.message.placeholder') }
    },
    submit: t('form.submit'),
    submitting: t('form.submitting'),
    success: {
      title: t('form.success.title'),
      description: t('form.success.description'),
      button: t('form.success.button')
    },
    title: t('form.title'),
    secure: t('form.secure')
  };

  return (
    <main className="min-h-screen bg-background pb-0 selection:bg-primary selection:text-primary-foreground">
      {/* 1. STANDARDIZED HERO */}
      <EditorialPageHero 
        title={(t.raw('header.title') as string).replace(/<span>|<\/span>/g, '')}
        subtitle={t('header.description')}
        badge={t('header.badge')}
      />

      {/* 2 & 3 & 4. CONTACT LAYOUT */}
      <section className="py-24 lg:py-32 px-6 relative" id="form-section">
        <div className="container mx-auto max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center mb-20 lg:mb-32">
            
            {/* LEFT: INFO & MAP */}
            <div className="lg:col-span-5 space-y-12">
               {/* Quick Infos Title */}
               <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-[1.1]">
                    {t('info.title')}
                  </h2>
               </div>

               {/* Info Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ContactInfoCard icon={<MapPin size={28} />} title={t('info.items.address.title')} content={t('info.items.address.value')} />
                  <ContactInfoCard icon={<Phone size={28} />} title={t('info.items.phone.title')} content={t('info.items.phone.value')} />
                  <ContactInfoCard icon={<Mail size={28} />} title={t('info.items.email.title')} content={t('info.items.email.value')} />
                  <ContactInfoCard icon={<Clock size={28} />} title={t('info.items.hours.title')} content={t('info.items.hours.value')} />
               </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="lg:col-span-7">
               <ContactForm t={formTranslations} />
            </div>

          </div>
        </div>
      </section>

      {/* 4. MAP SECTION */}
      <section className="py-24 pb-0 bg-card/30 border-t border-border/30 relative">
        <div className="container mx-auto px-6 max-w-7xl mb-12 flex flex-col items-center text-center space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('map.title')}</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Nous Trouver
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t('map.description')}
          </p>
        </div>

        {/* Clear, interactive Map Block spanning full width of the screen */}
        <div className="w-full h-[500px] lg:h-[700px] bg-muted/50 border-y border-border/50 relative z-10 shadow-inner">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15953.522818968944!2d29.2152!3d-1.6883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd0f735c03f443%3A0xc6cb1c7e9c32f8eb!2sUniversit%C3%A9%20Libre%20des%20Pays%20des%20Grands%20Lacs!5e0!3m2!1sen!2scd!4v1700000000000!5m2!1sen!2scd"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(30%) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 5. SECTION CTA FINAL */}
      <section className="py-32 bg-primary/5 border-t border-primary/10 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <h2 
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-foreground max-w-4xl mx-auto leading-[1.1] tracking-tight"
            dangerouslySetInnerHTML={{ __html: (t.raw('cta.title') as string).replace('<span>', '<span class="text-primary italic inline-block hover:scale-105 transition-transform cursor-default">') }}
          />
          <Button asChild className="h-14 lg:h-16 px-8 lg:px-12 rounded-full bg-primary text-primary-foreground text-[10px] lg:text-xs font-black tracking-[0.2em] uppercase hover:scale-[1.02] transition-transform shadow-2xl shadow-primary/20 group">
             <a href="#form-section">
               {t('cta.button')}
             </a>
          </Button>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      </section>

    </main>
  );
}

function ContactInfoCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="relative group p-[1px] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
      {/* Animated Border Beam */}
      <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(22,101,52,0.8)_360deg)] opacity-0 group-hover:opacity-100 group-hover:animate-border-beam transition-opacity duration-500 pointer-events-none" />
      
      {/* Inner Card */}
      <div className="relative z-10 p-6 lg:p-8 bg-card/80 backdrop-blur-xl h-full min-h-[200px] rounded-[11px] flex flex-col justify-center gap-5 border border-border/40 group-hover:border-transparent transition-colors duration-500 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 w-16 h-16 bg-muted/50 border border-border/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:scale-110 transition-all duration-500 rounded-xl">
          {icon}
        </div>
        <div className="relative z-10 space-y-1.5">
          <h4 className="text-[11px] uppercase font-bold tracking-[0.15em] text-muted-foreground/60 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-sm font-medium text-foreground leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}