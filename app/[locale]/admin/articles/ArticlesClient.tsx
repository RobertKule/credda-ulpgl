"use client";

import { useState, useTransition } from "react";
import { 
  FileText, Edit, Trash2, Search, Filter,
  Newspaper, Eye, EyeOff, Plus, Microscope, Scale,
  BookOpen, Download, Calendar, Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteArticle, toggleArticleStatus } from "@/services/article-actions";
import { deletePublication } from "@/services/publication-actions";
import { Link } from "@/navigation";
import { toast } from "react-hot-toast";

export default function ArticlesClient({ 
  content: initialContent,
  locale 
}: { 
  content: any[],
  locale: string
}) {
  const [content, setContent] = useState(initialContent);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, ARTICLE, PUBLICATION
  const [isPending, startTransition] = useTransition();

  const filteredContent = content.filter(item => {
    const translation = item.translations[0] || { title: "" };
    const matchesSearch = translation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.slug || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === "ALL" || item.domain === domainFilter;
    const matchesType = typeFilter === "ALL" || item.__type === typeFilter;
    return matchesSearch && matchesDomain && matchesType;
  });

  const handleDelete = async (item: any) => {
    if (!confirm(`Confirmer la suppression de cet élément (${item.__type}) ? Action irréversible.`)) return;
    
    startTransition(async () => {
      const result = item.__type === 'ARTICLE' 
        ? await deleteArticle(item.id) 
        : await deletePublication(item.id);

      if (result.success) {
        toast.success("Élément supprimé avec succès");
        setContent(prev => prev.filter(i => i.id !== item.id));
      } else {
        toast.error("Échec de la suppression");
      }
    });
  };

  const handleToggleStatus = async (item: any) => {
    if (item.__type !== 'ARTICLE') return;
    
    startTransition(async () => {
      const result = await toggleArticleStatus(item.id, item.published);
      if (result.success) {
        setContent(prev => prev.map(i => i.id === item.id ? { ...i, published: !item.published } : i));
        toast.success(item.published ? "Passé en brouillon" : "Publié avec succès");
      } else {
        toast.error("Échec de la mise à jour");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-card p-6 border border-border rounded-3xl shadow-sm transition-colors">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par titre ou slug..." 
            className="w-full pl-12 pr-4 py-3 bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium rounded-xl text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3">
             <Tag size={16} className="text-muted-foreground/30" />
             <select 
               className="bg-muted/40 border border-border px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
             >
               <option value="ALL">Tous les Types</option>
               <option value="ARTICLE">Articles</option>
               <option value="PUBLICATION">Publications PDF</option>
             </select>
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-muted-foreground/30" />
            <select 
              className="bg-muted/40 border border-border px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              <option value="ALL">Tous les Domaines</option>
              <option value="RESEARCH">Recherche</option>
              <option value="CLINICAL">Clinique</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredContent.map((item) => {
          const translation = item.translations[0] || { title: "Sans titre" };
          const category = item.category?.translations[0]?.name || (item.__type === 'PUBLICATION' ? 'Archive' : 'Non classé');
          
          return (
            <div key={item.id} className="bg-card border border-border p-6 rounded-[2rem] flex flex-col gap-6 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
               {/* Label Type */}
               <div className={`absolute top-0 right-10 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-b-xl ${item.__type === 'ARTICLE' ? 'bg-primary text-primary-foreground' : 'bg-indigo-600 text-white'}`}>
                  {item.__type}
               </div>

              <div className="flex gap-6">
                 <div className="w-20 h-24 bg-muted/30 flex flex-col items-center justify-center border border-border shrink-0 group-hover:bg-primary/5 transition-colors relative overflow-hidden rounded-2xl">
                   {item.mainImage ? (
                     <img src={item.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                   ) : (
                     <div className="text-muted-foreground/10">
                        {item.__type === 'ARTICLE' ? <Newspaper size={32} /> : <BookOpen size={32} />}
                     </div>
                   )}
                   <div className="relative z-10">
                     {item.domain === 'RESEARCH' ? <Microscope size={24} className="text-primary" /> : <Scale size={24} className="text-emerald-500" />}
                   </div>
                 </div>

                 <div className="flex-1 space-y-3 min-w-0">
                   <div className="space-y-1">
                     <div className="flex items-center gap-2 mb-2">
                       <Badge variant="outline" className="rounded-md text-[8px] font-black tracking-widest uppercase px-2 py-0.5 border-border text-muted-foreground/60">
                         {category}
                       </Badge>
                       {item.__type === 'ARTICLE' && (
                          <div className={`w-2 h-2 rounded-md ${item.published ? 'bg-emerald-500 shadow-[0_0_8px_var(--emerald-500)]' : 'bg-amber-500'} animate-pulse`} />
                       )}
                     </div>
                     <h3 className="font-serif font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                       {translation.title}
                     </h3>
                     <p className="text-[10px] font-mono text-muted-foreground/20 truncate">
                       /{item.slug || item.id}
                     </p>
                   </div>
                 </div>
              </div>

               <div className="flex items-center justify-between pt-4 border-t border-border/10">
                  <div className="flex items-center gap-4">
                     {item.__type === 'ARTICLE' ? (
                        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${item.published ? 'text-emerald-500' : 'text-amber-500'}`}>
                           {item.published ? <Eye size={12} /> : <EyeOff size={12} />} {item.published ? 'Live' : 'Brouillon'}
                        </div>
                     ) : (
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary">
                           <Calendar size={12} /> {item.year}
                        </div>
                     )}
                  </div>

                  <div className="flex gap-2">
                    {item.__type === 'ARTICLE' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`h-10 w-10 rounded-xl ${item.published ? 'text-emerald-600 hover:bg-emerald-50/20' : 'text-amber-500 hover:bg-amber-50/20'}`}
                        onClick={() => handleToggleStatus(item)}
                        disabled={isPending}
                        title={item.published ? "Passer en Brouillon" : "Publier"}
                      >
                        {item.published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    )}
                    
                    <Button size="icon" variant="ghost" asChild className="h-10 w-10 rounded-xl text-muted-foreground/30 hover:text-primary hover:bg-[#C9A84C]/5">
                      <Link href={`/admin/articles/edit/${item.id}${item.__type === 'PUBLICATION' ? '?type=PUBLICATION' : ''}`}>
                        <Edit size={18} />
                      </Link>
                    </Button>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 rounded-xl text-muted-foreground/30 hover:text-red-600 hover:bg-red-50/20"
                      onClick={() => handleDelete(item)}
                      disabled={isPending}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
               </div>
            </div>
          );
        })}
        
        {filteredContent.length === 0 && (
          <div className="col-span-full p-20 text-center bg-muted/20 border border-border border-dashed rounded-[3rem]">
            <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-muted-foreground/10" />
            </div>
            <p className="text-muted-foreground/60 font-serif italic text-lg">Aucun contenu trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}