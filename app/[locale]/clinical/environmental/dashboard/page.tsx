// app/[locale]/clinical/environmental/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Gavel,
  ChevronRight
} from "lucide-react";
import { getCasesByPhone } from "@/services/clinical-actions";
import { Link } from "@/navigation";

export default function BeneficiaryDashboard() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getCasesByPhone(phone);
      if (result.success) {
        setCases(result.data);
      } else {
        setError(result.error ?? "Erreur lors de la recherche.");
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW": return <Badge className="bg-blue-500 rounded-none uppercase text-[10px]">Nouveau</Badge>;
      case "OPEN": return <Badge className="bg-emerald-500 rounded-none uppercase text-[10px]">En cours</Badge>;
      case "CLOSED": return <Badge className="bg-slate-500 rounded-none uppercase text-[10px]">Clôturé</Badge>;
      case "ON_HOLD": return <Badge className="bg-amber-500 rounded-none uppercase text-[10px]">En attente</Badge>;
      default: return <Badge variant="outline" className="rounded-none uppercase text-[10px]">{status}</Badge>;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <Link href="/clinical/environmental" className="text-emerald-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              <ChevronRight size={14} className="rotate-180" />
              Retour à la Clinique
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
              Suivi de <span>Mon Dossier</span>
            </h1>
            <p className="text-slate-500 font-light">Entrez votre numéro de téléphone pour voir l'état de vos demandes.</p>
          </div>
        </div>

        <Card className="rounded-none border-none shadow-xl mb-12">
          <CardHeader className="bg-emerald-900 text-white p-6 sm:p-8">
            <CardTitle className="text-xl font-serif">Rechercher mes dossiers</CardTitle>
            <CardDescription className="text-emerald-100/70">Utilisez le numéro de téléphone fourni lors de la soumission.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  placeholder="Ex: +243 812..." 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 rounded-none border-slate-200"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-emerald-800 hover:bg-emerald-900 h-12 rounded-none px-8 font-bold uppercase tracking-widest text-xs">
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Vérifier l'état"}
              </Button>
            </form>
            {error && <p className="mt-4 text-red-600 text-sm flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}
          </CardContent>
        </Card>

        {cases && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
              Dossiers trouvés ({cases.length})
            </h2>
            
            {cases.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-200 space-y-4">
                <AlertCircle className="mx-auto text-slate-300" size={48} strokeWidth={1} />
                <p className="text-slate-500 font-light">Aucun dossier trouvé pour ce numéro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cases.map((cc) => (
                  <Card key={cc.id} className="rounded-none border-slate-200 hover:border-emerald-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(cc.status)}
                            <Badge variant="outline" className="rounded-none text-[8px] uppercase">{cc.problemType}</Badge>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{cc.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2">{cc.description}</p>
                          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase">
                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(cc.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 uppercase tracking-tighter">REF: {cc.id.substring(0, 8)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-none h-auto py-2 font-bold uppercase text-[10px]">
                          Plus de détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
