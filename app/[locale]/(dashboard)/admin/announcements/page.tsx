import React from "react";
import AnnouncementsClient from "./AnnouncementsClient";
import { getAnnouncements } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnnouncementsAdminPage({ params }: PageProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

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

  const initialData = await getAnnouncements().catch(() => []);

  return (
    <div className="py-6">
      <AnnouncementsClient locale={locale} initialData={initialData} />
    </div>
  );
}
