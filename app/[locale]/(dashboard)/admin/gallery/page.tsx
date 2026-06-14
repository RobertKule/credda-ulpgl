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
    },
    orderBy: { order: "asc" },
  });

  return galleryImages.map((img) => {
    const translation = img.translations[0];
    return {
      id: img.id,
      title: translation?.title || img.category,
      description: translation?.description || undefined,
      type: "IMAGE" as const,
      source: "LOCAL" as const,
      url: img.src,
      thumbnailUrl: img.src,
      category: img.category,
      fileSize: undefined,
      createdAt: img.createdAt.toISOString(),
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

  const mediaItems = await getMediaItems();

  return (
    <div className="w-full h-full">
      <MediathequeClient initialItems={mediaItems} />
    </div>
  );
}
