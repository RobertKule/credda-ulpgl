import type { MediaItem, StorageStats } from "./types";

export const MOCK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    title: "Descente terrain — Clinique mobile Goma",
    description: "Captures de la mission juridique de terrain dans les quartiers périphériques de Goma.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
    category: "Descente Terrain Clinique",
    fileSize: "2.4 MB",
    createdAt: "2025-11-14T09:30:00.000Z",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "Conférence annuelle CREDDA 2025",
    description: "Vue d'ensemble de l'amphithéâtre lors de la conférence sur les droits des patients.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    category: "Conférence",
    fileSize: "3.1 MB",
    createdAt: "2025-10-22T14:15:00.000Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Atelier recherche — Méthodologie qualitative",
    description: "Session de travail du laboratoire @kulelab sur les méthodes d'enquête terrain.",
    type: "VIDEO",
    source: "EXTERNAL",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600",
    category: "Recherche",
    createdAt: "2025-09-08T11:00:00.000Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    title: "Laboratoire KuleLab — Présentation des travaux",
    description: "Vidéo documentaire sur les activités du labo de recherche appliquée.",
    type: "VIDEO",
    source: "EXTERNAL",
    url: "https://vimeo.com/76979871",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    category: "Laboratoire KuleLab",
    createdAt: "2025-08-19T16:45:00.000Z",
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    title: "Équipe terrain — Photo de groupe",
    description: "Photo officielle de l'équipe après la descente clinique à Bukavu.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    category: "Descente Terrain Clinique",
    fileSize: "1.8 MB",
    createdAt: "2025-07-30T08:20:00.000Z",
  },
  {
    id: "f6a7b8c9-d0e1-2345-f012-456789012345",
    title: "Séminaire — Accès à la justice",
    description: "Intervention du directeur lors du séminaire sur l'accès à la justice en RDC.",
    type: "VIDEO",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600",
    category: "Conférence",
    fileSize: "128 MB",
    createdAt: "2025-06-12T10:30:00.000Z",
  },
  {
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    title: "Publication scientifique — Session de relecture",
    description: "Moment de relecture collective d'un article soumis à publication.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600",
    category: "Recherche",
    fileSize: "2.0 MB",
    createdAt: "2025-05-25T13:10:00.000Z",
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    title: "Formation des assistants juridiques",
    description: "Module de formation pratique pour les nouveaux assistants de la clinique.",
    type: "VIDEO",
    source: "EXTERNAL",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    category: "Formation",
    createdAt: "2025-04-18T09:00:00.000Z",
  },
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    title: "Inauguration du nouveau centre",
    description: "Cérémonie officielle d'inauguration des locaux du CREDDA-ULPGL.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600",
    category: "Événement Institutionnel",
    fileSize: "4.2 MB",
    createdAt: "2025-03-10T15:30:00.000Z",
  },
  {
    id: "d0e1f2a3-b4c5-6789-3456-890123456789",
    title: "Documentaire — Impact de la clinique juridique",
    description: "Témoignages de bénéficiaires et retour sur les actions de la clinique mobile.",
    type: "VIDEO",
    source: "EXTERNAL",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    thumbnailUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600",
    category: "Descente Terrain Clinique",
    createdAt: "2025-02-28T17:00:00.000Z",
  },
  {
    id: "e1f2a3b4-c5d6-7890-4567-901234567890",
    title: "Hackathon recherche — Session finale",
    description: "Présentation des prototypes développés lors du hackathon inter-universitaire.",
    type: "IMAGE",
    source: "LOCAL",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
    category: "Laboratoire KuleLab",
    fileSize: "2.7 MB",
    createdAt: "2025-01-15T12:45:00.000Z",
  },
];

export function computeStorageStats(items: MediaItem[]): StorageStats {
  const totalBytes = items.reduce((acc, item) => {
    if (!item.fileSize) return acc;
    const match = item.fileSize.match(/^([\d.]+)\s*(MB|GB|KB)$/i);
    if (!match) return acc;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    const multiplier = unit === "GB" ? 1024 * 1024 * 1024 : unit === "MB" ? 1024 * 1024 : 1024;
    return acc + value * multiplier;
  }, 0);

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const totalCapacityBytes = 5 * 1024 * 1024 * 1024;
  const usedSpace = formatBytes(totalBytes);
  const totalCapacity = "5.0 GB";

  return {
    totalFiles: items.length,
    usedSpace,
    totalCapacity,
    usagePercent: Math.min(Math.round((totalBytes / totalCapacityBytes) * 100), 100),
  };
}
