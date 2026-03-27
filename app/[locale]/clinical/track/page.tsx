// app/[locale]/clinical/track/page.tsx
import { getCasesByPhone } from "@/services/clinical-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Gavel,
  History
} from "lucide-react";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

export default async function TrackCasePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ phone?: string }>
}) {
  const { locale } = await params;
  const { phone } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'Track' });

  let cases: any[] = [];
  let searched = false;

  if (phone) {
    searched = true;
    const result = await getCasesByPhone(phone);
    if (result.success) {
      cases = result.data;
    }
  }

  const statusColors: any = {
    NEW: "bg-blue-100 text-blue-700",
    IN_ANALYSIS: "bg-amber-100 text-amber-700",
    MEETING_SCHEDULED: "bg-purple-100 text-purple-700",
    ACTION_ENGAGED: "bg-emerald-600/20 text-emerald-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
    CLOSED: "bg-slate-100 text-slate-500",
  };

  return (
    <main className="min-h-screen bg-emerald-50/20 pt-32 pb-48">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header */}
        <div className="text-center space-y-8 mb-20">
           <div className="inline-flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em]">
              <ShieldCheck size={20} />
              <span>{t('badge')}</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-serif font-black text-emerald-900 dark:text-emerald-400 leading-tight">
             {t.rich('title', { span: (chunks) => <span className="italic">{chunks}</span> })}
           </h1>
           <p className="text-anthracite/40 font-light text-xl max-w-xl mx-auto">
             {t('description')}
           </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-emerald-100 p-2 shadow-3xl mb-20 flex flex-col md:flex-row gap-2">
           <form action="" className="flex-1 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-200" size={20} />
                 <Input 
                   name="phone" 
                   defaultValue={phone}
                   placeholder={t('placeholder')}
                   className="h-16 pl-16 rounded-md border-none focus-visible:ring-0 text-lg font-serif"
                 />
              </div>
              <Button type="submit" className="bg-emerald-700 text-white h-16 rounded-md px-12 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-900 transition-all">
                {t('submit')}
              </Button>
           </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-6">
               <h3 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400">{t('results_title')} ({cases.length})</h3>
               <History size={20} className="text-emerald-200" />
            </div>

            {cases.length > 0 ? (
              <div className="grid gap-6">
                {cases.map((c) => (
                  <div key={c.id} className="bg-white border border-emerald-100 p-10 hover:border-emerald-500 transition-all group">
                     <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 flex-1">
                           <div className="flex items-center gap-4">
                              <Badge className={`rounded-md border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${statusColors[c.status] || "bg-slate-100 text-slate-500"}`}>
                                {c.status.replace('_', ' ')}
                              </Badge>
                              <span className="text-[10px] font-black uppercase tracking-widest text-anthracite/30">ID: {c.id.substring(0, 8)}</span>
                           </div>
                           <h4 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400 group-hover:text-emerald-600 transition-colors">{c.title}</h4>
                           <p className="text-anthracite/60 font-light text-sm line-clamp-2">{c.description}</p>
                        </div>
                        <div className="md:text-right space-y-2">
                           <p className="text-[9px] font-black uppercase tracking-widest text-anthracite/30">{t('last_update')}</p>
                           <div className="flex items-center md:justify-end gap-2 text-emerald-700 font-black text-xs uppercase">
                              <Clock size={14} className="text-emerald-500" />
                              {new Date(c.updatedAt).toLocaleDateString()}
                           </div>
                        </div>
                     </div>
                     <div className="mt-10 pt-8 border-t border-emerald-50 flex justify-between items-center">
                        <Link href={`#`} className="text-[9px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2 group/link opacity-50 cursor-not-allowed">
                          View Details <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        <Gavel size={16} className="text-emerald-100" />
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white border border-emerald-100 space-y-6">
                 <AlertCircle size={48} className="mx-auto text-emerald-200" strokeWidth={1} />
                 <h4 className="text-2xl font-serif font-black text-emerald-900 dark:text-emerald-400">{t('no_records')}</h4>
                 <p className="text-anthracite/40 font-light max-w-sm mx-auto">{t('no_records_desc')}</p>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
             <div className="p-10 border border-emerald-100 bg-white space-y-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 w-fit">
                   <ShieldCheck size={28} />
                </div>
                <h4 className="font-serif font-black text-emerald-900 uppercase text-xs tracking-widest">{t('confidentiality_title')}</h4>
                <p className="text-sm text-anthracite/50 font-light leading-relaxed">{t('confidentiality_desc')}</p>
             </div>
             <div className="p-10 border border-emerald-100 bg-white space-y-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 w-fit">
                   <Gavel size={28} />
                </div>
                <h4 className="font-serif font-black text-emerald-900 uppercase text-xs tracking-widest">{t('authority_title')}</h4>
                <p className="text-sm text-anthracite/50 font-light leading-relaxed">{t('authority_desc')}</p>
             </div>
          </div>
        )}

      </div>
    </main>
  );
}
