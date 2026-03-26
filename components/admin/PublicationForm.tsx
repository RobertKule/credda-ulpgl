"use client"

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPublication, updatePublication } from "@/services/publication-actions";
import { useRouter } from "next/navigation";
import { FileText, Upload, CheckCircle2, X } from "lucide-react";
import axios from "axios";
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";
import { toast } from "react-hot-toast";

import { ModernMarkdownEditor } from "./shared/ModernMarkdownEditor"

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
];

export function PublicationForm({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [baseData, setBaseData] = useState({
    year: initialData?.year || new Date().getFullYear(),
    doi: initialData?.doi || "",
    pdfUrl: initialData?.pdfUrl || "",
    domain: initialData?.domain || "RESEARCH",
  });

  const [translations, setTranslations] = useState<any>(() => {
    const t: any = {};
    LANGUAGES.forEach(lang => {
      const existing = initialData?.translations?.find((ex: any) => ex.language === lang.code);
      t[lang.code] = { 
        title: existing?.title || "", 
        authors: existing?.authors || "", 
        description: existing?.description || "" 
      };
    });
    return t;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "pdf");

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data.url) {
        setBaseData({ ...baseData, pdfUrl: res.data.url });
        toast.success("Document PDF téléchargé !");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!baseData.pdfUrl) {
      toast.error("Veuillez uploader le document PDF");
      return;
    }

    showLoading(initialData ? "Mise à jour de la publication..." : "Publication du document scientifique...");
    const payload = {
      ...baseData,
      translations: LANGUAGES.map(lang => ({
        language: lang.code,
        ...translations[lang.code]
      }))
    };

    try {
      const res = initialData
        ? await updatePublication(initialData.id, payload)
        : await createPublication(payload);

      if (res.success) {
        toast.success("Publication enregistrée !");
        router.push(`/${locale}/admin/publications`);
        router.refresh();
      } else {
        toast.error(res.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SECTION DOCUMENT PDF - LUXE DARK STYLE */}
      <div className="bg-slate-950 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl group transition-all">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,1)]" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Archive de Publication</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-white/5 p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-600/50 transition-all rounded-[2rem] min-h-[220px]">
              {baseData.pdfUrl ? (
                <div className="flex flex-col items-center gap-6 text-center animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Document Certifié Prêt</span>
                    <p className="text-[9px] text-white/30 truncate max-w-[250px] font-mono">{baseData.pdfUrl}</p>
                  </div>
                  <button 
                    onClick={() => setBaseData({ ...baseData, pdfUrl: "" })} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                  >
                    <X size={14} /> Supprimer
                  </button>
                </div>
              ) : (
                <div className="w-full text-center space-y-6 px-4">
                  {uploading ? (
                    <div className="space-y-6">
                      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Envoi: {uploadProgress}%</p>
                    </div>
                  ) : (
                    <>
                      <FileText size={48} className="text-white/5 group-hover:text-blue-600 transition-colors" strokeWidth={1} />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-200 text-slate-950 rounded-xl px-8 h-12 uppercase text-[10px] font-black tracking-widest shadow-xl transition-all active:scale-95"
                      >
                        Scanner & Uploader le PDF
                      </Button>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Format PDF EXCLUSIF • MAX 50MB</p>
                    </>
                  )}
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
            </div>

            {/* Basic Metadata */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Millésime</label>
                  <Input type="number" className="bg-white/5 border-white/5 text-white rounded-xl h-14 font-black transition-all focus:border-blue-600" value={baseData.year} onChange={(e) => setBaseData({ ...baseData, year: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Domaine</label>
                  <select className="w-full h-14 bg-white/5 border border-white/5 px-4 text-xs font-black uppercase tracking-widest rounded-xl text-white outline-none focus:border-blue-600 transition-all" value={baseData.domain} onChange={(e) => setBaseData({ ...baseData, domain: e.target.value })}>
                    <option value="RESEARCH" className="bg-slate-950 text-white">RECHERCHE</option>
                    <option value="CLINICAL" className="bg-slate-950 text-white">CLINIQUE</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Digital Object Identifier (DOI)</label>
                <div className="relative">
                   <Input placeholder="10.1000/xyz123" className="bg-white/5 border-white/5 text-white rounded-xl h-14 pl-12 font-bold transition-all focus:border-blue-600 placeholder:text-white/10" value={baseData.doi} onChange={(e) => setBaseData({ ...baseData, doi: e.target.value })} />
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 text-xs font-black">DOI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS DE CONTENU */}
      <Tabs defaultValue="fr" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-full grid grid-cols-3 h-14 transition-all">
          {LANGUAGES.map(l => (
            <TabsTrigger key={l.code} value={l.code} className="rounded-xl font-black uppercase text-[9px] tracking-[0.2em] data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all shadow-none">
              {l.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map(lang => (
          <TabsContent key={lang.code} value={lang.code} className="p-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] mt-6 space-y-10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 outline-none">
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de la Publication ({lang.code})</label>
               <Input 
                 placeholder="Titre scientifique complet..." 
                 className="text-2xl font-serif font-black bg-transparent border-0 border-b border-slate-100 dark:border-white/5 focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-slate-900 dark:text-white px-0" 
                 value={translations[lang.code].title} 
                 onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...translations[lang.code], title: e.target.value } })} 
               />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auteurs & Chercheurs</label>
               <Input 
                 placeholder="Ex: Pr. John Doe, Dr. Mary Smith" 
                 className="rounded-xl h-14 bg-slate-50 dark:bg-white/[0.02] border-slate-100 dark:border-white/5 font-bold text-sm text-slate-900 dark:text-white transition-all shadow-inner" 
                 value={translations[lang.code].authors} 
                 onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...translations[lang.code], authors: e.target.value } })} 
               />
            </div>

            <ModernMarkdownEditor 
              label="Résumé Analytique (Markdown Abstract)"
              value={translations[lang.code].description}
              onChange={(val) => setTranslations({ ...translations, [lang.code]: { ...translations[lang.code], description: val } })}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={uploading} 
          className="px-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-blue-600/30 transition-all active:scale-95"
        >
          Finaliser & Certifier la Publication
        </Button>
      </div>
    </div>
  );
}