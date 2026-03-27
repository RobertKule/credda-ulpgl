// app/[locale]/admin/publications/PublicationManagementTable.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  FileText, Download, Edit, Trash2, 
  Search, Filter, Calendar, Hash,
  ArrowRight, ExternalLink, Globe,
  FlaskConical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePublication } from "@/services/publication-actions";
import { Link } from "@/navigation";
import { toast } from "react-hot-toast";

interface Publication {
  id: string;
  year: number;
  doi: string | null;
  pdfUrl: string;
  domain: string;
  translations: {
    title: string;
    authors: string;
  }[];
}

export default function PublicationManagementTable({ 
  initialPublications,
  locale 
}: { 
  initialPublications: Publication[],
  locale: string
}) {
  const [publications, setPublications] = useState(initialPublications);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filteredPubs = publications.filter(p => {
    const content = p.translations[0] || { title: "", authors: "" };
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          content.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.doi?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === "ALL" || p.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication? This action is permanent.")) return;
    
    startTransition(async () => {
      const result = await deletePublication(id);
      if (result.success) {
        toast.success("Publication deleted successfully");
        setPublications(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error("Failed to delete publication");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 border border-border rounded-xl shadow-sm transition-colors">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, authors or DOI..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-muted-foreground/30" />
          <select 
            className="bg-muted/40 border border-border px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="ALL">All Domains</option>
            <option value="RESEARCH">Research Papers</option>
            <option value="CLINICAL">Clinical Reports</option>
          </select>
        </div>
      </div>

      {/* Grid view for a more modern experience */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredPubs.map((p) => {
          const content = p.translations[0] || { title: "Untitled", authors: "Unknown" };
          return (
            <div key={p.id} className="bg-card border border-border p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden rounded-[2rem]">
              {/* Background accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-700 rounded-md ${p.domain === 'RESEARCH' ? 'bg-primary' : 'bg-emerald-600'}`} />
              
              <div className="w-16 h-20 bg-muted/30 flex flex-col items-center justify-center border border-border shrink-0 group-hover:bg-primary/5 transition-colors rounded-xl overflow-hidden">
                <FileText size={32} className="text-muted-foreground/10 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black uppercase text-muted-foreground/40 mt-1">{p.year}</span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`rounded-md text-[8px] font-black tracking-widest uppercase px-2 py-0.5 ${
                      p.domain === 'RESEARCH' ? 'bg-primary text-primary-foreground' : 'bg-emerald-600 text-white'
                    }`}>
                      {p.domain}
                    </Badge>
                    {p.doi && (
                      <span className="text-[9px] font-mono text-muted-foreground/30 flex items-center gap-1">
                        <Hash size={10} /> {p.doi}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-xs text-muted-foreground italic font-medium">
                    {content.authors}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-wider">
                     <Calendar size={12} className="text-muted-foreground/20" /> {p.year}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-wider">
                     <Globe size={12} className="text-muted-foreground/20" /> Open Access
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-6">
                <Button size="icon" variant="ghost" asChild className="h-10 w-10 text-muted-foreground/30 hover:text-primary transition-all">
                  <Link href={`/admin/publications/${p.id}/edit`}>
                    <Edit size={18} />
                  </Link>
                </Button>
                <Button size="icon" variant="ghost" asChild className="h-10 w-10 text-muted-foreground/30 hover:text-primary transition-all" title="View PDF">
                  <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={18} />
                  </a>
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10 text-muted-foreground/30 hover:text-red-500 transition-all"
                  onClick={() => handleDelete(p.id)}
                  disabled={isPending}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          );
        })}
        
        {filteredPubs.length === 0 && (
          <div className="col-span-full p-20 text-center bg-muted/20 border border-border border-dashed rounded-[3rem]">
            <Search size={48} className="mx-auto text-muted-foreground/10 mb-4" />
            <p className="text-muted-foreground/40 font-serif italic text-lg">No publications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
