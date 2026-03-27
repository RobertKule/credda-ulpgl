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
    <div className="space-y-8 p-6 sm:p-10 bg-background transition-colors min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="p-1.5 bg-primary/10 rounded-lg">
                <BookOpen className="text-primary" size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Legal Archive</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-foreground tracking-tight transition-colors">
            Bibliothèque <span className="text-primary font-light italic">Juridique</span>
          </h1>
          <p className="text-muted-foreground/60 text-sm font-medium mt-1">Gérez les textes de lois et ressources disponibles pour le public.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] h-12 px-6 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
          <Plus size={18} className="mr-2" />
          Nouvelle Ressource
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une ressource..." 
              className="pl-10 h-10 w-full text-xs font-bold uppercase tracking-widest bg-muted/40 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/20 text-foreground"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10 border-b border-border">
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 px-6 text-foreground">Titre / Catégorie</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-center text-foreground">Langues</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-foreground">Statut</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-foreground">Date</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-[0.2em] h-14 px-6 text-foreground">Actions</TableHead>
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
                <TableRow key={res.id} className="hover:bg-muted/30 border-b border-border last:border-0 transition-colors group">
                  <TableCell className="py-6 px-6">
                    <div className="font-black text-foreground text-sm group-hover:text-primary transition-colors">{res.translations?.[0]?.title || res.slug}</div>
                    <div className="text-[10px] text-muted-foreground/40 font-black uppercase mt-1.5 tracking-widest">
                      {res.category || "Général"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1.5">
                      <Badge variant="outline" className="text-[8px] h-5 px-1.5 rounded-md border-primary/20 bg-primary/5 text-primary">FR</Badge>
                      <Badge variant="outline" className="text-[8px] h-5 px-1.5 rounded-md opacity-10 grayscale">EN</Badge>
                      <Badge variant="outline" className="text-[8px] h-5 px-1.5 rounded-md opacity-10 grayscale">SW</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {res.published ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] uppercase font-black tracking-widest px-3 py-1">Publié</Badge>
                    ) : (
                      <Badge className="bg-muted/40 text-muted-foreground/30 border border-border rounded-lg text-[9px] uppercase font-black tracking-widest px-3 py-1">Brouillon</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground/60 transition-colors">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-primary/10 text-muted-foreground/40 hover:text-primary rounded-xl transition-all">
                         <Edit size={18} />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive rounded-xl transition-all">
                         <Trash2 size={18} />
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
