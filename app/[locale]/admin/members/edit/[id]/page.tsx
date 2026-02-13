import { db } from "@/lib/db";
import { MemberForm } from "@/components/admin/MemberForm";
import { notFound } from "next/navigation";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;

  const member = await db.member.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!member) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Modifier le Membre</h1>
      <MemberForm initialData={member} locale={locale} />
    </div>
  );
}