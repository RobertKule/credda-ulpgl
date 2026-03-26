// app/[locale]/admin/clinical/[id]/page.tsx
import { getClinicalCaseById, updateClinicalCaseStatus, addCaseNote } from "@/services/clinical-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Scale, 
  User, 
  Calendar, 
  MapPin,
  Clock,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Send,
  UserCheck,
  Edit3
} from "lucide-react";
import { Link } from "@/navigation";
import { revalidatePath } from "next/cache";

interface Props {
  params: Promise<{ id: string, locale: string }>;
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getClinicalCaseById(id);
  const cc = result.success ? result.data : null;

  if (!cc) {
    return <div className="p-10 text-center">Cas non trouvé.</div>;
  }

  // Action pour changer le statut
  async function updateStatusAction(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    await updateClinicalCaseStatus(id, status);
  }

  // Action pour ajouter une note
  async function addNoteAction(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    // Pour cet exemple, on utilise un ID statique ou on le récupère du session
    await addCaseNote(id, content, "admin-system");
  }

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Link href="/admin/clinical" className="text-emerald-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              <ChevronRight size={14} className="rotate-180" />
              Retour à la liste
            </Link>
            <Link href={`/admin/clinical/${cc.id}/edit`} className="text-slate-500 text-xs font-bold flex items-center gap-1 hover:text-emerald-700 transition-all">
              <Edit3 size={14} />
              Modifier les faits
            </Link>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">
            Détails du Dossier <span>#{cc.id.substring(0, 8)}</span>
          </h1>
          <div className="flex items-center gap-3">
             <Badge className="rounded-none bg-emerald-100 text-emerald-800 border-none px-3">{cc.status}</Badge>
             <Badge variant="outline" className="rounded-none uppercase text-[8px] tracking-widest">{cc.problemType}</Badge>
          </div>
        </div>

        <form action={updateStatusAction} className="flex gap-2">
          <select name="status" defaultValue={cc.status} className="h-10 border border-slate-200 text-sm px-3 outline-none focus:ring-1 focus:ring-emerald-500">
            <option value="NEW">Nouveau</option>
            <option value="OPEN">En cours</option>
            <option value="ON_HOLD">En attente</option>
            <option value="CLOSED">Clôturé</option>
          </select>
          <Button type="submit" size="sm" className="bg-emerald-800 hover:bg-emerald-900 rounded-none uppercase text-[10px] h-10 px-4">
            Mettre à jour
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="font-serif">Description du Problème</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 border-l-4 border-emerald-600">
                <p className="text-slate-700 leading-relaxed font-light italic">"{cc.description}"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Localisation</h4>
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-600" />
                    {cc.location}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Date de l'incident</h4>
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-600" />
                    {cc.incidentDate ? new Date(cc.incidentDate).toLocaleDateString() : "Non précisée"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">Attentes du bénéficiaire</h4>
                <p className="text-slate-600 text-sm italic">{cc.expectations || "Non spécifiées"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes Cliniiciennes */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-700" />
              Historique des interventions
            </h3>

            <Card className="rounded-none border-slate-200">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {cc.notes?.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm">Aucune note pour le moment.</div>
                  ) : (
                    cc.notes.map((note: any) => (
                      <div key={note.id} className="p-6 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 uppercase tracking-tighter">
                            <UserCheck size={12} />
                            Clinique CREDDA
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <form action={addNoteAction} className="space-y-4">
                    <textarea 
                      name="content"
                      required
                      placeholder="Ajouter une note de suivi ou une recommandation juridique..." 
                      className="w-full min-h-[100px] p-4 text-sm border border-slate-200 rounded-none focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                    <Button type="submit" className="bg-emerald-800 hover:bg-emerald-900 rounded-none uppercase text-[10px] font-bold tracking-widest px-6">
                      <Send size={14} className="mr-2" />
                      Ajouter la Note
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar : Bénéficiaire Info */}
        <div className="space-y-8">
          <Card className="rounded-none border-none bg-emerald-900 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Bénéficiaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-md text-emerald-300">
                  <User size={24} />
                </div>
                <div>
                  <div className="font-bold text-xl">{cc.beneficiary?.name}</div>
                  <div className="text-emerald-100/50 text-xs font-bold uppercase tracking-widest">{cc.beneficiary?.type}</div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-100/50">Téléphone</span>
                  <span className="font-bold">{cc.beneficiary?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-100/50">E-mail</span>
                  <span className="font-bold">{cc.beneficiary?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-100/50">Ville/Territoire</span>
                  <span className="font-bold">{cc.beneficiary?.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase">
                <AlertTriangle size={16} />
                Urgence
              </div>
              <h4 className="text-2xl font-serif font-bold text-slate-900">{cc.urgency}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Le niveau d'urgence détermine le délai de traitement prioritaire par nos experts juridiques.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
