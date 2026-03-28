// app/[locale]/team/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { sql } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Mail, Linkedin, Users, GraduationCap,
  SearchX, Globe, ChevronRight, Award
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
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

  // Optimization: catch error to avoid total page crash
  const members = (await sql`
    SELECT m.*, 
      (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
    FROM "Member" m
    ORDER BY m."order" ASC
  `.catch((err) => {
    console.error("Team DB Fetch Error:", err);
    return [];
  })) as any[];

  return (
    <main className="min-h-screen bg-background py-24 px-6 lg:px-12">
      {/* --- HEADER --- */}
      <section style={{ padding: '80px 40px 64px', borderBottom: '1px solid rgba(245,242,236,0.07)', marginBottom: '80px' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16">
          <ScrollReveal>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: '9px', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>
              CREDDA · Équipe
            </p>
            <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.1 }}>
              Nos Chercheurs <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>& Experts</em>
            </h1>
          </ScrollReveal>
          
          <div className="hidden lg:flex items-center gap-8">
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-[#C9A84C]">{members.length}</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-muted-foreground/30">Chercheurs</p>
             </div>
             <div className="w-[1px] h-12 bg-border/40" />
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-[#C9A84C]">24</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-muted-foreground/30">Expertises</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- GRID ÉQUIPE --- */}
      <section className="max-w-7xl mx-auto">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 px-6">
            {members.map((member: any, i: number) => {
              const content = member.translations?.[0] || { role: "Chercheur", bio: "" };

              return (
                <ScrollReveal key={member.id} delay={i * 0.08}>
                <div className="group">
                  {/* Photo Profile */}
                  <Link href={`/${locale}/team/${member.slug}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-card border border-border mb-8 shadow-2xl">
                      {member.image ? (
                        <Image
                          src={member.image.replace(/\\/g, '/').replace(/^public\//, '/')}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5">
                          <Users size={120} strokeWidth={0.5} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent opacity-60" />
                    </div>
                  </Link>

                  {/* Infos */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <span className="text-[10px] font-outfit font-bold uppercase tracking-[0.3em] text-primary">
                        {content.role}
                      </span>
                      <Link href={`/${locale}/team/${member.slug}`}>
                        <h2 className="text-3xl font-bricolage font-bold text-foreground group-hover:text-primary transition-colors">
                          {member.name}
                        </h2>
                      </Link>
                    </div>

                    <div className="h-[1px] w-12 bg-primary transition-all group-hover:w-full duration-700" />

                    {content.bio && (
                      <p className="text-muted-foreground text-sm font-outfit font-light leading-relaxed line-clamp-3">
                        {content.bio}
                      </p>
                    )}

                    {/* Action & Social links */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex gap-6">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-muted-foreground/40 hover:text-primary transition-colors"
                            title="Contact Email"
                          >
                            <Mail size={16} />
                          </a>
                        )}
                        <a
                          href="#"
                          className="text-muted-foreground/40 hover:text-primary transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin size={16} />
                        </a>
                      </div>
                      
                      <Link 
                        href={`/${locale}/team/${member.slug}`}
                        className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 group/link"
                      >
                        Voir profil <ChevronRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-border">
             <SearchX size={64} className="mx-auto text-foreground/10 mb-8" />
             <h3 className="text-2xl font-fraunces font-bold text-foreground mb-4">Annuaire en cours d'actualisation</h3>
             <p className="text-muted-foreground font-outfit font-light max-w-sm mx-auto">L'équipe du CREDDA s'agrandit. Les profils de nos nouveaux chercheurs seront bientôt disponibles.</p>
          </div>
        )}
      </section>
    </main>
  );
}