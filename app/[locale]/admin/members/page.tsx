// app/admin/members/page.tsx - SUPPRIMEZ "use client"
import { db } from "@/lib/db";
import MembersList from "./MembersList";
interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminMembersPage({ params }: Props) {
  const { locale } = await params;

  // ⚡ TOUT CE QUI EST ASYNC RESTE SUR LE SERVEUR
  const members = await db.member.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { order: "asc" },
  });

  // Les données sont PASSÉES au composant client
  return <MembersList members={members} locale={locale} />;
}