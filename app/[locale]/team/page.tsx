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
  const members = await sql`
    SELECT m.*, 
      (SELECT json_agg(t) FROM "MemberTranslation" t WHERE t."memberId" = m.id AND t.language = ${locale}) as translations
    FROM "Member" m
    ORDER BY m."order" ASC
  `.catch((err) => {
    console.error("Team DB Fetch Error:", err);
    return [];
  });

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-16">
          <div className="max-w-3xl">
            <span className="text-[10px] uppercase tracking-[0.6em] font-outfit font-bold text-[#C9A84C] block mb-8">Leadership Scientifique</span>
            <h1 className="text-6xl md:text-8xl font-fraunces font-extrabold text-[#F5F2EC] leading-[0.85] mb-10">
               Nos <span className="text-[#C9A84C] italic-accent">Chercheurs</span> & Experts.
            </h1>
            <p className="text-xl text-[#F5F2EC]/40 font-outfit font-light leading-relaxed">
              Une équipe pluridisciplinaire engagée pour la production de savoir critique et l'excellence scientifique en Afrique.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-[#C9A84C]">{members.length}</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-white/20">Chercheurs</p>
             </div>
             <div className="w-[1px] h-12 bg-white/10" />
             <div className="text-center">
                <p className="text-3xl font-fraunces font-extrabold text-[#C9A84C]">24</p>
                <p className="text-[9px] uppercase font-outfit font-bold tracking-widest text-white/20">Expertises</p>
             </div>
          </div>
        </div>
      </header>

      {/* --- GRID ÉQUIPE --- */}
      <section className="max-w-7xl mx-auto">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {members.map((member) => {
              const content = member.translations[0];
              if (!content) return null;

              return (
                <div key={member.id} className="group">
                  {/* Photo Profile */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#111110] border border-white/5 mb-8">
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
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0C0C0A] to-transparent opacity-60" />
                  </div>

                  {/* Infos */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <span className="text-[9px] font-outfit font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                        {content.role || "Chercheur"}
                      </span>
                      <h2 className="text-3xl font-bricolage font-bold text-[#F5F2EC] group-hover:text-[#C9A84C] transition-colors">
                        {content.name}
                      </h2>
                    </div>

                    <div className="h-[1px] w-12 bg-[#C9A84C] transition-all group-hover:w-full duration-700" />

                    {content.bio && (
                      <p className="text-[#F5F2EC]/40 text-sm font-outfit font-light leading-relaxed line-clamp-3">
                        {content.bio}
                      </p>
                    )}

                    {/* Social links */}
                    <div className="flex gap-6 pt-4">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-white/20 hover:text-[#C9A84C] transition-colors"
                          title="Contact Email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      <a
                        href="#"
                        className="text-white/20 hover:text-[#C9A84C] transition-colors"
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
          <div className="py-40 text-center border border-dashed border-white/10">
             <SearchX size={64} className="mx-auto text-white/10 mb-8" />
             <h3 className="text-2xl font-fraunces font-bold text-white mb-4">Annuaire en cours d'actualisation</h3>
             <p className="text-white/30 font-outfit font-light max-w-sm mx-auto">L'équipe du CREDDA s'agrandit. Les profils de nos nouveaux chercheurs seront bientôt disponibles.</p>
          </div>
        )}
      </section>
    </main>
  );
}