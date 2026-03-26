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
    <div className="space-y-8 p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-emerald-700" size={24} />
            Gestion des Cliniques Mobiles
          </h1>
          <p className="text-slate-500 text-sm">Organisez les sorties terrain et les sessions de sensibilisation.</p>
        </div>
        <Button className="bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-lg">
          <Plus size={18} className="mr-2" />
          Nouvelle Session
        </Button>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une location ou un titre..." 
              className="pl-10 h-10 w-full text-sm border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Date / Session</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Localisation</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Type</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Statut</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
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
                <TableRow key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="py-4">
                    <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                      {new Date(s.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs flex items-center gap-1 font-medium text-slate-600">
                      <MapPin size={12} className="text-emerald-600" />
                      {s.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.isMobile ? (
                      <Badge variant="outline" className="text-[8px] rounded-md border-blue-100 text-blue-800">Mobile</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[8px] rounded-md border-slate-100 text-slate-800">Fixe</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(s.date) > new Date() ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none rounded-md text-[8px] uppercase font-bold">À venir</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-400 border-none rounded-md text-[8px] uppercase font-bold">Passé</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50 text-emerald-700 rounded-md">
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
