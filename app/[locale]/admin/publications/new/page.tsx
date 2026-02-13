import { PublicationForm } from "@/components/admin/PublicationForm";

export default async function NewPublicationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-serif font-bold mb-8">Nouveau Rapport / Article</h1>
      <PublicationForm locale={locale} />
    </div>
  );
}