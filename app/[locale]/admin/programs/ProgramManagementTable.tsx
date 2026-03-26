// app/[locale]/admin/programs/ProgramManagementTable.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  Briefcase, Edit, Trash2, Search, Filter,
  CheckCircle2, Circle, Star, StarOff,
  Layout, Eye, EyeOff, Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  deleteProgram, 
  toggleProgramPublished, 
  toggleProgramFeatured 
} from "@/services/program-actions";
import { Link } from "@/navigation";
import { toast } from "react-hot-toast";

interface Program {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  mainImage: string | null;
  translations: {
    title: string;
    description: string;
  }[];
}

export default function ProgramManagementTable({ 
  initialPrograms,
  locale 
}: { 
  initialPrograms: Program[],
  locale: string
}) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredPrograms = programs.filter(p => {
    const content = p.translations[0] || { title: "", description: "" };
    return content.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           content.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    
    startTransition(async () => {
      const result = await deleteProgram(id);
      if (result.success) {
        toast.success("Program deleted");
        setPrograms(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  };

  const handleTogglePublished = async (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleProgramPublished(id, !current);
      if (result.success) {
        setPrograms(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p));
        toast.success(current ? "Program unpublished" : "Program published");
      }
    });
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    startTransition(async () => {
      const result = await toggleProgramFeatured(id, !current);
      if (result.success) {
        setPrograms(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
        toast.success(current ? "Removed from featured" : "Added to featured");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search programs..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.map((p) => {
          const content = p.translations[0] || { title: "Untitled", description: "No description" };
          return (
            <div key={p.id} className="bg-white border border-slate-200 overflow-hidden group hover:border-blue-500 transition-all flex flex-col">
              <div className="h-24 bg-slate-50 relative overflow-hidden shrink-0">
                {p.mainImage ? (
                  <img src={p.mainImage} alt="" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <Layout size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => handleToggleFeatured(p.id, p.featured)}
                    className={`p-1.5 rounded-md transition-all ${p.featured ? 'bg-amber-500 text-white' : 'bg-white/80 text-slate-400 hover:text-amber-500'}`}
                  >
                    <Star size={16} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`rounded-none text-[8px] font-black tracking-widest uppercase px-2 py-0.5 ${
                      p.published ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}>
                      {p.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <h3 className="font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {content.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className={`h-8 w-8 p-0 ${p.published ? 'text-emerald-600' : 'text-slate-400'}`}
                      onClick={() => handleTogglePublished(p.id, p.published)}
                      disabled={isPending}
                    >
                      {p.published ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600" asChild>
                      <Link href={`/admin/programs/${p.id}/edit`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                    onClick={() => handleDelete(p.id)}
                    disabled={isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
