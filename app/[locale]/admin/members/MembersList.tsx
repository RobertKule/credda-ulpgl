// app/[locale]/admin/members/MembersList.tsx
"use client";

import { useState, useTransition } from "react";
import { 
  UserPlus, Mail, Phone, MapPin, Award,
  Calendar, Edit, Trash2, Search, Filter,
  MoreVertical, ChevronRight, Hash, Globe,
  User, Microscope, Scale, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import { toast } from "react-hot-toast";

interface Member {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  email: string | null;
  order: number;
  translations: {
    role: string;
    bio: string | null;
  }[];
}

export default function MembersList({ 
  members: initialMembers,
  locale 
}: { 
  members: Member[],
  locale: string
}) {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredMembers = members.filter(m => {
    const content = m.translations[0] || { role: "" };
    return m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           content.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (m.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Search & Stats Area */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 border border-border shadow-sm rounded-xl transition-colors">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, role or email..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-tighter">Total Staff</span>
             <span className="text-sm font-bold text-foreground">{members.length}</span>
           </div>
           <div className="h-4 w-px bg-border" />
           <div className="flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-500" />
             <span className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-tighter">Verified Team</span>
           </div>
        </div>
      </div>

      {/* Grid view for researchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((m) => {
          const content = m.translations[0] || { role: "" };
          return (
            <div key={m.id} className="bg-card border border-border overflow-hidden hover:border-primary/50 transition-all group flex flex-col shadow-sm hover:shadow-xl hover:shadow-primary/5 rounded-2xl">
              <div className="h-32 bg-muted/30 relative overflow-hidden shrink-0 flex items-center justify-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
                
                {m.image ? (
                  <div className="relative w-24 h-24 rounded-xl border-4 border-card shadow-lg overflow-hidden z-10 translate-y-8 group-hover:scale-110 transition-transform duration-500">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-24 h-24 rounded-xl border-4 border-card shadow-lg bg-muted flex items-center justify-center z-10 translate-y-8 group-hover:scale-110 transition-transform duration-500 text-muted-foreground/30 text-xl font-black">
                    {getInitials(m.name)}
                  </div>
                )}
              </div>

              <div className="p-6 pt-12 flex-1 flex flex-col items-center text-center space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {content.role}
                  </p>
                </div>

                <div className="w-full space-y-2 pt-2 border-t border-border/10">
                   {m.email && (
                     <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        <Mail size={12} className="text-muted-foreground/20" /> {m.email}
                     </div>
                   )}
                   <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">
                      <Hash size={12} className="opacity-20" /> Order: {m.order}
                   </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 mt-auto w-full">
                  <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-muted-foreground/30 hover:text-primary transition-all rounded-lg" asChild>
                    <Link href={`/admin/members/${m.id}/edit`}>
                      <Edit size={16} />
                    </Link>
                  </Button>
                  <DeleteButton id={m.id} type="member" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state component already handled by initial logic if filteredMembers.length === 0 */}
      </div>

      {filteredMembers.length === 0 && (
          <div className="p-20 text-center bg-muted/20 border border-border border-dashed rounded-3xl">
            <UserPlus size={48} className="mx-auto text-muted-foreground/10 mb-4" />
            <p className="text-muted-foreground/40 font-serif italic">No team members found matching your search.</p>
          </div>
      )}
    </div>
  );
}