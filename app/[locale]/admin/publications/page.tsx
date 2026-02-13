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
}

export default async function AdminPublicationsPage({ params }: Props) {
  const { locale } = await params;

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
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600">
                      <FileText size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{p.translations[0]?.title || "Sans titre"}</span>
                      <span className="text-[10px] text-slate-400 italic">{p.translations[0]?.authors}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <Badge variant="outline" className="rounded-none border-slate-200 font-mono">{p.year}</Badge>
                </td>
                <td className="p-4 text-[10px] font-bold uppercase tracking-tight">
                  {p.domain === "RESEARCH" ? "Scientifique" : "Clinique"}
                </td>
                <td className="p-4 font-mono text-[10px] text-slate-400">
                  {p.doi || "N/A"}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" asChild>
                      <a href={p.pdfUrl} target="_blank"><Download size={16} /></a>
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