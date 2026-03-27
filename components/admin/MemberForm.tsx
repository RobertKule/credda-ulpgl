"use client"

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMember, updateMember } from "@/services/member-actions";
import { useRouter } from "next/navigation";
import { Save, Upload, User, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { showLoading, hideLoading } from "@/components/admin/LoadingModal";
import { toast } from "react-hot-toast";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" }
];

export function MemberForm({ initialData, locale }: { initialData?: any, locale: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [baseData, setBaseData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
    email: initialData?.email || "",
    order: initialData?.order || 0,
  });

  const [translations, setTranslations] = useState(
    LANGUAGES.reduce((acc, lang) => {
      const existing = initialData?.translations?.find((t: any) => t.language === lang.code);
      return {
        ...acc,
        [lang.code]: {
          role: existing?.role || "",
          bio: existing?.bio || ""
        }
      };
    }, {})
  );

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-');    // Replace multiple - with single -
  };

  const handleNameChange = (name: string) => {
    setBaseData(prev => ({
      ...prev,
      name,
      slug: prev.slug || slugify(name) // Auto-generate slug if empty
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "image");

    try {
      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data.url) {
        setBaseData({ ...baseData, image: res.data.url });
        toast.success("Photo téléchargée !");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error ?? "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    if (!baseData.name || !baseData.slug) {
      toast.error("Le nom et le slug sont obligatoires.");
      return;
    }

    showLoading(initialData ? "Mise à jour du profil..." : "Création du nouveau membre...");
    const payload = {
      ...baseData,
      translations: LANGUAGES.map(lang => ({
        language: lang.code,
        ...(translations as any)[lang.code]
      }))
    };

    try {
      const res = initialData
        ? await updateMember(initialData.id, payload)
        : await createMember(payload);

      if (res.success) {
        toast.success("Membre enregistré avec succès");
        router.push(`/${locale}/admin/members`);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Colonne Image */}
        <div className="lg:col-span-1 space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Portrait Officiel</label>
          <div className="relative aspect-[3/4] bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden group rounded-[2rem] shadow-inner transition-colors">
            {baseData.image ? (
              <>
                <Image src={baseData.image} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <button
                  type="button"
                  onClick={() => setBaseData({ ...baseData, image: "" })}
                  className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl active:scale-95"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                {uploading ? (
                  <div className="space-y-4 w-full px-6">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-md animate-spin mx-auto" />
                    <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-md overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Calcul: {uploadProgress}%</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto transition-colors group-hover:bg-primary/10">
                      <User size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-[9px] font-black uppercase tracking-widest border-border bg-card shadow-sm rounded-xl px-6 h-12 hover:border-primary transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} className="mr-2" /> Sélectionner
                    </Button>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">JPG, PNG ou WEBP • Portrait</p>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Colonne Infos de base */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm grid md:grid-cols-2 gap-8 transition-colors">
              <div className="space-y-3 group md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Nom Complet (Statique)</label>
                <Input value={baseData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ex: Pr. Dr. John Doe" className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xl" />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Slug (URL)</label>
                <Input value={baseData.slug} onChange={(e) => setBaseData({ ...baseData, slug: e.target.value })} placeholder="john-doe" className="rounded-xl h-14 bg-muted/20 border-border font-medium text-xs font-mono" />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Email de Liaison</label>
                <Input value={baseData.email} onChange={(e) => setBaseData({ ...baseData, email: e.target.value })} placeholder="email@credda-ulpgl.org" className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xs" />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Priorité d'affichage</label>
                <Input type="number" value={baseData.order} onChange={(e) => setBaseData({ ...baseData, order: parseInt(e.target.value) })} className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xs max-w-[120px]" />
              </div>
           </div>

           <Tabs defaultValue="fr" className="w-full">
            <TabsList className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-full grid grid-cols-3 h-14 transition-colors">
              {LANGUAGES.map(lang => (
                <TabsTrigger key={lang.code} value={lang.code} className="rounded-xl font-black uppercase text-[9px] tracking-[0.2em] data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all">
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LANGUAGES.map(lang => (
              <TabsContent key={lang.code} value={lang.code} className="p-8 bg-card border border-border rounded-[2.5rem] mt-6 space-y-8 shadow-sm transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fonction / Titre ({lang.code})</label>
                  <Input
                    placeholder="Ex: Coordonnateur de Recherche"
                    className="rounded-xl h-14 bg-muted/20 border-border font-bold text-sm text-foreground transition-all"
                    value={(translations as any)[lang.code].role}
                    onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], role: e.target.value } })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Parcours & Expertise</label>
                  <Textarea
                    placeholder="Décrivez les compétences, l'expertise et le parcours académique du membre..."
                    className="min-h-[160px] rounded-2xl border-border bg-muted/30 italic font-medium p-6 focus:border-primary transition-all text-foreground"
                    value={(translations as any)[lang.code].bio}
                    onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], bio: e.target.value } })}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-10 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-xl px-8 h-14 uppercase text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-all"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-12 h-14 uppercase text-[10px] font-black tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-3"
        >
          <Save size={16} /> 
          {initialData ? "Sauvegarder les modifications" : "Intégrer le membre"}
        </Button>
      </div>
    </div>
  );
}