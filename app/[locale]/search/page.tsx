// app/[locale]/search/page.tsx
import { searchEverything } from "@/services/search-actions";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { FileText, BookOpen, User, ChevronRight, SearchX } from "lucide-react";
import { getTranslations } from "next-intl/server";

// Fonction utilitaire pour surligner le texte
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <u key={i} className="text-blue-600 decoration-blue-600 decoration-2 underline-offset-4 font-black">{part}</u> 
          : part
      )}
    </span>
  );
}

export default async function SearchResultsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>; 
  searchParams: Promise<{ q: string }>;
}) {
  const { locale } = await params;
  const { q: query } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });
  
  const results = await searchEverything(query, locale);
  const totalResults = results.articles.length + results.publications.length + results.members.length;

  return (
    <main className="min-h-screen bg-slate-50/30 py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-16 space-y-4">
          <Badge className="bg-blue-600 rounded-none">
            {t('header.badge')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900">
            <span dangerouslySetInnerHTML={{ __html: t.raw('header.title').replace('{query}', query) }} />
          </h1>
          <p className="text-slate-500 font-medium">
            {t('header.results', { count: totalResults })}
          </p>
        </header>

        {totalResults > 0 ? (
          <div className="space-y-12">
            {/* Résultats Articles */}
            {results.articles.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b pb-4">
                  {t('sections.articles')}
                </h3>
                <div className="grid gap-6">
                  {results.articles.map((a: any) => (
                    <Link key={a.id} href={`/research/${a.slug}`} className="bg-white p-8 border border-slate-100 hover:shadow-xl transition-all group flex justify-between items-center">
                      <div className="space-y-2">
                        <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-widest">{a.domain}</Badge>
                        <h4 className="text-2xl font-serif font-bold text-slate-900">
                          <Highlight text={a.translations[0].title} query={query} />
                        </h4>
                        <p className="text-slate-500 text-sm font-light">
                          <Highlight text={a.translations[0].excerpt || ""} query={query} />
                        </p>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-blue-600 transition-colors" size={32} />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Résultats Publications */}
            {results.publications.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b pb-4">
                  {t('sections.publications')}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {results.publications.map((p: any) => (
                    <Link key={p.id} href="/publications" className="bg-white p-6 border border-slate-100 hover:border-blue-200 transition-all flex gap-4">
                      <BookOpen className="text-blue-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">
                          <Highlight text={p.translations[0].title} query={query} />
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          {t('highlight.authors')}
                          <Highlight text={p.translations[0].authors} query={query} />
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Résultats Membres */}
            {results.members.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b pb-4">
                  {t('sections.members')}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {results.members.map((m: any) => (
                    <Link key={m.id} href="/team" className="bg-white p-6 border border-slate-100 hover:border-blue-200 transition-all text-center">
                      <User className="mx-auto text-blue-600 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900">
                        <Highlight text={m.translations[0].name} query={query} />
                      </h4>
                      <p className="text-[10px] text-blue-600 font-black uppercase mt-1">
                        {m.translations[0].role}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="py-32 text-center bg-white border border-slate-100 max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
              <SearchX size={80} className="mx-auto text-slate-300 relative z-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              {t('empty.title')}
            </h3>
            <p className="text-slate-500 font-light text-lg">
              {t('empty.description')}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}