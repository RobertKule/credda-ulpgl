// app/[locale]/admin/resources/page.tsx
import { getAllLegalResources } from "@/services/resource-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Globe,
  BookOpen
} from "lucide-react";
import { Link } from "@/navigation";

export default async function ResourceAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const result = await getAllLegalResources(locale);
  // Pour l'admin, on veut idéalement toutes les ressources même non publiées, 
  // mais on va réutiliser getAllLegalResources ou en faire une spécifique plus tard.
  const resources = result.success ? result.data : [];

  return (
    <div className="space-y-8 p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-blue-700" size={24} />
            Bibliothèque Juridique (CDE)
          </h1>
          <p className="text-slate-500 text-sm">Gérez les textes de lois et ressources disponibles pour le public.</p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 rounded-md shadow-lg">
          <Plus size={18} className="mr-2" />
          Nouvelle Ressource
        </Button>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une ressource..." 
              className="pl-10 h-10 w-full text-sm border border-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Titre / Catégorie</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest text-center">Langues</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Statut</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Date</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  Aucune ressource enregistrée.
                </TableCell>
              </TableRow>
            ) : (
              resources.map((res: any) => (
                <TableRow key={res.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="py-4">
                    <div className="font-bold text-slate-900 text-sm">{res.translations?.[0]?.title || res.slug}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                      {res.category || "Général"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Badge variant="outline" className="text-[8px] h-4 px-1 rounded-md border-blue-100">FR</Badge>
                      <Badge variant="outline" className="text-[8px] h-4 px-1 rounded-md opacity-20">EN</Badge>
                      <Badge variant="outline" className="text-[8px] h-4 px-1 rounded-md opacity-20">SW</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {res.published ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none rounded-md text-[8px] uppercase font-bold">Publié</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-400 border-none rounded-md text-[8px] uppercase font-bold">Brouillon</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 text-primary rounded-md">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-500 rounded-md">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
