// app/[locale]/contact/page.tsx
import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";
import EditorialPageHero from "@/components/shared/EditorialPageHero";
import StandardGlobalCTA from "@/components/shared/StandardGlobalCTA";
import ContactForm from "@/components/contact/ContactForm";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const t_cta = await getTranslations({ locale, namespace: 'GlobalCTA' });

  // Prepare translations for the Client Component
  const formTranslations = {
    identity: t('form.fields.name.label'),
    contact: t('form.fields.email.label'),
    subject: t('form.fields.subject.label'),
    message: t('form.fields.message.label'),
    submit: t('form.submit'),
    success: t('form.success.title'),
    successMessage: t('form.success.description'),
    new: t('form.success.button'),
    official: t('form.title'),
    secure: "SECURE PROTOCOL"
  };

  return (
    <main className="min-h-screen bg-background pb-0 selection:bg-primary selection:text-primary-foreground">
      {/* 1. STANDARDIZED HERO */}
      <EditorialPageHero 
        title={t('header.title').replace(/<span>|<\/span>/g, '')}
        subtitle={t('header.description')}
        badge={t('header.badge')}
      />

      {/* 2. CONTACT CONTENT */}
      <section className="py-24 lg:py-32 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            
            {/* LEFT: INFO GRID */}
            <div className="lg:col-span-5 space-y-16">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-[1.1]">
                  Liaison <br /> <span className="text-primary italic">Institutionnelle</span>
                </h2>
                <p className="text-muted-foreground font-light leading-relaxed max-w-sm">
                  Le secrétariat du CREDDA assure une orientation rapide pour vos requêtes scientifiques, cliniques ou vos propositions de partenariat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border/50">
                <ContactInfoCard 
                  icon={<MapPin size={18} />} 
                  title="Campus" 
                  content="Campus Salomon, Himbi, Goma" 
                />
                <ContactInfoCard 
                  icon={<Mail size={18} />} 
                  title="Official Mail" 
                  content="creddaulpgl08@gmail.com" 
                />
                <ContactInfoCard 
                  icon={<Phone size={18} />} 
                  title="Contact" 
                  content="+243 812 345 678" 
                />
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="lg:col-span-7">
              <ContactForm t={formTranslations} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STANDARDIZED GLOBAL CTA */}
      <StandardGlobalCTA 
        title={t_cta('title').replace(/<span>|<\/span>/g, '')}
        subtitle={t_cta('collaboration')}
        buttonText={"Explorer les Publications"}
        href="/publications"
      />
    </main>
  );
}

function ContactInfoCard({ icon, title, content }: { icon: any, title: string, content: string }) {
  return (
    <div className="space-y-4 group">
      <div className="w-12 h-12 bg-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 rounded-md">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/40">{title}</h4>
        <p className="text-sm font-bold text-foreground leading-relaxed tracking-tight">{content}</p>
      </div>
    </div>
  );
}