import { EditorialItem } from "@/types/editorial";

// Mappers to transform raw DB models with translations into EditorialItem

export function mapArticleToEditorial(article: any): EditorialItem {
  const translation = article.translations?.[0] || {};
  return {
    id: article.id,
    title: translation.title || "Untitled",
    slug: article.slug,
    excerpt: translation.excerpt,
    content: translation.content,
    coverImage: article.mainImage,
    videoUrl: article.videoUrl,
    featured: article.featured,
    published: article.published,
    category: article.categoryName,
    createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
    type: 'article'
  };
}

export function mapPublicationToEditorial(pub: any): EditorialItem {
  const translation = pub.translations?.[0] || {};
  return {
    id: pub.id,
    title: translation.title || "Untitled",
    slug: pub.slug,
    excerpt: translation.description,
    content: translation.content,
    pdfUrl: pub.pdfUrl,
    featured: false, // Publications usually don't have this field
    published: true, // Assuming true if it's in the DB
    author: translation.authors,
    createdAt: pub.createdAt ? new Date(pub.createdAt) : new Date(),
    type: 'publication'
  };
}
