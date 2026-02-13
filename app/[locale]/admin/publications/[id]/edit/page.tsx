import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicationForm } from "@/components/admin/PublicationForm";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditPublicationPage({ params }: Props) {
  const { locale, id } = await params;

  const publication = await db.publication.findUnique({
    where: { id },
    include: { translations: true }
  });

  if (!publication) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">
          Modifier la publication
        </h1>
        <p className="text-sm text-slate-500">
          Mise à jour des informations scientifiques
        </p>
      </div>

      <PublicationForm
        initialData={publication}
        locale={locale}
      />
    </div>
  );
}
