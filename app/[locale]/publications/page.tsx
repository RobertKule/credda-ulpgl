import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Filter, SearchX, BookOpen, Calendar, User2, ArrowRight} from "lucide-react";
import PdfPreview from "@/components/public/PdfPreview"; // Import du nouveau composant


interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function PublicationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { year } = await searchParams;

  const publications = await db.publication.findMany({
    where: year ? { year: parseInt(year) } : {},
    include: { translations: { where: { language: locale } } },
    orderBy: { year: "desc" }
  });

  const years = [2024, 2023, 2022, 2021];

  return (
    <main className="min-h-screen bg-slate-50/30">
      {/* --- HERO --- */}
      <header className="bg-[#050a15] text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <Badge className="bg-blue-600 rounded-none px-4 py-1 uppercase tracking-widest text-[10px] mb-6">Open Repository</Badge>
          <h1 className="text-5xl lg:text-7xl font-serif font-bold italic mb-6">Bibliothèque Numérique</h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Consultez et téléchargez les rapports annuels et travaux scientifiques du CREDDA.
          </p>
        </div>
      </header>

      {/* --- FILTRES --- */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex items-center gap-4 overflow-x-auto whitespace-nowrap">
          <Filter size={14} className="text-slate-400" />
          <Link href="/publications" className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${!year ? 'bg-blue-900 text-white' : 'text-slate-500 border-slate-100 hover:border-blue-900'}`}>Tous</Link>
          {years.map(y => (
            <Link key={y} href={`/publications?year=${y}`} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${year === y.toString() ? 'bg-blue-900 text-white' : 'text-slate-500 border-slate-100 hover:border-blue-900'}`}>{y}</Link>
          ))}
        </div>
      </div>

      {/* --- LISTE --- */}
<section className="container mx-auto px-6 py-20">
  {publications.length > 0 ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {publications.map((pub) => {
        const content = pub.translations[0];
        return (
          <div key={pub.id} className="bg-white border border-slate-200 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500">
            {/* COUVERTURE DU PDF (Rendu automatique de la page 1) */}
            <div className="w-full md:w-56 h-72 shrink-0 border-r border-slate-50">
              <PdfPreview url={pub.pdfUrl} />
            </div>

            {/* CONTENU */}
            <div className="p-8 flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                   <Badge variant="outline" className="rounded-none border-blue-600 text-blue-700 text-[9px] font-black uppercase tracking-widest">{pub.domain}</Badge>
                   <span className="text-xs font-serif italic text-slate-400">{pub.year}</span>
                </div>
                
                {/* ✅ LIEN VERS LA PAGE DÉTAIL AVEC LE SLUG OU L'ID */}
                <Link 
                  href={`/publications/${pub.slug || pub.id}`}
                  className="group/link"
                >
                  <h2 className="text-2xl font-serif font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors hover:underline decoration-blue-700/30 underline-offset-4">
                    {content.title}
                  </h2>
                </Link>
                
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <User2 size={14} className="text-blue-600" /> {content.authors}
                </div>
                <p className="text-slate-500 text-sm font-light line-clamp-3 leading-relaxed">{content.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <a 
                    href={pub.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-900 hover:gap-4 transition-all group/btn"
                  >
                    <Download size={14} className="group-hover/btn:animate-bounce" /> 
                    Télécharger (PDF)
                  </a>
                  
                  {/* ✅ BOUTON "LIRE LA SUITE" VERS LA PAGE DÉTAIL */}
                  <Link 
                    href={`/publications/${pub.slug || pub.id}`}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-700 transition-all group/link2"
                  >
                    Détails 
                    <ArrowRight size={12} className="group-hover/link2:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                {pub.doi && (
                  <span className="text-[9px] font-mono text-slate-300">
                    DOI: {pub.doi}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-20 border-2 border-dashed border-slate-200">
      <SearchX size={48} className="mx-auto text-slate-200 mb-4" />
      <p className="text-slate-400 font-serif italic">Aucun document pour cette période.</p>
    </div>
  )}
</section>
    </main>
  );
}