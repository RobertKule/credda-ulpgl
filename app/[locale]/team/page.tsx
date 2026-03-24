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
      <header className="max-w-7xl mx-auto mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.6em] font-outfit font-bold text-primary block mb-8">Leadership Scientifique</span>
            <h1 className="text-6xl md:text-8xl font-fraunces font-extrabold text-foreground leading-[0.85] mb-10">
               Nos <span className="text-primary italic-accent">Chercheurs</span> & Experts.
            </h1>
            <p className="text-xl text-muted-foreground font-outfit font-light leading-relaxed">
              Une équipe pluridisciplinaire engagée pour la production de savoir critique et l'excellence scientifique en Afrique.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-primary">{members.length}</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-muted-foreground/30">Chercheurs</p>
             </div>
             <div className="w-[1px] h-12 bg-border/40" />
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-primary">24</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-muted-foreground/30">Expertises</p>
             </div>
          </div>
        </div>
      </header>

      {/* --- GRID ÉQUIPE --- */}
      <section className="max-w-7xl mx-auto">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {members.map((member: any) => {
              const content = member.translations[0];
              if (!content) return null;

              return (
                <div key={member.id} className="group">
                  {/* Photo Profile */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-card border border-border mb-8 shadow-2xl">
                    {member.image ? (
                      <Image
                        src={member.image.replace(/\\/g, '/').replace(/^public\//, '/')}
                        alt={content.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/5">
                        <Users size={120} strokeWidth={0.5} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent opacity-60" />
                  </div>

                  {/* Infos */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <span className="text-[9px] font-outfit font-bold uppercase tracking-[0.3em] text-primary">
                        {content.role || "Chercheur"}
                      </span>
                      <h2 className="text-3xl font-bricolage font-bold text-foreground group-hover:text-primary transition-colors">
                        {content.name}
                      </h2>
                    </div>

                    <div className="h-[1px] w-12 bg-primary transition-all group-hover:w-full duration-700" />

                    {content.bio && (
                      <p className="text-muted-foreground text-sm font-outfit font-light leading-relaxed line-clamp-3">
                        {content.bio}
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex gap-6 pt-4">
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
                  </div>
                </div>
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