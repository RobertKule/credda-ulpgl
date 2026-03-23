// app/[locale]/programmes/page.tsx
import type { Metadata } from "next";
import { localePageMetadata } from "@/lib/page-metadata";
import { motion } from "framer-motion";
import { 
  Scale, 
  ShieldCheck, 
  MessageSquare, 
  Users, 
  MapPin, 
  BookOpen, 
  Gavel 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const domains = [
  {
    id: "capacity",
    icon: <BookOpen className="w-8 h-8" />,
    titleKey: "strategic_axes.axes.0.title",
    descKey: "strategic_axes.axes.0.desc",
    gridSpan: "md:col-span-2",
    color: "bg-[#C9A84C]/5"
  },
  {
    id: "litigation",
    icon: <Gavel className="w-8 h-8" />,
    titleKey: "strategic_axes.axes.1.title",
    descKey: "strategic_axes.axes.1.desc",
    color: "bg-white/5"
  },
  {
    id: "advocacy",
    icon: <ShieldCheck className="w-8 h-8" />,
    titleKey: "strategic_axes.axes.2.title",
    descKey: "strategic_axes.axes.2.desc",
    color: "bg-white/5"
  },
  {
    id: "legal-aid",
    icon: <Scale className="w-8 h-8" />,
    titleKey: "strategic_axes.axes.3.title",
    descKey: "strategic_axes.axes.3.desc",
    gridSpan: "md:col-span-2",
    color: "bg-[#C9A84C]/10"
  },
  {
    id: "mediation",
    icon: <MessageSquare className="w-8 h-8" />,
    titleKey: "mission.items.2",
    descKey: "intro.text", // Fallback description
    color: "bg-white/5"
  },
  {
    id: "mobile",
    icon: <MapPin className="w-8 h-8" />,
    titleKey: "mission.items.4",
    descKey: "strategic_axes.axes.0.desc", // Simplified for bento
    color: "bg-white/5"
  },
  {
    id: "awareness",
    icon: <Users className="w-8 h-8" />,
    titleKey: "strategic_axes.axes.2.title", 
    descKey: "strategic_axes.axes.2.desc",
    color: "bg-white/5"
  }
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localePageMetadata(locale, "programmes");
}

export default function ProgrammesPage() {
  // Page must be localized
  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <div className="inline-block px-4 py-1.5 border border-[#C9A84C]/30 mb-8">
           <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#C9A84C]">
             Expertise & Action
           </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-black text-[#F5F2EC] mb-8 leading-[1.1]">
          Domaines <span className="text-[#C9A84C] italic">d'Intervention</span>
        </h1>
        <p className="text-lg md:text-xl text-[#F5F2EC]/60 font-sans font-light max-w-3xl mx-auto leading-relaxed">
          La Clinique de Droit Environnemental (CDE) du CREDDA déploie ses compétences à travers sept axes stratégiques pour une justice sociale et durable.
        </p>
      </div>

      {/* BENTO GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
         {/* Static data implementation for speed as requested */}
         <ProgramCard 
            title="Renforcement des Capacités" 
            desc="Formation des étudiants, magistrats et leaders communautaires sur les enjeux juridiques environnementaux."
            icon={<BookOpen className="text-[#C9A84C]" />}
            span="md:col-span-2"
            bg="bg-[#C9A84C]/5"
         />
         <ProgramCard 
            title="Contentieux d'Intérêt Public" 
            desc="Actions juridiques pour décourager les pollutions et développements nuisibles."
            icon={<Gavel className="text-[#C9A84C]" />}
         />
         <ProgramCard 
            title="Plaidoyer" 
            desc="Influencer les politiques publiques et les lois environnementales en RDC."
            icon={<ShieldCheck className="text-[#C9A84C]" />}
         />
         <ProgramCard 
            title="Aide Juridique Gratuite" 
            desc="Services juridiques gracieux dédiés aux populations vulnérables et autochtones."
            icon={<Scale className="text-[#C9A84C]" />}
            span="md:col-span-2"
            bg="bg-[#C9A84C]/10 border-[#C9A84C]/20"
         />
         <ProgramCard 
            title="Cliniques Mobiles" 
            desc="Campagnes massives de sensibilisation et assistance juridique directe sur le terrain."
            icon={<MapPin className="text-[#C9A84C]" />}
         />
         <ProgramCard 
            title="Médiation Communautaire" 
            desc="Mise en place de mécanismes de résolution pacifique des conflits fonciers et environnementaux."
            icon={<MessageSquare className="text-[#C9A84C]" />}
         />
         <ProgramCard 
            title="Assistance Légale" 
            desc="Audit et accompagnement pour la conformité environnementale des projets locaux."
            icon={<ShieldCheck className="text-[#C9A84C]" />}
         />
      </div>

      {/* CTA SECTION */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#111110] to-[#0C0C0A] border border-white/5 p-12 lg:p-20 text-center relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C9A84C]/10 transition-all duration-700" />
         
         <h2 className="text-3xl md:text-5xl font-serif font-black text-[#F5F2EC] mb-8 relative z-10">
            Prêt à collaborer pour <span className="italic-accent">le changement</span> ?
         </h2>
         <p className="text-lg text-[#F5F2EC]/50 font-sans font-light mb-12 max-w-2xl mx-auto relative z-10">
            Que vous soyez une institution, une communauté ou un chercheur, le CREDDA est ouvert aux partenariats stratégiques.
         </p>
         <Link 
            href="/contact"
            className="inline-flex items-center gap-4 px-10 py-5 bg-[#C9A84C] text-[#0C0C0A] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#E8C97A] transition-all relative z-10"
         >
            Nous contacter <ArrowRight size={14} />
         </Link>
      </div>
    </main>
  );
}

function ProgramCard({ title, desc, icon, span = "", bg = "bg-white/5" }: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  span?: string;
  bg?: string;
}) {
  return (
    <div className={`p-10 border border-white/5 flex flex-col justify-between group hover:border-[#C9A84C]/30 transition-all duration-500 ${bg} ${span}`}>
       <div>
         <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:border-[#C9A84C]/50 transition-all duration-500">
           {icon}
         </div>
         <h3 className="text-xl md:text-2xl font-serif font-black text-[#F5F2EC] mb-6 group-hover:text-[#C9A84C] transition-colors">
           {title}
         </h3>
         <p className="text-sm text-[#F5F2EC]/40 leading-relaxed font-light">
           {desc}
         </p>
       </div>
    </div>
  );
}
