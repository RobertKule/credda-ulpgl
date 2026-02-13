import { db } from "@/lib/db";
import { MemberForm } from "@/components/admin/MemberForm";
import { notFound } from "next/navigation";

export default async function EditMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>;
  searchParams: { updated?: string };
}) {
  const { id, locale } = await params;

  const member = await db.member.findUnique({
    where: { id },
    include: { translations: true },
  });

  if (!member) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      {searchParams.updated && (
        <div className="bg-emerald-50 text-emerald-700 p-4 border-l-4 border-emerald-500">
          Membre mis à jour avec succès
        </div>
      )}

      <h1 className="text-3xl font-serif font-bold mb-8">Modifier le Membre</h1>
      <MemberForm initialData={member} locale={locale} />
    </div>
  );
}
