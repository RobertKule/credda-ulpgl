import { Article, ArticleTranslation, Category, CategoryTranslation, Publication, PublicationTranslation } from "@prisma/client";

export type ArticleWithTranslations = Article & {
  translations: ArticleTranslation[];
  category: (Category & {
    translations: CategoryTranslation[];
  }) | null;
};

export type PublicationWithTranslations = Publication & {
  translations: PublicationTranslation[];
};

export type UnifiedContent = 
  | (ArticleWithTranslations & { __type: 'ARTICLE' })
  | (PublicationWithTranslations & { __type: 'PUBLICATION'; published: boolean });
