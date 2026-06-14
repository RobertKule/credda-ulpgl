import React from "react";
import AnnouncementsClient from "./AnnouncementsClient";
import { getAnnouncements } from "./actions";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnnouncementsAdminPage({ params }: PageProps) {
  const { locale } = await params;
  const initialData = await getAnnouncements().catch(() => []);

  return (
    <div className="py-6">
      <AnnouncementsClient locale={locale} initialData={initialData} />
    </div>
  );
}
