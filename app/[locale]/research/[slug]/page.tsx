import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Metadata } from "next";
import ArticleActions from "./ArticleActions";
import { getTranslations } from "next-intl/server";
import ParallaxWrapper from "@/components/shared/ParallaxWrapper";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const [article] = (await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations
      FROM "Article" a
      WHERE a.slug = ${slug}
    `) as any[];

    if (!article || !article.translations || article.translations.length === 0) return { title: "Not Found | CREDDA" };
    const translation = article.translations[0];
    return {
      title: `${translation.title} | CREDDA-ULPGL`,
      description: translation.excerpt || "Scientific publication from CREDDA-ULPGL",
    };
  } catch (error) {
    return { title: "Publication Scientifique | CREDDA-ULPGL" };
  }
}

const MarkdownComponents = {
  h1: ({ ...props }: any) => <h1 className="text-4xl md:text-5xl font-serif font-black text-primary mt-16 mb-8 leading-[1.1]" {...props} />,
  h2: ({ ...props }: any) => <h2 className="text-3xl font-serif font-black text-primary mt-12 mb-6 leading-tight border-b border-light-gray pb-4" {...props} />,
  h3: ({ ...props }: any) => <h3 className="text-2xl font-serif font-black text-primary mt-10 mb-4" {...props} />,
  p: ({ ...props }: any) => <p className="text-lg md:text-xl text-anthracite/80 leading-[1.8] mb-8 font-light" {...props} />,
  ul: ({ ...props }: any) => <ul className="list-disc list-outside ml-6 mb-8 space-y-4 text-anthracite/80 text-lg md:text-xl font-light" {...props} />,
  ol: ({ ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-8 space-y-4 text-anthracite/80 text-lg md:text-xl font-light" {...props} />,
  blockquote: ({ ...props }: any) => (
    <blockquote className="border-l-4 border-accent bg-soft-cream/50 p-10 my-12 italic text-primary text-xl md:text-2xl font-serif relative" {...props}>
      <span className="absolute top-4 left-4 text-6xl text-accent opacity-20 font-serif">&ldquo;</span>
      {props.children}
    </blockquote>
  ),
};

function calculateReadTime(content: string = ''): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default async function ResearchDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'ResearchDetailPage' });
  
  let article = null;
  try {
    const [articleResult] = (await sql`
      SELECT a.*, 
        (SELECT json_agg(t) FROM "ArticleTranslation" t WHERE t."articleId" = a.id AND t.language = ${locale}) as translations,
        (SELECT json_agg(ct) FROM "CategoryTranslation" ct WHERE ct."categoryId" = a."categoryId" AND ct.language = ${locale}) as category_translations
      FROM "Article" a
      WHERE a.slug = ${slug}
    `) as any[];
    article = articleResult;
    if (article) {
       article.category = {
          translations: article.category_translations || []
       };
    }
  } catch (error) {
    console.error("⚠️ Database connection failed in ResearchDetailPage", error);
  }

  if (!article || article.domain !== "RESEARCH" || article.translations.length === 0) notFound();
  
  const translation = article.translations[0];
  const categoryName = article.category?.translations[0]?.name || "Research Paper";
  const readTime = calculateReadTime(translation.content);
  const publishDate = new Date(article.createdAt).toLocaleDateString(locale, { 
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-white relative pb-32">
      {/* 1. SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60]">
        <div id="scroll-progress" className="h-full bg-accent w-0 transition-all duration-150" />
      </div>

      {/* 2. INSTITUTIONAL HEADER */}
      <header className="bg-primary text-white pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 translate-y-20 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <Link 
            href="/research" 
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-accent hover:text-white transition-all mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            {t('back')}
          </Link>
          
          <div className="flex flex-col items-center gap-8">
            <Badge className="bg-white/5 border border-white/20 text-accent rounded-md text-[10px] uppercase tracking-[0.4em] font-black px-6 py-2">
              {categoryName}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black leading-[1.05] tracking-tight max-w-4xl mx-auto">
              {translation.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-10 pt-8 border-t border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.25em]">
              <div className="flex items-center gap-2"><User size={14} className="text-accent" /> {t('authors')}</div>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> {publishDate}</div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-accent" /> {t('readingTime', { time: readTime })}</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO IMAGE & ARTICLE CONTENT */}
      <div className="container mx-auto px-6 max-w-5xl -mt-64 relative z-20">
        {article.mainImage && (
          <ParallaxWrapper speed={0.15} className="mb-20">
            <div className="relative aspect-[21/9] lg:aspect-[3/1] overflow-hidden border-[12px] border-white shadow-3xl">
              <Image src={article.mainImage} alt={translation.title} fill className="object-cover scale-110" priority />
            </div>
          </ParallaxWrapper>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Abstract / Excerpt */}
          {translation.excerpt && (
            <div className="mb-20 pb-12 border-b border-light-gray">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6 block">Abstract</span>
              <p className="text-2xl md:text-3xl text-primary font-serif italic font-light leading-relaxed">
                {translation.excerpt}
              </p>
            </div>
          )}

          {/* Reading Mode Content */}
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
              components={MarkdownComponents}
            >
              {translation.content}
            </ReactMarkdown>
          </article>

          {/* Institutional Footer Actions */}
          <div className="mt-32 pt-16 border-t border-light-gray">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-2">
                 <h4 className="text-xl font-serif font-black text-primary">Cite this Research</h4>
                 <p className="text-sm text-anthracite/50 font-light">CREDDA Paper Series · 2026 Archive</p>
               </div>
               <ArticleActions article={article} translation={translation} />
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        window.onscroll = function() {
          var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          var scrolled = (winScroll / height) * 100;
          var progress = document.getElementById("scroll-progress");
          if (progress) progress.style.width = scrolled + "%";
        };
      `}} />
    </main>
  );
}