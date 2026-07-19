import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import MediathequeClient from "./MediathequeClient";
import type { MediaItem } from "@/lib/mediatheque/types";

export const dynamic = "force-dynamic";

async function getMediaItems(): Promise<MediaItem[]> {
  const galleryImages = await db.galleryImage.findMany({
    include: {
      translations: true,
      files: true,
    },
    orderBy: { order: "asc" },
  });

  return galleryImages.map((img) => {
    const translation = img.translations[0];

    // Détecter le type : VIDEO si au moins un fichier a fileType VIDEO,
    // ou si le src ressemble à une URL vidéo (mp4/webm/mov)
    const hasVideoFile = img.files.some(f =>
      f.fileType === "VIDEO" ||
      /\.(mp4|webm|mov)$/i.test(f.url)
    );
    const mediaType = hasVideoFile ? "VIDEO" : "IMAGE";

    const allFiles = img.files.map(f => ({
      url: f.url,
      thumbnailUrl: f.url,
      fileName: f.url.split("/").pop(),
      fileType: f.fileType,
    }));

    if (img.src && allFiles.length === 0) {
      allFiles.push({
        url: img.src,
        thumbnailUrl: img.src,
        fileName: img.src.split("/").pop(),
        fileType: mediaType,
      });
    }

    // Pour les vidéos : img.src contient la cover image uploadée
    // Pour les images : img.src est l'image principale
    const isVideo = mediaType === "VIDEO";
    const primaryUrl = isVideo
      ? (allFiles[0]?.url || img.src) // URL de la vidéo réelle
      : img.src;
    const coverImageUrl = isVideo ? img.src : undefined;
    const thumbnailUrl = isVideo ? (img.src || primaryUrl) : img.src;

    return {
      id: img.id,
      title: translation?.title || img.category,
      description: translation?.description || undefined,
      type: mediaType as "IMAGE" | "VIDEO",
      source: "LOCAL" as const,
      url: primaryUrl,
      thumbnailUrl,
      coverImageUrl,
      category: img.category,
      fileSize: undefined,
      createdAt: img.createdAt.toISOString(),
      files: allFiles,
    };
  });
}

export default async function GalleryAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  if (session.user.role === 'USER') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-black text-rose-600 mb-4">Accès Refusé</h2>
        <p className="text-slate-600 dark:text-zinc-400 font-medium max-w-md">
          Vous n'avez pas l'autorisation requise pour accéder à cet espace. Veuillez contacter l'admin.
        </p>
      </div>
    );
  }

  const mediaItems = await getMediaItems();

  return (
    <div className="w-full h-full">
      <MediathequeClient initialItems={mediaItems} />
    </div>
  );
}
