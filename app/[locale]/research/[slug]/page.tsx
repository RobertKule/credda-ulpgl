// app/[locale]/research/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ArticleDetailPage({ params: { locale, slug } }) {
  const article = await db.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } },
      category: { include: { translations: { where: { language: locale } } } }
    }
  });

  if (!article || article.translations.length === 0) return notFound();

  const content = article.translations[0];

  return (
    <article className="bg-white min-h-screen pb-20">
      {/* Header de l'article */}
      <header className="max-w-3xl mx-auto pt-20 px-6 text-center">
        <Badge variant="outline" className="mb-4">{article.category.translations[0]?.name}</Badge>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
          {content.title}
        </h1>
        <div className="mt-8 flex justify-center items-center gap-4 text-slate-500 text-sm italic">
          <span>CREDDA-ULPGL Research</span>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {/* Contenu - Format Papier Scientifique */}
      <div className="max-w-2xl mx-auto mt-16 px-6">
        {article.videoUrl && (
          <div className="mb-12 aspect-video bg-black shadow-2xl">
            <iframe 
              src={article.videoUrl.replace("watch?v=", "embed/")}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-serif prose-headings:font-bold 
          prose-p:leading-relaxed prose-p:text-slate-700
          prose-blockquote:border-l-blue-900 prose-blockquote:bg-slate-50 prose-blockquote:py-2">
          {/* Ici, on injectera le contenu Markdown plus tard */}
          <p className="whitespace-pre-wrap">{content.content}</p>
        </div>
      </div>
    </article>
  );
}