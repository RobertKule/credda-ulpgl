"use client";

import React, { useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { X, Send, FileText, Scale, Image as ImageIcon, UserPlus, AlertCircle, Upload } from "lucide-react";

interface DashboardModalsProps {
  activeModal: "publication" | "clinique" | "media" | "invitation" | null;
  onClose: () => void;
  locale: string;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({ activeModal, onClose, locale }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Quick Translations fallback helper
  const translate = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      fr: {
        newPub: "Nouvelle Publication",
        newCase: "Nouveau Cas Clinique",
        newMedia: "Ajouter un Média",
        newInvite: "Inviter un Chercheur",
        init: "Initialisation Rapide",
        cancel: "Annuler",
        confirm: "Confirmer",
        dragDrop: "Glissez-déposez votre fichier ici, ou cliquez pour parcourir",
        audit: "Données chiffrées & Traçabilité Audit Log active",
        titlePub: "Titre de la Recherche",
        titlePubPlaceholder: "Ex: Impact de l'extraction minière sur l'écosystème du Kivu",
        domain: "Domaine",
        priority: "Priorité",
        standard: "Standard",
        urgent: "Urgent",
        litigeName: "Nature du Litige",
        litigePlaceholder: "Ex: Conflit foncier communautaire à Kalehe",
        description: "Description Sommaire",
        descPlaceholder: "Décrivez brièvement les faits marquants...",
        mediaTitle: "Titre du Média",
        mediaTitlePlaceholder: "Ex: Session de sensibilisation CDE à Himbi",
        category: "Catégorie de Média",
        inviteName: "Nom Complet du Chercheur",
        inviteNamePlaceholder: "Pr. / Dr. / Nom complet",
        email: "Adresse Email Institutionnelle",
        emailPlaceholder: "nom@ulpgl.ac.cd",
        role: "Rôle de l'accès",
        descPub: "Description / Résumé (Abstract)",
        descPubPlaceholder: "Rédigez un court résumé de la publication ou des travaux de recherche...",
      },
      en: {
        newPub: "New Publication",
        newCase: "Create Clinical Case",
        newMedia: "Add Media",
        newInvite: "Invite Researcher",
        init: "Quick Setup",
        cancel: "Cancel",
        confirm: "Confirm",
        dragDrop: "Drag and drop your file here, or click to browse",
        audit: "Encrypted data & Audit Log tracking active",
        titlePub: "Research Title",
        titlePubPlaceholder: "E.g., Impact of mining extraction on the Kivu ecosystem",
        domain: "Domain",
        priority: "Priority",
        standard: "Standard",
        urgent: "Urgent",
        litigeName: "Nature of Dispute",
        litigePlaceholder: "E.g., Community land conflict in Kalehe",
        description: "Summary Description",
        descPlaceholder: "Briefly describe the key facts...",
        mediaTitle: "Media Title",
        mediaTitlePlaceholder: "E.g., CDE awareness session in Himbi",
        category: "Media Category",
        inviteName: "Researcher Full Name",
        inviteNamePlaceholder: "Pr. / Dr. / Full Name",
        email: "Institutional Email Address",
        emailPlaceholder: "name@ulpgl.ac.cd",
        role: "Access Role",
        descPub: "Description / Abstract",
        descPubPlaceholder: "Write a short summary of the publication or research work...",
      },
      sw: {
        newPub: "Chapisho Jipya",
        newCase: "Unda Kesi ya Kliniki",
        newMedia: "Ongeza Picha/Video",
        newInvite: "Alika Mtafiti",
        init: "Uanzishaji wa Haraka",
        cancel: "Ghairi",
        confirm: "Thibitisha",
        dragDrop: "Buruta na udondoshe faili yako hapa, au bonyeza ili kuvinjari",
        audit: "Data imesimbwa na Ufuatiliaji wa Audit Log unafanya kazi",
        titlePub: "Kichwa cha Utafiti",
        titlePubPlaceholder: "Mfano: Athari za uchimbaji madini kwenye mfumo wa ikolojia wa Kivu",
        domain: "Nyanja",
        priority: "Uharaka",
        standard: "Kawaida",
        urgent: "Haraka",
        litigeName: "Aina ya Mgogoro",
        litigePlaceholder: "Mfano: Mgogoro wa ardhi wa jamii huko Kalehe",
        description: "Maelezo Mafupi",
        descPlaceholder: "Eleza kwa ufupi ukweli muhimu...",
        mediaTitle: "Kichwa cha Vyombo vya Habari",
        mediaTitlePlaceholder: "Mfano: Kikao cha uhamasishaji cha CDE huko Himbi",
        category: "Kundi la Vyombo vya Habari",
        inviteName: "Jina Kamili la Mtafiti",
        inviteNamePlaceholder: "Pr. / Dr. / Jina Kamili",
        email: "Barua pepe ya Taasisi",
        emailPlaceholder: "jina@ulpgl.ac.cd",
        role: "Wajibu wa Ufikiaji",
        descPub: "Maelezo / Muhtasari",
        descPubPlaceholder: "Andika muhtasari mfupi wa chapisho au kazi ya utafiti...",
      }
    };
    const lang = dict[locale] ? locale : "fr";
    return dict[lang][key] || key;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] cursor-zoom-out"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit z-[101] px-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl text-white ${
                    activeModal === "publication" ? "bg-green-700" :
                    activeModal === "clinique" ? "bg-emerald-600" :
                    activeModal === "media" ? "bg-blue-600" : "bg-purple-600"
                  }`}>
                    {activeModal === "publication" && <FileText className="w-5 h-5" />}
                    {activeModal === "clinique" && <Scale className="w-5 h-5" />}
                    {activeModal === "media" && <ImageIcon className="w-5 h-5" />}
                    {activeModal === "invitation" && <UserPlus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                      {activeModal === "publication" && translate("newPub")}
                      {activeModal === "clinique" && translate("newCase")}
                      {activeModal === "media" && translate("newMedia")}
                      {activeModal === "invitation" && translate("newInvite")}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest leading-none mt-1">
                      {translate("init")}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-none">
                {activeModal === "publication" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("titlePub")}
                      </label>
                      <input 
                        type="text" 
                        placeholder={translate("titlePubPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("descPub")}
                      </label>
                      <textarea 
                        rows={3}
                        placeholder={translate("descPubPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium resize-none dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                          {translate("domain")}
                        </label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all text-sm font-medium dark:text-white">
                          <option>Recherche</option>
                          <option>Clinique</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                          {translate("priority")}
                        </label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all text-sm font-medium dark:text-white">
                          <option>{translate("standard")}</option>
                          <option>{translate("urgent")}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === "clinique" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("litigeName")}
                      </label>
                      <input 
                        type="text" 
                        placeholder={translate("litigePlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("description")}
                      </label>
                      <textarea 
                        rows={3}
                        placeholder={translate("descPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium resize-none dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {activeModal === "media" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("mediaTitle")}
                      </label>
                      <input 
                        type="text" 
                        placeholder={translate("mediaTitlePlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("category")}
                      </label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium dark:text-white">
                        <option>Recherche</option>
                        <option>Clinique</option>
                        <option>Événement</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Fichier Média</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          dragActive 
                            ? "border-blue-500 bg-blue-50/10" 
                            : "border-slate-200 dark:border-zinc-800 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30"
                        }`}
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <input 
                          id="file-upload"
                          type="file" 
                          className="hidden" 
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold max-w-xs mx-auto">
                          {selectedFile ? selectedFile.name : translate("dragDrop")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === "invitation" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("inviteName")}
                      </label>
                      <input 
                        type="text" 
                        placeholder={translate("inviteNamePlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("email")}
                      </label>
                      <input 
                        type="email" 
                        placeholder={translate("emailPlaceholder")}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-600 text-sm font-medium dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">
                        {translate("role")}
                      </label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800 border-transparent focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm font-medium dark:text-white">
                        <option>RESEARCHER (Chercheur)</option>
                        <option>EDITOR (Éditeur)</option>
                        <option>ADMIN (Administrateur)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 px-8 py-4 rounded-2xl border border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all uppercase tracking-widest"
                  >
                    {translate("cancel")}
                  </button>
                  <button 
                    onClick={onClose}
                    className={`flex-[2] px-8 py-4 rounded-2xl transition-all font-black text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl ${
                      activeModal === "publication" ? "bg-green-800 hover:bg-green-900 shadow-green-700/20" :
                      activeModal === "clinique" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" :
                      activeModal === "media" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" :
                      "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                    }`}
                  >
                    {translate("confirm")} <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Security Badge Footer */}
              <div className="px-8 py-4 bg-slate-50/50 dark:bg-zinc-800/30 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0 border-t border-slate-100 dark:border-zinc-800">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                {translate("audit")}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
