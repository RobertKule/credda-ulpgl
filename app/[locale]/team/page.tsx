// app/[locale]/team/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import { Users, Mail, Linkedin, ChevronRight, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import EditorialPageHero from "@/components/shared/EditorialPageHero";
import StandardGlobalCTA from "@/components/shared/StandardGlobalCTA";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "team");
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TeamPage' });
  const t_cta = await getTranslations({ locale, namespace: 'HomePage.cta' });

  interface MemberPageSqlResult {
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    email?: string | null;
    order: number;
    translations: { role: string; bio: string }[];
  }

  const members = (await sql`
    SELECT m.*, 
      (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
    FROM "Member" m
    ORDER BY m."order" ASC
  `.catch(() => [])) as MemberPageSqlResult[];

  return (
    <main className="min-h-screen bg-background pb-0 selection:bg-primary selection:text-primary-foreground">
      {/* 1. STANDARDIZED HERO */}
      <EditorialPageHero 
        title={(t.raw('header.title') as string).replace(/<span>|<\/span>/g, '')}
        subtitle={t('header.description')}
        badge={t('header.badge')}
      />

      {/* 2. STATS BAR (SUBTLE) */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-6 py-8 flex justify-center lg:justify-start gap-12">
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-primary leading-none">{members.length}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50">Chercheurs</span>
          </div>
          <div className="w-[1px] h-10 bg-border/50" />
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-primary leading-none">24+</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50">Expertises</span>
          </div>
        </div>
      </div>

      {/* 3. TEAM GRID */}
      <section className="py-24 lg:py-32 px-6">
        <div className="container mx-auto">
          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {members.map((member, i) => {
                const content = member.translations?.[0] || { role: "Chercheur", bio: "" };
                return (
                  <ScrollReveal key={member.id} delay={i * 0.08}>
                    <MemberCard member={member} content={content} locale={locale} />
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="py-40 text-center border border-dashed border-border/50 rounded-md bg-muted/10">
               <SearchX size={64} className="mx-auto text-muted-foreground/20 mb-8" />
               <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{t('empty.title')}</h3>
               <p className="text-muted-foreground font-light max-w-sm mx-auto">{t('empty.description')}</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. STANDARDIZED GLOBAL CTA */}
      <StandardGlobalCTA 
        title={(t_cta.raw('title') as string).replace(/<span>|<\/span>/g, '')}
        subtitle={t_cta('collaboration')}
        buttonText={t_cta('partner')}
        href="/contact"
      />
    </main>
  );
}

function MemberCard({ member, content, locale }: { member: any; content: any; locale: string }) {
  return (
    <div className="group relative p-4 sm:p-5 rounded-md bg-card/40 shadow-sm border border-border/10 transition-all duration-700 hover:shadow-lg hover:shadow-primary/10 hover:bg-card hover:border-border/40 z-0 flex flex-col gap-5">
      {/* Animated Expanding Borders */}
      <div className="absolute inset-0 z-20 pointer-events-none rounded-md overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-primary/60 transition-all duration-500 ease-out group-hover:w-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-primary/60 transition-all duration-500 ease-out group-hover:w-full" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[2px] h-0 bg-primary/60 transition-all duration-500 ease-out group-hover:h-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] h-0 bg-primary/60 transition-all duration-500 ease-out group-hover:h-full" />
      </div>

      <Link href={`/${locale}/team/${member.slug}`} className="block relative z-10 w-full shrink-0">
        <div className="relative aspect-[3/2] overflow-hidden bg-muted/20 border border-border/50 rounded-md shadow-sm group-hover:shadow-none transition-shadow duration-500">
          {member.image ? (
            <Image
              src={member.image.replace(/\\/g, '/').replace(/^public\//, '/')}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-[center_15%] grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/30">
              <Users size={60} strokeWidth={0.5} className="text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <div className="flex flex-col gap-3 px-2 flex-grow relative z-10">
        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-wider text-primary/70 line-clamp-1 truncate w-full" title={content.role}>
            {content.role}
          </p>
          <Link href={`/${locale}/team/${member.slug}`}>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate w-full" title={member.name}>
              {member.name}
            </h2>
          </Link>
        </div>

        <div className="h-[1px] w-8 bg-primary/30 transition-all group-hover:w-full duration-700 my-1" />

        {/* Links Only */}
        <div className="flex items-center gap-4 mt-auto pt-2">
          {member.email && (
            <a href={`mailto:${member.email}`} className="text-muted-foreground/50 hover:text-primary transition-colors">
              <Mail size={16} />
            </a>
          )}
          {member.linkedin && (
             <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-primary transition-colors">
               <Linkedin size={16} />
             </a>
          )}
        </div>
      </div>
    </div>
  );
}