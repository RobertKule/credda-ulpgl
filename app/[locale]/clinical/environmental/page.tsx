// app/[locale]/clinical/environmental/page.tsx
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  ShieldCheck, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Gavel,
  Users,
  MessageSquare,
  Calendar,
  BookOpen,
  BarChart3,
  Globe,
  Wind
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CDEPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CDEPage' });

  const strategicAxes = t.raw('strategic_axes.axes');
  const missionItems = t.raw('mission.items');

  const icons = [
    <Users key="0" size={32} strokeWidth={1} />,
    <Gavel key="1" size={32} strokeWidth={1} />,
    <MessageSquare key="2" size={32} strokeWidth={1} />,
    <Scale key="3" size={32} strokeWidth={1} />
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[90vh] flex items-center bg-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/forest-overlay.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <Badge className="bg-emerald-400 text-emerald-950 rounded-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em]">
              {t('header.badge')}
            </Badge>
            <h1 className="text-6xl md:text-8xl font-serif font-black leading-[0.95] tracking-tighter">
               Justice for <br /> <span className="text-emerald-400 italic">The Earth.</span>
            </h1>
            <p className="text-2xl text-white/60 font-light leading-relaxed max-w-2xl">
              {t('header.description')}
            </p>
            <div className="pt-8 flex gap-6">
               <Button asChild className="bg-emerald-400 text-emerald-950 rounded-md px-12 py-8 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all shadow-2xl shadow-emerald-400/20">
                  <Link href="#registry">Consulter le Registre</Link>
               </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-20 hidden lg:block">
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/30 rotate-90 origin-right">
              <span>Scroll to Explore</span>
              <div className="w-20 h-[1px] bg-white/20" />
           </div>
        </div>
      </section>

      {/* 2. CORE MISSION & STRATEGIC AXES */}
      <section id="registry" className="py-32 bg-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div className="space-y-12">
                <div className="space-y-6">
                   <h2 className="text-5xl font-serif font-black text-emerald-900 dark:text-emerald-400 leading-tight">
                      {t('intro.title')}
                   </h2>
                   <div className="w-20 h-2 bg-emerald-500" />
                </div>
                <p className="text-xl text-anthracite/70 font-light leading-relaxed italic">
                   {t('intro.text')}
                </p>
                <div className="p-12 bg-white dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/10 shadow-3xl text-emerald-900 dark:text-emerald-100 text-2xl font-serif italic leading-relaxed relative">
                   <span className="absolute -top-6 -left-4 text-8xl text-emerald-500 opacity-20">&ldquo;</span>
                   La terre est notre patrimoine commun; sa défense est un impératif de justice universelle.
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {strategicAxes.map((axis: any, i: number) => (
                   <div key={i} className="bg-white dark:bg-emerald-900/10 p-10 border border-emerald-100 dark:border-emerald-800/20 group hover:border-emerald-500 transition-all">
                    <div className="text-emerald-600 mb-10 group-hover:scale-110 transition-transform duration-500">
                      {icons[i]}
                    </div>
                    <h3 className="font-serif font-black text-emerald-900 dark:text-emerald-400 uppercase text-xs tracking-widest mb-4">{axis.title}</h3>
                    <p className="text-sm text-anthracite/50 dark:text-muted-foreground font-light leading-relaxed">{axis.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSFORMATIVE JUSTICE MODULES */}
      <section className="py-40 bg-white dark:bg-background transition-colors">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-1px bg-emerald-100 dark:bg-emerald-800/10 border border-emerald-100 dark:border-emerald-800/10 shadow-3xl">
             <Link href="/clinical/environmental/sessions" className="bg-white dark:bg-emerald-950/20 p-20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all group">
                <Globe className="text-emerald-600 mb-10 group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
                <h3 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400 mb-4">Unités Mobiles</h3>
                <p className="text-anthracite/50 dark:text-muted-foreground font-light leading-relaxed mb-10">Déploiement stratégique pour la protection des écosystèmes fragiles.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-3">
                   Explore Map <ArrowRight size={14} />
                </div>
             </Link>
             
             <Link href="/clinical/environmental/resources" className="bg-white dark:bg-emerald-950/20 p-20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all group border-x border-emerald-100 dark:border-emerald-800/10">
                <BookOpen className="text-emerald-600 mb-10 group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
                <h3 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400 mb-4">Bibliothèque Verte</h3>
                <p className="text-anthracite/50 dark:text-muted-foreground font-light leading-relaxed mb-10">Arsenal juridique complet pour la défense environnementale.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-3">
                   Access Texts <ArrowRight size={14} />
                </div>
             </Link>

             <Link href="/clinical/environmental/reports" className="bg-white dark:bg-emerald-950/20 p-20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all group">
                <Wind className="text-emerald-600 mb-10 group-hover:scale-110 transition-transform" size={48} strokeWidth={1} />
                <h3 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400 mb-4">Impact & Rapports</h3>
                <p className="text-anthracite/50 dark:text-muted-foreground font-light leading-relaxed mb-10">Analyses rigoureuses et témoignages de régénération sociale.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-3">
                   Read Statistics <ArrowRight size={14} />
                </div>
             </Link>
          </div>
        </div>
      </section>

      {/* 4. CLINICAL CALL FOR DEFENSE */}
      <section className="bg-emerald-900 py-40 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/nature-trace.png')] opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-serif font-black leading-tight italic">
              Become a <span className="text-emerald-400">Guardian</span> of the Territory.
            </h2>
            <p className="text-2xl text-white/50 font-light max-w-2xl mx-auto">
              Le CREDDA collabore avec les communautés locales pour bâtir un rempart juridique face aux exploitations abusives.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
               <Button size="lg" className="bg-emerald-400 text-emerald-950 rounded-md h-20 px-16 font-black uppercase tracking-[0.2em] text-[11px] group" asChild>
                  <Link href="/contact">
                     Engage a Case
                     <ArrowRight size={16} className="ml-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
