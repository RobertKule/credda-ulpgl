// app/[locale]/admin/sessions/page.tsx
import { getAllClinicSessions } from "@/services/clinic-session-actions";
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
  Calendar, 
  Plus, 
  MapPin, 
  Edit, 
  Trash2, 
  Search,
  Users
} from "lucide-react";

export default async function SessionAdminPage() {
  const result = await getAllClinicSessions();
  const sessions = result.success ? result.data : [];

  return (
    <div className="space-y-8 p-6 sm:p-10 bg-background transition-colors min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Calendar className="text-emerald-500" size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Planning & Logistics</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-foreground tracking-tight">
            Cliniques <span className="text-muted-foreground/40 font-light italic">Mobiles</span>
          </h1>
          <p className="text-muted-foreground/60 text-sm font-medium mt-1">Organisez les sorties terrain et les sessions de sensibilisation.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] h-12 px-6 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95">
          <Plus size={18} className="mr-2" />
          Nouvelle Session
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une location ou un titre..." 
              className="pl-10 h-10 w-full text-xs font-bold uppercase tracking-widest bg-muted/40 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/20 text-foreground"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/10 hover:bg-muted/10 border-b border-border">
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 px-6 text-foreground">Date / Session</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-foreground">Localisation</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-foreground">Type</TableHead>
              <TableHead className="font-black text-muted-foreground/40 uppercase text-[10px] tracking-[0.2em] h-14 text-foreground">Statut</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-[0.2em] h-14 px-6 text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                   Aucune session planifiée.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((s: any) => (
                <TableRow key={s.id} className="hover:bg-muted/30 border-b border-border last:border-0 transition-colors group">
                  <TableCell className="py-6 px-6">
                    <div className="font-black text-foreground text-sm group-hover:text-primary transition-colors">{s.title}</div>
                    <div className="text-[10px] text-muted-foreground/40 font-black uppercase mt-1.5 tracking-widest">
                      {new Date(s.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[11px] flex items-center gap-2 font-black uppercase tracking-wider text-muted-foreground/60">
                      <div className="p-1.5 bg-muted/50 rounded-lg">
                        <MapPin size={12} className="text-primary" />
                      </div>
                      {s.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.isMobile ? (
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest rounded-lg border-blue-500/20 bg-blue-500/5 text-blue-500 px-3 py-1">Mobile</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest rounded-lg border-muted-foreground/20 bg-muted/30 text-muted-foreground/60 px-3 py-1">Fixe</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(s.date) > new Date() ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] uppercase font-black tracking-widest px-3 py-1">À venir</Badge>
                    ) : (
                      <Badge className="bg-muted/40 text-muted-foreground/30 border border-border rounded-lg text-[9px] uppercase font-black tracking-widest px-3 py-1">Passé</Badge>
                    )}
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
