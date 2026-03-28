"use client"

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMember, updateMember } from "@/services/member-actions";
import { useRouter } from "next/navigation";
import { Save, Upload, User, X, ChevronLeft, ChevronRight, CheckCircle2, Link as LinkIcon, Facebook, Twitter, Linkedin, Youtube, MessageCircle, Globe } from "lucide-react";
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
  
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [baseData, setBaseData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    image: initialData?.image || "",
    email: initialData?.email || "",
    order: initialData?.order || 0,
    facebook: initialData?.facebook || "",
    linkedin: initialData?.linkedin || "",
    twitter: initialData?.twitter || "",
    whatsapp: initialData?.whatsapp || "",
    youtube: initialData?.youtube || "",
    tiktok: initialData?.tiktok || "",
    website: initialData?.website || ""
  });

  const [translations, setTranslations] = useState(
    LANGUAGES.reduce((acc, lang) => {
      const existing = initialData?.translations?.find((t: any) => t.language === lang.code);
      return {
        ...acc,
        [lang.code]: {
          role: existing?.role || "",
          bio: existing?.bio || "",
          education: existing?.education || "",
          researchAxes: existing?.researchAxes || "",
          expertise: existing?.expertise || ""
        }
      };
    }, {})
  );

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     
      .replace(/[^\w-]+/g, '')  
      .replace(/--+/g, '-');    
  };

  const handleNameChange = (name: string) => {
    setBaseData(prev => ({
      ...prev,
      name,
      slug: prev.slug || slugify(name) 
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

  const nextStep = () => {
    if (step === 1 && (!baseData.name || !baseData.slug)) {
      toast.error("Le nom et le slug sont obligatoires.");
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!baseData.name || !baseData.slug) {
      toast.error("Le nom et le slug sont obligatoires.");
      setStep(1);
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

  const STEPS = [
    { id: 1, title: "Identité Globale" },
    { id: 2, title: "Profil Académique" },
    { id: 3, title: "Réseaux & Contact" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      
      {/* HEADER STEPS */}
      <div className="flex items-center justify-between bg-card border border-border p-6 rounded-[2rem] shadow-sm mb-8">
        <div className="flex items-center gap-4">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-xs transition-colors ${
                step === s.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                step > s.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className={`hidden md:block text-[10px] uppercase font-black tracking-widest ${
                step === s.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {s.title}
              </span>
              {idx < STEPS.length - 1 && <div className="w-8 h-px bg-border hidden md:block" />}
            </div>
          ))}
        </div>
        <Button variant="ghost" onClick={() => router.back()} className="text-[10px] uppercase tracking-widest font-black text-muted-foreground hover:text-foreground">
          <X size={14} className="mr-2" /> Quitter
        </Button>
      </div>

      <div className="min-h-[500px]">
        {/* ================= STEP 1: IDENTITÉ & BASE ================= */}
        {step === 1 && (
          <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-right-4">
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
                          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
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
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            {/* Colonne Infos de base */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm grid md:grid-cols-2 gap-8 transition-colors">
                  <div className="space-y-3 group md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Nom Complet (Identité Unique)</label>
                    <Input value={baseData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ex: Pr. Dr. Kennedy KIHANGI BINDU" className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xl" />
                  </div>
                  <div className="space-y-3 group md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Slug (URL Générée)</label>
                    <Input value={baseData.slug} onChange={(e) => setBaseData({ ...baseData, slug: e.target.value })} placeholder="kennedy-kihangi-bindu" className="rounded-xl h-14 bg-muted/20 border-border font-medium text-xs font-mono" />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Email Officiel (Affiché publiquement)</label>
                    <Input value={baseData.email} onChange={(e) => setBaseData({ ...baseData, email: e.target.value })} placeholder="email@credda-ulpgl.org" className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xs" />
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-focus-within:text-primary transition-colors">Priorité d'affichage (0 = premier)</label>
                    <Input type="number" value={baseData.order} onChange={(e) => setBaseData({ ...baseData, order: parseInt(e.target.value) })} className="rounded-xl h-14 bg-muted/20 border-border font-bold text-xs max-w-[150px]" />
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PROFIL ACADÉMIQUE ================= */}
        {step === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 space-y-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-4">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Traductions Académiques</h3>
              <p className="text-xs text-muted-foreground font-medium">Saisissez les informations de carrière et de recherche dans chaque langue. Les badges d'expertise doivent être séparés par des virgules.</p>
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
                <TabsContent key={lang.code} value={lang.code} className="bg-card border border-border rounded-[2.5rem] mt-6 p-8 shadow-sm transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid lg:grid-cols-2 gap-8">
                    
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex">Titre ou Rôle ({lang.code})</label>
                        <Input
                          placeholder="Ex: Professeur Ordinaire et Directeur"
                          className="rounded-xl h-14 bg-muted/20 border-border font-bold text-sm text-foreground"
                          value={(translations as any)[lang.code].role}
                          onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], role: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex">Diplômes / Formation Académique</label>
                        <Input
                          placeholder="Ex: Doctorat (PhD) en Droit, spécialité Droits de l'Homme"
                          className="rounded-xl h-14 bg-muted/20 border-border font-medium text-sm text-foreground"
                          value={(translations as any)[lang.code].education}
                          onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], education: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex">Domaines d'Expertise (Séparés par des virgules)</label>
                        <Input
                          placeholder="Ex: Droit de l'Environnement, Justice Pénale..."
                          className="rounded-xl h-14 bg-muted/20 border-border font-medium text-sm text-foreground"
                          value={(translations as any)[lang.code].expertise}
                          onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], expertise: e.target.value } })}
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex">Axes de Recherche</label>
                        <Textarea
                          placeholder="Décrivez les sujets de recherche principaux..."
                          className="min-h-[100px] rounded-2xl border-border bg-muted/30 font-medium p-6 focus:border-primary text-foreground"
                          value={(translations as any)[lang.code].researchAxes}
                          onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], researchAxes: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2 flex">Biographie & Parcours Professionnel</label>
                        <Textarea
                          placeholder="Décrivez l'historique de carrière, les réalisations et publications..."
                          className="min-h-[180px] rounded-2xl border-border bg-muted/30 font-medium p-6 focus:border-primary text-foreground"
                          value={(translations as any)[lang.code].bio}
                          onChange={(e) => setTranslations({ ...translations, [lang.code]: { ...(translations as any)[lang.code], bio: e.target.value } })}
                        />
                      </div>
                    </div>

                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* ================= STEP 3: CONTACT & RÉSEAUX SOCIAUX ================= */}
        {step === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="bg-card border border-border p-8 lg:p-12 rounded-[2.5rem] shadow-sm">
              <h3 className="text-xl font-serif font-black uppercase tracking-tighter mb-8">Présence Digitale & Réseaux</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-[#0a66c2] transition-colors"><Linkedin size={14} /> Profil LinkedIn</label>
                  <Input value={baseData.linkedin} onChange={(e) => setBaseData({ ...baseData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"><Twitter size={14} /> Compte X (Twitter)</label>
                  <Input value={baseData.twitter} onChange={(e) => setBaseData({ ...baseData, twitter: e.target.value })} placeholder="https://x.com/..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-[#25D366] transition-colors"><MessageCircle size={14} /> Numéro WhatsApp (Contact Direct)</label>
                  <Input value={baseData.whatsapp} onChange={(e) => setBaseData({ ...baseData, whatsapp: e.target.value })} placeholder="+243..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-[#0866ff] transition-colors"><Facebook size={14} /> Page Facebook</label>
                  <Input value={baseData.facebook} onChange={(e) => setBaseData({ ...baseData, facebook: e.target.value })} placeholder="https://facebook.com/..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-[#FF0000] transition-colors"><Youtube size={14} /> Chaîne YouTube</label>
                  <Input value={baseData.youtube} onChange={(e) => setBaseData({ ...baseData, youtube: e.target.value })} placeholder="https://youtube.com/@..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"><span className="font-extrabold text-[12px]">♪</span> Compte TikTok</label>
                  <Input value={baseData.tiktok} onChange={(e) => setBaseData({ ...baseData, tiktok: e.target.value })} placeholder="https://tiktok.com/@..." className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
                <div className="space-y-2 group md:col-span-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"><Globe size={14} /> Site Web Personnel / Institutionnel</label>
                  <Input value={baseData.website} onChange={(e) => setBaseData({ ...baseData, website: e.target.value })} placeholder="https://www.monsiteweb.org" className="rounded-xl h-14 bg-muted/20 border-border text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between pt-6 border-t border-border">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} className="rounded-xl px-8 h-14 uppercase text-[10px] font-black tracking-widest hover:border-primary transition-all flex items-center gap-2">
            <ChevronLeft size={16} /> Précédent
          </Button>
        ) : <div />}
        
        {step < 3 ? (
          <Button onClick={nextStep} className="bg-foreground text-background hover:bg-primary/90 rounded-xl px-12 h-14 uppercase text-[10px] font-black tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2">
            Suivant <ChevronRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={uploading} className="bg-primary hover:bg-blue-600 text-white rounded-xl px-12 h-14 uppercase text-[10px] font-black tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2">
            <Save size={16} /> {initialData ? "Sauvegarder les modifications" : "Intégrer le membre"}
          </Button>
        )}
      </div>

    </div>
  );
}