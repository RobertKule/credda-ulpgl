// app/[locale]/research/page.tsx
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { 
  SearchX, 
  Calendar, 
  ArrowRight, 
  FileText,
  Clock,
  ChevronRight,
  Filter
} from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import ResearchHero from "@/components/shared/ResearchHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Archives Scientifiques | CREDDA-ULPGL",
    en: "Scientific Archives | CREDDA-ULPGL",
    sw: "Utafiti na Machapisho | CREDDA-ULPGL"
  };
  return { 
    title: titles[locale] || titles.fr,
    description: "Accédez aux publications scientifiques et rapports d'expertise du CREDDA-ULPGL."
  };
}

function calculateReadTime(content: string = ''): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function ResearchPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ResearchPage' });
  
  let articles: any[] = [];
  try {
    articles = await db.article.findMany({
      where: { domain: "RESEARCH", published: true },
      include: { 
        category: { include: { translations: { where: { language: locale } } } },
        translations: { where: { language: locale } } 
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database connection failed in ResearchPage", error);
  }

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1);

  const categories = articles.length > 0 
    ? articles.map(a => a.category).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    : [];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. CINEMATIC HERO FOR FEATURED PAPER */}
      {featuredArticle && (
        <ResearchHero featuredArticle={featuredArticle} locale={locale} />
      )}

      {/* 2. REFINED FILTER BAR */}
      <nav className="border-y border-light-gray bg-soft-cream/50 sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mr-4 border-r border-light-gray pr-6">
              <Filter size={14} className="text-secondary" />
              <span>Refine Archive</span>
            </div>
            <Link href="/research" className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-accent pb-1">
              All Journals
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/research?category=${cat.slug}`}
                className="text-[10px] font-black uppercase tracking-widest text-anthracite/50 hover:text-primary transition-colors whitespace-nowrap"
              >
                {cat.translations?.[0]?.name || cat.slug}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-anthracite/40">
             <span>{articles.length} Papers Found</span>
          </div>
        </div>
      </nav>

      {/* 3. EDITORIAL GRID */}
      <section className="container mx-auto px-6 py-24">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-24 gap-x-12">
            {secondaryArticles.length > 0 ? (
              secondaryArticles.map((article, idx) => {
                const translation = article.translations[0];
                const category = article.category?.translations[0]?.name || "Case Study";
                const readTime = calculateReadTime(translation?.content);
                const isWide = idx % 5 === 0;

                return (
                  <article 
                    key={article.id} 
                    className={`flex flex-col group ${isWide ? 'lg:col-span-8' : 'lg:col-span-4'}`}
                  >
                    <Link 
                      href={`/research/${article.slug}`} 
                      className={`relative overflow-hidden bg-soft-cream border border-light-gray ${isWide ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}
                    >
                      {article.mainImage ? (
                        <Image 
                          src={article.mainImage} 
                          alt={translation?.title || ""} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-light-gray">
                          <FileText size={48} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                         <Badge className="bg-primary/90 text-white rounded-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest">
                           {category}
                         </Badge>
                      </div>
                    </Link>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-anthracite/40">
                         <span>{new Date(article.createdAt).getFullYear()} Edition</span>
                         <span className="w-1 h-1 bg-accent rounded-full" />
                         <span className="flex items-center gap-1.5"><Clock size={12} /> {readTime} Min Read</span>
                      </div>

                      <Link href={`/research/${article.slug}`}>
                        <h2 className={`font-serif font-black text-primary group-hover:text-accent transition-colors leading-[1.1] ${isWide ? 'text-4xl lg:text-5xl' : 'text-3xl'}`}>
                          {translation?.title}
                        </h2>
                      </Link>

                      <p className="text-anthracite/60 text-base font-light leading-relaxed line-clamp-3">
                        {translation?.excerpt || "Detailed analysis of legal frameworks and societal progress within the African Great Lakes Region."}
                      </p>

                      <div className="pt-6">
                        <Link 
                          href={`/research/${article.slug}`}
                          className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary group/btn"
                        >
                          <span className="border-b-2 border-accent pb-1 group-hover/btn:border-primary transition-all">Download Journal</span>
                          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              featuredArticle && articles.length === 1 && (
                <div className="lg:col-span-12 py-20 text-center border-t border-light-gray italic text-anthracite/40 font-serif">
                   Additional archives are currently being processed.
                </div>
              )
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-32 text-center border-2 border-dashed border-light-gray bg-soft-cream/30">
            <SearchX className="mx-auto text-light-gray mb-8" size={80} strokeWidth={1} />
            <h3 className="text-4xl font-serif font-black text-primary mb-6">Foundations of Knowledge</h3>
            <p className="text-anthracite/50 font-light text-lg mb-12 max-w-xl mx-auto">
              Our digital repository is currently being expanded. For physical archive access, please consult our main library at ULPGL Salomon Campus.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="px-10 py-5 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-primary transition-all">
                Return to Portal
              </Link>
              <Link href="/contact" className="px-10 py-5 border border-light-gray text-primary font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                Request Archives
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. ACADEMIC CTAs */}
      <section className="bg-primary py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 -skew-y-3 translate-y-20 transform-gpu pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
                <h3 className="text-5xl font-serif font-black mb-8 italic">Contribute to the <br /> <span className="text-accent underline decoration-white/10">Scholarly Body</span></h3>
                <p className="text-white/60 text-lg font-light leading-relaxed max-w-lg">
                  Le CREDDA accueille les contributions de chercheurs externes. Soumettez vos travaux pour une parution dans nos prochaines éditions.
                </p>
             </div>
             <div className="flex flex-col sm:flex-row gap-6 lg:justify-end">
                <Link 
                  href="/contact?subject=journal-submission"
                  className="px-10 py-5 bg-accent text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all flex items-center justify-center gap-3"
                >
                  Submit Paper <ChevronRight size={14} />
                </Link>
                <Link 
                  href="/team"
                  className="px-10 py-5 border border-white/20 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-primary transition-all flex items-center justify-center"
                >
                  Meet Researchers
                </Link>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}