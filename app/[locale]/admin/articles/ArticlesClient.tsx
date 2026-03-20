// app/[locale]/admin/articles/ArticlesClient.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  FileText, Edit, Trash2, Search, Filter,
  CheckCircle2, Circle, Star, StarOff,
  Newspaper, Eye, EyeOff, Plus, Microscope, Scale,
  ExternalLink, Calendar, Hash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteArticle, toggleArticleStatus } from "@/services/article-actions";
import { Link } from "@/navigation";
import { toast } from "react-hot-toast";

interface Article {
  id: string;
  slug: string;
  domain: string;
  published: boolean;
  featured: boolean;
  mainImage: string | null;
  translations: {
    title: string;
    content: string;
  }[];
  category: {
    translations: {
      name: string;
    }[];
  };
}

export default function ArticlesClient({ 
  articles: initialArticles,
  locale 
}: { 
  articles: Article[],
  locale: string
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filteredArticles = articles.filter(a => {
    const content = a.translations[0] || { title: "" };
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === "ALL" || a.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action is permanent.")) return;
    
    startTransition(async () => {
      const result = await deleteArticle(id);
      if (result.success) {
        toast.success("Article deleted successfully");
        setArticles(prev => prev.filter(a => a.id !== id));
      } else {
        toast.error("Failed to delete article");
      }
    });
  };

  const handleToggleStatus = async (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleArticleStatus(id, current);
      if (result.success) {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, published: !current } : a));
        toast.success(current ? "Article set to draft" : "Article published");
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or slug..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="ALL">All Domains</option>
            <option value="RESEARCH">Research</option>
            <option value="CLINICAL">Clinical</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredArticles.map((a) => {
          const content = a.translations[0] || { title: "Untitled" };
          const category = a.category?.translations[0]?.name || "Uncategorized";
          
          return (
            <div key={a.id} className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
              <div className="w-20 h-24 bg-slate-50 flex flex-col items-center justify-center border border-slate-100 shrink-0 group-hover:bg-blue-50 transition-colors relative overflow-hidden">
                {a.mainImage ? (
                  <img src={a.mainImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
                ) : (
                  <Newspaper size={32} className="text-slate-200 group-hover:text-blue-200 transition-colors" />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  {a.domain === 'RESEARCH' ? <Microscope size={24} className="text-blue-600" /> : <Scale size={24} className="text-emerald-600" />}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`rounded-none text-[8px] font-black tracking-widest uppercase px-2 py-0.5 ${
                      a.domain === 'RESEARCH' ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}>
                      {a.domain}
                    </Badge>
                    <Badge variant="outline" className="rounded-none text-[8px] font-black tracking-widest uppercase px-2 py-0.5 border-slate-200 text-slate-500">
                      {category}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${a.published ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    /{a.slug}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                   <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${a.published ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {a.published ? <Eye size={12} /> : <EyeOff size={12} />} {a.published ? 'Live' : 'Draft'}
                   </div>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-10 w-10 ${a.published ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-500 hover:bg-amber-50'}`}
                  onClick={() => handleToggleStatus(a.id, a.published)}
                  disabled={isPending}
                  title={a.published ? "Set to Draft" : "Publish"}
                >
                  {a.published ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button size="icon" variant="ghost" asChild className="h-10 w-10 text-slate-400 hover:text-blue-600">
                  <Link href={`/admin/articles/edit/${a.id}`}>
                    <Edit size={18} />
                  </Link>
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10 text-slate-400 hover:text-red-600"
                  onClick={() => handleDelete(a.id)}
                  disabled={isPending}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          );
        })}
        
        {filteredArticles.length === 0 && (
          <div className="col-span-full p-20 text-center bg-slate-50 border border-slate-200 border-dashed">
            <Search size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-serif italic">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}