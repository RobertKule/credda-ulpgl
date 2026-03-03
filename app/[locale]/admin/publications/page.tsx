import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Plus, Trash2, Edit, ExternalLink,
  Download, Hash, Calendar
} from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton"; // Composant générique


interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ updated?: string }>;
}

export default async function AdminPublicationsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { updated } = await searchParams;


  const publications = await db.publication.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { year: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Bibliothèque Numérique</h1>
          <p className="text-slate-500 text-sm">Gestion des rapports et articles scientifiques (PDF).</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-none">
          <Link href="/admin/publications/new" className="flex items-center gap-2">
            <Plus size={18} /> Ajouter un PDF
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        {updated && (
          <div className="bg-emerald-50 text-emerald-700 p-4">
            Publication mise à jour avec succès
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Document</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Année</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Domaine</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Identifiant DOI</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {publications.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                {/* Document */}
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-slate-900 leading-tight">
                        {p.translations[0]?.title || <span className="italic text-slate-400">Sans titre</span>}
                      </p>
                      <p className="text-xs text-slate-400 italic mt-0.5">
                        {p.translations[0]?.authors}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Année */}
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar size={13} className="text-slate-400" />
                    {p.year}
                  </div>
                </td>

                {/* Domaine */}
                <td className="p-4">
                  <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest">
                    {p.domain}
                  </Badge>
                </td>

                {/* DOI */}
                <td className="p-4">
                  {p.doi ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <Hash size={12} className="text-slate-400" />
                      {p.doi}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 italic">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    {p.pdfUrl && (
                      <Button size="icon" variant="ghost" asChild title="Télécharger le PDF">
                        <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download size={15} />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild className="rounded-none">
                      <Link href={`/admin/publications/${p.id}/edit`} className="flex items-center gap-1.5">
                        <Edit size={13} /> Modifier
                      </Link>
                    </Button>
                    <DeleteButton id={p.id} type="publication" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}