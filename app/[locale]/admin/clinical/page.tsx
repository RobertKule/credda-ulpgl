// app/[locale]/admin/clinical/page.tsx
import { getAllClinicalCases } from "@/services/clinical-actions";
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
  Scale, 
  User, 
  Calendar, 
  AlertTriangle,
  Eye,
  Search,
  Edit3
} from "lucide-react";
import { Link } from "@/navigation";

export default async function ClinicianAdminPage() {
  const result = await getAllClinicalCases();
  const cases = result.success ? result.data : [];

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "HIGH": return <Badge className="bg-red-500 rounded-md">Critique</Badge>;
      case "MEDIUM": return <Badge className="bg-amber-500 rounded-md">Moyen</Badge>;
      case "LOW": return <Badge className="bg-primary/50 rounded-md">Mineur</Badge>;
      default: return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <Badge variant="outline" className="text-primary border-blue-600 rounded-md">Nouveau</Badge>;
      case "OPEN": return <Badge variant="outline" className="text-emerald-600 border-emerald-600 rounded-md">En cours</Badge>;
      case "CLOSED": return <Badge variant="outline" className="text-slate-600 border-slate-600 rounded-md">Traité</Badge>;
      default: return <Badge variant="outline" className="rounded-md">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="text-emerald-700" size={24} />
            Gestion des Cas Cliniques (CDE)
          </h1>
          <p className="text-slate-500 text-sm">Suivi des demandes d'assistance juridique environnementale.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-md">Exporter CSV</Button>
          <Button asChild className="bg-emerald-800 hover:bg-emerald-900 rounded-md">
            <Link href="/admin/clinical/new">Nouveau Cas</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un dossier or bénéficiaire..." 
              className="pl-10 h-10 w-full text-sm border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">ID / Date</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Bénéficiaire</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Type de Problème</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Urgence</TableHead>
              <TableHead className="font-bold text-slate-900 uppercase text-[10px] tracking-widest">Statut</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-widest px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                  Aucun dossier enregistré pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c: any) => (
                <TableRow key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="py-4">
                    <div className="font-bold text-slate-900 text-xs">#{c.id.substring(0, 8)}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar size={10} /> {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 text-xs">{c.beneficiary?.name}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <User size={10} /> {c.beneficiary?.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter bg-slate-100 px-2 py-0.5">
                      {c.problemType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getUrgencyBadge(c.urgency)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(c.status)}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button variant="ghost" size="sm" asChild className="rounded-md hover:bg-emerald-50 text-emerald-700">
                      <Link href={`/admin/clinical/${c.id}`} className="flex items-center gap-2">
                        <Eye size={14} />
                        Voir
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-md hover:bg-slate-100 text-slate-600">
                      <Link href={`/admin/clinical/${c.id}/edit`} className="flex items-center gap-2">
                        <Edit3 size={14} />
                        Éditer
                      </Link>
                    </Button>
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
