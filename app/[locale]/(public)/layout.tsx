import React from "react";
import AnnouncementBanner from "@/components/shared/AnnouncementBanner";
import { getActiveAnnouncement } from "../(dashboard)/admin/announcements/actions";

export default async function PublicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const activeAnnouncement = await getActiveAnnouncement(locale);

  const announcement = activeAnnouncement ? {
    id: activeAnnouncement.id,
    level: activeAnnouncement.level as "INFO" | "WARNING" | "URGENT",
    title: activeAnnouncement.title || undefined,
    content: activeAnnouncement.content,
  } : null;

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBanner announcement={announcement} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
