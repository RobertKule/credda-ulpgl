import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MOCK_MEDIA_ITEMS } from "@/lib/mediatheque/mock-data";
import MediathequeClient from "./MediathequeClient";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="w-full h-full">
      <MediathequeClient initialItems={MOCK_MEDIA_ITEMS} />
    </div>
  );
}
