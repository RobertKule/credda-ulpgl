// types/publication.ts
import { Publication, PublicationTranslation, Domain } from "@prisma/client";

export type PublicationWithTranslations = Publication & {
  translations: PublicationTranslation[];
};

export { Domain };
