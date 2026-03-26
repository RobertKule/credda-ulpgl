// app/[locale]/clinical/environmental/resources/page.tsx
import { getAllLegalResources } from "@/services/resource-actions";
import { useTranslations } from "next-intl";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Scale, 
  Search,
  BookOpen,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Link } from "@/navigation";

export default async function LegalResourceLibrary({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const result = await getAllLegalResources(locale);
  const resources = result.success ? result.data : [];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="space-y-4 mb-12">
          <Link href="/clinical/environmental" className="text-emerald-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
            <ChevronRight size={14} className="rotate-180" />
            Retour à la Clinique
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
                Bibliothèque <span>Juridique</span>
              </h1>
              <p className="text-slate-500 font-light max-w-2xl leading-relaxed">
                Accédez aux textes de lois, codes et ressources juridiques essentiels pour la défense de l'environnement en RDC.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Rechercher une loi..." 
                className="w-full pl-10 h-12 rounded-none border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories / Filter placeholder */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Button variant="outline" className="rounded-none bg-emerald-900 text-white border-none text-[10px] font-bold uppercase tracking-widest">Tous</Button>
          <Button variant="outline" className="rounded-none border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-700">Code Forestier</Button>
          <Button variant="outline" className="rounded-none border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-700">Droit Foncier</Button>
          <Button variant="outline" className="rounded-none border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-700">Loi sur la Nature</Button>
          <Button variant="outline" className="rounded-none border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-700">Guides Pratiques</Button>
        </div>

        {/* Resource Grid */}
        {resources.length === 0 ? (
          <div className="bg-white border border-slate-200 p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center mx-auto text-slate-300">
              <BookOpen size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-900">Aucune ressource disponible</p>
              <p className="text-slate-500 text-sm font-light">Nous mettons à jour notre bibliothèque. Revenez bientôt.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res: any) => {
              const trans = res.translations[0];
              if (!trans) return null;

              return (
                <Card key={res.id} className="rounded-none border-slate-200 hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                  <div className="h-2 bg-emerald-800" />
                  <CardHeader className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="rounded-none border-emerald-100 text-emerald-800 text-[8px] font-bold uppercase tracking-widest">
                        {res.category || "Général"}
                      </Badge>
                      <FileText className="text-slate-200 group-hover:text-emerald-100 transition-colors" size={24} />
                    </div>
                    <CardTitle className="text-xl font-serif font-bold text-slate-900 leading-tight">
                      {trans.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-sm font-light line-clamp-3 pt-2">
                       {trans.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 mt-auto border-t border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <Button variant="ghost" className="p-0 h-auto text-emerald-700 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-transparent hover:text-emerald-900">
                      Lire en ligne <ExternalLink size={14} />
                    </Button>
                    {trans.fileLink && (
                      <Button size="icon" className="bg-emerald-800 hover:bg-emerald-900 rounded-none w-10 h-10 shadow-lg">
                        <Download size={18} className="text-white" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Disclaimer / Call to Action */}
        <div className="mt-20 bg-emerald-900 p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Scale size={300} strokeWidth={1} />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold italic">Un doute sur l'interprétation d'une loi ?</h2>
            <p className="text-emerald-100 font-light leading-relaxed">
              Les textes juridiques peuvent être complexes. Nos cliniciens sont là pour vous aider à comprendre vos droits et obligations environnementales.
            </p>
            <Button asChild className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-none px-8 h-12 font-bold uppercase tracking-widest text-xs">
              <Link href="/clinical/environmental">Demander une orientation</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
