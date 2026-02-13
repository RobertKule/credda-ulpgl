"use client"

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPublication, updatePublication } from "@/services/publication-actions";
import { useRouter } from "next/navigation";
import { Save, FileText, Upload, Loader2, CheckCircle2, X, Link as LinkIcon } from "lucide-react";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
];

export function PublicationForm({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [baseData, setBaseData] = useState({
    year: initialData?.year || new Date().getFullYear(),
    doi: initialData?.doi || "",
    pdfUrl: initialData?.pdfUrl || "",
    domain: initialData?.domain || "RESEARCH",
  });

  const [translations, setTranslations] = useState(
    LANGUAGES.reduce((acc, lang) => {
      const existing = initialData?.translations?.find((t: any) => t.language === lang.code);
      return {
        ...acc,
        [lang.code]: { title: existing?.title || "", authors: existing?.authors || "", description: existing?.description || "" }
      };
    }, {})
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setBaseData({ ...baseData, pdfUrl: data.url });
    } catch (err) {
      alert("Erreur lors de l'upload du document");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      ...baseData,
      translations: LANGUAGES.map(lang => ({
        language: lang.code,
        ...(translations as any)[lang.code]
      }))
    };

    const res = initialData 
      ? await updatePublication(initialData.id, payload)
      : await createPublication(payload);

    if (res.success) {
  router.push(`/${locale}/admin/publications?updated=true`);
}

    else setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* SECTION DOCUMENT PDF */}
      <div className="bg-slate-950 text-white p-8 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Fichier de Publication</h3>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="border-2 border-dashed border-white/10 p-6 flex flex-col items-center justify-center bg-white/5 group hover:border-blue-500 transition-all">
            {baseData.pdfUrl ? (
              <div className="flex items-center gap-4 text-emerald-400">
                <CheckCircle2 size={32} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest">Document prêt</span>
                  <span className="text-[10px] text-white/50 truncate max-w-[200px]">{baseData.pdfUrl}</span>
                </div>
                <button onClick={() => setBaseData({...baseData, pdfUrl: ""})} className="ml-4 p-2 hover:bg-red-500/20 text-red-400 rounded-full">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <FileText size={40} className="text-white/20 mb-4 group-hover:text-blue-500" />
                <Button 
                  variant="outline" 
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-transparent border-white/20 hover:bg-white hover:text-black rounded-none uppercase text-[10px] font-bold"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : "Uploader le PDF (Max 20MB)"}
                </Button>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Année</label>
                <Input type="number" className="bg-white/5 border-white/10 rounded-none" value={baseData.year} onChange={(e) => setBaseData({...baseData, year: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Domaine</label>
                <select className="w-full h-10 bg-white/5 border border-white/10 px-3 text-sm" value={baseData.domain} onChange={(e) => setBaseData({...baseData, domain: e.target.value})}>
                  <option value="RESEARCH">Recherche</option>
                  <option value="CLINICAL">Clinique</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">DOI (Digital Object Identifier)</label>
              <Input placeholder="10.1000/xyz123" className="bg-white/5 border-white/10 rounded-none" value={baseData.doi} onChange={(e) => setBaseData({...baseData, doi: e.target.value})} />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="fr">
        <TabsList className="bg-slate-100 w-full grid grid-cols-3 rounded-none h-14">
          {LANGUAGES.map(l => <TabsTrigger key={l.code} value={l.code} className="font-bold text-[10px] uppercase tracking-widest">{l.label}</TabsTrigger>)}
        </TabsList>
        {LANGUAGES.map(lang => (
          <TabsContent key={lang.code} value={lang.code} className="p-8 bg-white border border-t-0 border-slate-200 space-y-6">
            <Input placeholder="Titre scientifique complet" className="text-xl font-serif font-bold rounded-none h-14" value={(translations as any)[lang.code].title} onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], title: e.target.value}})} />
            <Input placeholder="Auteurs (Pr. Jean, Dr. Marie, etc.)" className="rounded-none" value={(translations as any)[lang.code].authors} onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], authors: e.target.value}})} />
            <Textarea placeholder="Résumé analytique (Abstract)..." className="h-44 rounded-none" value={(translations as any)[lang.code].description} onChange={(e) => setTranslations({...translations, [lang.code]: {...(translations as any)[lang.code], description: e.target.value}})} />
          </TabsContent>
        ))}
      </Tabs>

      <Button onClick={handleSubmit} disabled={loading || uploading} className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-none font-bold uppercase tracking-[0.2em] shadow-2xl">
        {loading ? <Loader2 className="animate-spin" /> : "Finaliser et Publier le document"}
      </Button>
    </div>
  );
}