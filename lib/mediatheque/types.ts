export type MediaType = "IMAGE" | "VIDEO";
export type MediaSource = "LOCAL" | "EXTERNAL";

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  source: MediaSource;
  url: string;
  thumbnailUrl: string;
  category: string;
  fileSize?: string;
  createdAt: string | Date;
  files?: { url: string; fileType: string; thumbnailUrl?: string; fileName?: string; }[];
}

export type MediaTab = "ALL" | "IMAGE" | "VIDEO";

export interface StorageStats {
  totalFiles: number;
  usedSpace: string;
  totalCapacity: string;
  usagePercent: number;
}

export const MEDIA_CATEGORIES = [
  "Conférence",
  "Descente Terrain Clinique",
  "Recherche",
  "Laboratoire KuleLab",
  "Formation",
  "Événement Institutionnel",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];
