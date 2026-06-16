// components/home/TeamSection.tsx
"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import GSAPReveal from "@/components/shared/GSAPReveal";

export interface TeamMember {
  name: string;
  image?: string | null;
  slug?: string | null;
  translations?: {
    role?: string | null;
  }[];
}

export default function TeamSection({ team }: { team: TeamMember[] }) {
  const t = useTranslations('HomePage');

  if (!team || team.length === 0) return null;
  const displayTeam = team.slice(0, 6); // Up to 6 members like in the screenshot

  return (
    <div className="w-full mx-auto bg-background transition-colors duration-500">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20 lg:mb-24">
        <div className="max-w-2xl space-y-4">
          <GSAPReveal direction="right">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary font-sans">
                {t('team.badge') || "Academic Body"}
              </span>
            </div>
          </GSAPReveal>
          <GSAPReveal direction="up" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter leading-[1] text-foreground">
              {t('team.title_main') || "Notre Équipe"}
              <br />
              <span className="text-primary italic font-light">{t('team.title_sub') || "D'Excellence"}</span>
            </h2>
          </GSAPReveal>
        </div>

        <GSAPReveal direction="left" delay={0.4}>
          <Link
            href="/team"
            className="group flex items-center gap-4 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold transition-all duration-500 hover:scale-105 shadow-lg shadow-primary/20"
          >
            <span className="text-xs uppercase tracking-widest">
              {t('team.read_more') || "Aller voir l'équipe"}
            </span>
            <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </GSAPReveal>
      </div>

      {/* TEAM GRID — Overlapping Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-20 p-4 md:p-0">
        {displayTeam.map((member: TeamMember, idx: number) => (
          <GSAPReveal key={idx} direction="up" delay={idx * 0.1}>
            <div className="relative group flex flex-col md:block">
              {/* Text Card (Behind/Left on Desktop, Below Image on Mobile) */}
              <Link href={`/team/${member.slug}`} className="order-2 md:order-1 block">
                <div className="bg-card text-card-foreground p-6 pt-16 md:pt-10 pb-8 md:pb-10 rounded-2xl shadow-xl border border-border/5 md:pr-32 transition-all duration-500 group-hover:border-primary/20">
                  <h3 className="font-serif font-black text-2xl leading-tight mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase font-sans text-muted-foreground tracking-widest">
                      {member.translations?.[0]?.role || "Expert"}
                    </p>
                  </div>
                  
                  {/* Small Action Icon */}
                  <div className="mt-6 flex">
                    <div className="p-2.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Portrait (Floating Right on Desktop, Top on Mobile) */}
              <div className="relative md:absolute order-1 md:order-2 -mb-12 md:mb-0 md:-top-10 md:-right-4 w-full md:w-36 h-64 md:h-52 lg:w-40 lg:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-background transition-all duration-700 md:group-hover:-translate-y-2 md:group-hover:scale-105 z-10 mx-auto max-w-[200px] md:max-w-none">
                <Image
                  src={member.image || "/images/director3.webp"}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 200px, 200px"
                  className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
          </GSAPReveal>
        ))}
      </div>
    </div>
  );
}
