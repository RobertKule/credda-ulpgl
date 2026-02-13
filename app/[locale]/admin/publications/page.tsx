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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((p) => (

                <div
                  key={p.id}
                  className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{p.year}</Badge>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {p.domain}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg">
                      {p.translations[0]?.title || "Sans titre"}
                    </h3>
                    <p className="text-xs text-slate-400 italic">
                      {p.translations[0]?.authors}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/publications/${p.id}/edit`}>
                        Modifier
                      </Link>
                    </Button>

                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={p.pdfUrl} target="_blank">
                          <Download size={16} />
                        </a>
                      </Button>

                      <DeleteButton id={p.id} type="publication" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </tbody>
        </table>
      </div>
    </div>
  );
}