// app/[locale]/team/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/navigation";
import { 
  Mail, 
  Linkedin, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Globe, 
  Users,
  Backpack,
  GraduationCap,
  Microscope
} from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const member = await db.member.findUnique({
    where: { slug }
  });

  if (!member) return { title: "Membre non trouvé" };

  return {
    title: `${member.name} | CREDDA`,
    description: `Profil de ${member.name}, expert au CREDDA.`
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TeamPage' });

  const member = await db.member.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { language: locale }
      }
    }
  });

  if (!member) notFound();

  const content = member.translations[0] || { role: "Chercheur", bio: "" };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      {/* --- NAVIGATION BREADCRUMBS --- */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Link 
          href="/team" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {t('detail.backToTeam')}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* --- LEFT COLUMN: PHOTO & BASIC INFO --- */}
        <aside className="lg:col-span-4 space-y-12">
          <ScrollReveal>
             <div className="relative aspect-[3/4] bg-card border border-border overflow-hidden shadow-2xl group">
                {member.image ? (
                  <Image 
                    src={member.image.replace(/\\/g, '/').replace(/^public\//, '/')} 
                    alt={member.name} 
                    fill 
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <Users size={160} strokeWidth={0.5} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="space-y-8">
             <div className="bg-card border border-border p-8 space-y-6 shadow-sm">
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary border-b border-border pb-4 italic">
                      {t('detail.contactTitle')}
                   </h3>
                   {member.email && (
                     <div className="flex items-center gap-4 group">
                        <div className="p-2 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all rounded-md">
                           <Mail size={16} />
                        </div>
                        <a href={`mailto:${member.email}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                           {member.email}
                        </a>
                     </div>
                   )}
                   <div className="flex items-center gap-4 group">
                      <div className="p-2 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all rounded-md">
                         <Linkedin size={16} />
                      </div>
                      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                         LinkedIn Profile
                      </a>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary border-b border-border pb-4 italic">
                      {t('detail.expertiseTitle')}
                   </h3>
                   <div className="flex flex-wrap gap-2">
                       <Badge variant="outline" className="border-border px-3 py-1 font-outfit text-[9px] uppercase tracking-wider text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-default">Droit de l'Environnement</Badge>
                       <Badge variant="outline" className="border-border px-3 py-1 font-outfit text-[9px] uppercase tracking-wider text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-default">Développement Durable</Badge>
                       <Badge variant="outline" className="border-border px-3 py-1 font-outfit text-[9px] uppercase tracking-wider text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-default">Grands Lacs</Badge>
                   </div>
                </div>
             </div>
          </ScrollReveal>
        </aside>

        {/* --- RIGHT COLUMN: BIO & ACHIEVEMENTS --- */}
        <section className="lg:col-span-8 space-y-16">
          <ScrollReveal direction="right">
             <div className="space-y-4 mb-12">
                <span className="text-primary font-outfit font-black uppercase tracking-[0.4em] text-[11px] block animate-pulse">
                   CREDDA Researcher
                </span>
                <h1 className="text-5xl md:text-7xl font-fraunces font-black text-foreground leading-[1.05]">
                   {member.name}
                </h1>
                <p className="text-2xl font-serif italic text-muted-foreground/60 max-w-2xl">
                   {content.role}
                </p>
             </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="space-y-12">
             <div className="prose prose-invert max-w-none">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground border-l-4 border-primary pl-6 mb-8">
                   {t('detail.biographyTitle')}
                </h3>
                <div className="text-lg text-muted-foreground font-outfit font-light leading-relaxed space-y-6">
                   {content.bio ? (
                     content.bio.split('\n').map((para, i) => (
                       <p key={i}>{para}</p>
                     ))
                   ) : (
                     <p className="italic opacity-40">Aucune biographie disponible pour ce membre.</p>
                   )}
                </div>
             </div>

             {/* BENTO GRID INFOS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 bg-card border border-border space-y-4 hover:border-primary/30 transition-all group">
                   <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                      <GraduationCap size={24} />
                   </div>
                   <h4 className="font-serif font-black uppercase text-xs tracking-widest text-foreground">Formation Académique</h4>
                   <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      Expert en droit international avec une spécialisation sur les ressources naturelles en Afrique Centrale.
                   </p>
                </div>
                
                <div className="p-8 bg-card border border-border space-y-4 hover:border-primary/30 transition-all group">
                   <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                      <Microscope size={24} />
                   </div>
                   <h4 className="font-serif font-black uppercase text-xs tracking-widest text-foreground">Axes de Recherche</h4>
                   <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      Conflits fonciers, préservation environnementale et politiques climatiques régionales.
                   </p>
                </div>
             </div>
          </ScrollReveal>
        </section>

      </div>
    </main>
  );
}
