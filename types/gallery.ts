// types/gallery.ts
import { GalleryImage, GalleryImageTranslation } from "@prisma/client";

export type GalleryImageWithTranslations = GalleryImage & {
  translations: GalleryImageTranslation[];
};
