// types/article.ts
import { Article, ArticleTranslation, Category, CategoryTranslation } from "@prisma/client";

export type ArticleWithTranslations = Article & {
  translations: ArticleTranslation[];
};

export type FullArticle = Article & {
  translations: ArticleTranslation[];
  category: Category & {
    translations: CategoryTranslation[];
  };
};

export type { Domain } from "@prisma/client";
