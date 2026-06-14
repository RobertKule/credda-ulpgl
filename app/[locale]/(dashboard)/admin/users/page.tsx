import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsersAndTeam } from "./actions";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  // Fetch real users and team members from DB (with auto-seeding)
  const { users, members } = await getUsersAndTeam();

  // Map database structures to serializable UI structures
  const mappedUsers = users.map(u => ({
    id: u.id,
    name: u.name || "Utilisateur sans nom",
    email: u.email,
    role: u.role as 'SUPERADMIN' | 'ADMIN' | 'EDITOR' | 'USER',
    status: (u.status === 'APPROVED' ? 'ACTIVE' : u.status === 'REJECTED' ? 'SUSPENDED' : 'PENDING') as 'ACTIVE' | 'SUSPENDED' | 'PENDING',
    createdAt: u.createdAt.toISOString()
  }));

  const mappedMembers = members.map(m => {
    // Find translations
    const frTr = m.translations.find(t => t.language === 'fr');
    const enTr = m.translations.find(t => t.language === 'en');
    const swTr = m.translations.find(t => t.language === 'sw');

    return {
      id: m.id,
      name: m.name,
      email: m.email || undefined,
      imageUrl: m.image || undefined,
      order: m.order,
      slug: m.slug,
      titleFr: frTr?.role || "",
      titleEn: enTr?.role || "",
      titleSw: swTr?.role || "",
      bioFr: frTr?.bio || "",
      bioEn: enTr?.bio || "",
      bioSw: swTr?.bio || "",
    };
  });

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Gestion Utilisateurs & Équipe</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Gérez les comptes administratifs et configurez l'annuaire public des chercheurs du CREDDA.
          </p>
        </div>
      </div>

      <UsersClient 
        locale={locale} 
        initialUsers={mappedUsers} 
        initialMembers={mappedMembers} 
      />
    </div>
  );
}
