import { MemberForm } from "@/components/admin/MemberForm";

export default async function NewMemberPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Ajouter un Chercheur</h1>
      <MemberForm locale={locale} />
    </div>
  );
}