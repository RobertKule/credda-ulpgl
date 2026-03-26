// app/[locale]/clinical/environmental/reports/page.tsx
import { getPublicationsByDomain } from "@/services/publication-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  FileCheck,
  Search
} from "lucide-react";
import { Link } from "@/navigation";

export default async function ActivityReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const result = await getPublicationsByDomain("CLINICAL", locale);
  const reports = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="space-y-6 mb-16">
           <Link href="/clinical/environmental" className="text-emerald-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              <ChevronRight size={14} className="rotate-180" />
              Retour à la Clinique
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 leading-tight">
                  Rapports <span>d'Activité</span>
                </h1>
                <p className="text-slate-500 text-lg font-light max-w-2xl leading-relaxed">
                  Consultez nos bilans annuels, nos études d'impact et les résultats de nos interventions cliniques sur le terrain.
                </p>
              </div>
              <div className="flex gap-4">
                 <div className="text-center p-4 bg-white border border-slate-100 shadow-sm min-w-24">
                   <div className="text-2xl font-bold text-emerald-700">{reports.length}</div>
                   <div className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Rapports</div>
                 </div>
                 <div className="text-center p-4 bg-white border border-slate-100 shadow-sm min-w-24">
                   <div className="text-2xl font-bold text-emerald-700">2026</div>
                   <div className="text-[8px] uppercase font-black text-slate-400 tracking-widest">Dernier</div>
                 </div>
              </div>
            </div>
        </div>

        {/* Featured / Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-emerald-900 text-white p-8 sm:p-12 relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10 p-10">
              <BarChart3 size={200} strokeWidth={1} />
           </div>
           <div className="space-y-6 relative z-10">
              <Badge className="bg-emerald-500 text-white border-none rounded-md text-[8px] uppercase font-bold tracking-widest">Dernière Étude</Badge>
              <h2 className="text-3xl font-serif font-bold leading-tight">Étude d'Impact 2025 : Justice Climatique en Territoire de Masisi</h2>
              <p className="text-emerald-100 font-light leading-relaxed">
                Ce rapport analyse les retombées de nos cliniques mobiles et le renforcement des capacités juridiques des populations autochtones face aux spoliations foncières.
              </p>
              <Button className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-md px-8 font-bold uppercase tracking-widest text-xs h-12">
                Lire le rapport complet
              </Button>
           </div>
           <div className="hidden md:flex justify-center relative z-10">
              <div className="w-64 h-80 bg-white shadow-2xl p-4 flex flex-col justify-between border-t-4 border-emerald-500">
                 <div className="space-y-4">
                    <div className="w-12 h-1 bg-emerald-100" />
                    <div className="space-y-2">
                       <div className="h-4 bg-slate-100 w-full" />
                       <div className="h-4 bg-slate-100 w-3/4" />
                       <div className="h-4 bg-slate-100 w-1/2" />
                    </div>
                 </div>
                 <FileText className="text-emerald-100 self-end" size={80} strokeWidth={1} />
              </div>
           </div>
        </div>

        {/* List of Reports */}
        <div className="space-y-10">
           <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-xl font-serif font-bold text-slate-900">Archives des Rapports</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input placeholder="Filtrer par année..." className="w-full pl-10 border-none bg-transparent text-sm focus:ring-0" />
              </div>
           </div>

           {reports.length === 0 ? (
             <div className="py-20 text-center text-slate-400 font-light">
               Aucun rapport archivé pour le moment.
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report: any) => {
                  const trans = report.translations[0];
                  if (!trans) return null;

                  return (
                    <div key={report.id} className="bg-white border border-slate-200 p-8 hover:shadow-xl transition-all group flex flex-col relative">
                       <div className="absolute top-8 left-0 w-1 h-12 bg-emerald-600 group-hover:h-full transition-all duration-300" />
                       <div className="text-emerald-700 font-black text-4xl opacity-10 mb-4">{report.year}</div>
                       <h4 className="text-lg font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-800 transition-colors">
                         {trans.title}
                       </h4>
                       <p className="text-slate-500 text-xs font-light line-clamp-3 mb-8">
                         {trans.description}
                       </p>
                       <div className="mt-auto flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">PDF - Clinical</span>
                          <Button size="icon" variant="ghost" className="rounded-md hover:bg-emerald-50 text-emerald-700">
                             <Download size={20} />
                          </Button>
                       </div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>

        {/* Statistics section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 border border-slate-100 text-center space-y-4">
              <TrendingUp className="mx-auto text-emerald-400" size={32} />
              <div className="text-3xl font-serif font-bold">120+</div>
              <p className="text-slate-500 text-xs font-light uppercase tracking-widest">Cas Traités en 2025</p>
           </div>
           <div className="bg-white p-10 border border-slate-100 text-center space-y-4">
              <FileCheck className="mx-auto text-emerald-400" size={32} />
              <div className="text-3xl font-serif font-bold">15</div>
              <p className="text-slate-500 text-xs font-light uppercase tracking-widest">Missions Terrain</p>
           </div>
           <div className="bg-white p-10 border border-slate-100 text-center space-y-4">
              <BarChart3 className="mx-auto text-emerald-400" size={32} />
              <div className="text-3xl font-serif font-bold">95%</div>
              <p className="text-slate-500 text-xs font-light uppercase tracking-widest">Satisfaction Bénéficiaires</p>
           </div>
        </div>

      </div>
    </main>
  );
}
