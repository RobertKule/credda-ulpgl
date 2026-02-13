import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, FileText, Edit, Trash2, Globe, 
  ExternalLink, Eye, Microscope, Scale 
} from "lucide-react";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton"; // On va le créer

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;

  const articles = await db.article.findMany({
    include: { 
      category: { include: { translations: { where: { language: locale } } } },
      translations: { where: { language: locale } } 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header de la page */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Gestion des Articles</h1>
          <p className="text-slate-500 text-sm">Contenus scientifiques et cliniques du centre.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-none">
          <Link href="/admin/articles/new" className="flex items-center gap-2">
            <Plus size={18} /> Nouvel Article
          </Link>
        </Button>
      </div>

      {/* Table / List */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Article / Titre</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Domaine</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Catégorie</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">
                      {a.translations[0]?.title || "Sans titre (traduisez-moi)"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">slug: {a.slug}</span>
                  </div>
                </td>
                <td className="p-4">
                  {a.domain === "RESEARCH" ? (
                    <Badge className="bg-blue-100 text-blue-700 border-none shadow-none rounded-none text-[9px] uppercase">
                      <Microscope size={10} className="mr-1" /> Recherche
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none rounded-none text-[9px] uppercase">
                      <Scale size={10} className="mr-1" /> Clinique
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-xs font-medium text-slate-600">
                  {a.category.translations[0]?.name || a.category.slug}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${a.published ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="text-xs text-slate-600">{a.published ? 'En ligne' : 'Brouillon'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" title="Voir sur le site">
                      <Link href={`/research/${a.slug}`} target="_blank"><Eye size={16} /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                      <Edit size={16} />
                    </Button>
                    <DeleteArticleButton id={a.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="p-20 text-center text-slate-400 italic text-sm">
            Aucun article dans la base de données.
          </div>
        )}
      </div>
    </div>
  );
}