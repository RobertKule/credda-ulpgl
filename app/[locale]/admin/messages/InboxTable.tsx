// app/[locale]/admin/messages/InboxTable.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  Inbox, Search, Filter, Mail, MailOpen, 
  Archive, Trash2, Reply, CheckCircle2,
  Clock, X, MoreVertical, ChevronDown,
  ChevronUp, User, Calendar, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  markMessageAsRead, 
  archiveMessage, 
  replyToContactMessage 
} from "@/services/contact-actions";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  createdAt: Date;
  repliedAt: Date | null;
  replyContent: string | null;
}

export default function InboxTable({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleMarkAsRead = async (id: string) => {
    startTransition(async () => {
      const result = await markMessageAsRead(id);
      if (result.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "READ" } : m));
        toast.success("Marqué comme lu");
      } else {
        toast.error("Échec de la mise à jour");
      }
    });
  };

  const handleArchive = async (id: string) => {
    startTransition(async () => {
      const result = await archiveMessage(id);
      if (result.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "ARCHIVED" } : m));
        toast.success("Message archivé");
      } else {
        toast.error("Échec de l'archivage");
      }
    });
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyText.trim()) return;
    
    startTransition(async () => {
      const result = await replyToContactMessage(replyingTo.id, replyText);
      if (result.success) {
        setMessages(prev => prev.map(m => m.id === replyingTo.id ? { 
          ...m, 
          status: "READ", 
          repliedAt: new Date(),
          replyContent: replyText
        } : m));
        toast.success("Réponse envoyée avec succès");
        setReplyingTo(null);
        setReplyText("");
      } else {
        toast.error(result.error || "Échec de l'envoi");
      }
    });
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: fr 
    });
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Search & Filters PREMIUM */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white dark:bg-white/5 p-6 border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-sm">
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Rechercher dans la boîte..." 
            className="w-full pl-14 pr-6 h-14 bg-slate-50 dark:bg-white/5 border-transparent dark:border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-bold tracking-tight text-slate-900 dark:text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="h-14 bg-slate-50 dark:bg-white/5 px-6 rounded-2xl border border-transparent dark:border-white/5 flex items-center gap-3">
             <Filter size={16} className="text-slate-400" strokeWidth={2.5} />
             <select 
               className="bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer text-slate-900 dark:text-white/80"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="all" className="dark:bg-slate-900">Tous les Messages</option>
               <option value="UNREAD" className="dark:bg-slate-900">Non Lus</option>
               <option value="READ" className="dark:bg-slate-900">Lus</option>
               <option value="ARCHIVED" className="dark:bg-slate-900">Archivés</option>
             </select>
          </div>
        </div>
      </div>

      {/* Inbox List LUXE */}
      <div className="space-y-4">
        {filteredMessages.map((m) => (
          <div 
            key={m.id} 
            className={`group bg-white dark:bg-white/5 border transition-all duration-500 overflow-hidden rounded-[2.5rem] ${
              m.status === 'UNREAD' ? 'border-blue-200 dark:border-blue-600/30 shadow-xl shadow-blue-600/5' : 'border-slate-100 dark:border-white/5'
            } ${expandedId === m.id ? 'shadow-2xl border-blue-600 ring-4 ring-blue-600/5' : 'hover:border-slate-300 dark:hover:border-white/20'}`}
          >
            <div className={`flex items-center p-6 md:p-10 gap-8 cursor-pointer relative`} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
              
              <div className={`w-14 h-14 rounded-3xl hidden md:flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 shadow-lg ${
                m.status === 'UNREAD' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-50 dark:bg-white/5 text-slate-400'
              }`}>
                {m.status === 'UNREAD' ? <Mail size={22} strokeWidth={2.5} /> : <MailOpen size={22} strokeWidth={2.5} />}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className={`text-lg font-serif font-black tracking-tight ${m.status === 'UNREAD' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/60'}`}>
                      {m.name}
                    </h3>
                    <div className="flex gap-2">
                       <Badge className={`rounded-xl px-3 py-1 text-[8px] font-black tracking-widest uppercase border-0 ${
                         m.status === 'UNREAD' ? 'bg-blue-600 text-white' : m.status === 'READ' ? 'bg-emerald-600/20 text-emerald-600' : 'bg-slate-400/20 text-slate-400'
                       }`}>
                         {m.status}
                       </Badge>
                       {m.repliedAt && (
                         <Badge className="bg-emerald-600 text-white rounded-xl px-3 py-1 text-[8px] font-black tracking-widest uppercase border-0">
                           Répondu
                         </Badge>
                       )}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={14} className="text-blue-600" /> {formatDate(m.createdAt)}
                  </span>
                </div>
                <p className={`text-sm font-bold tracking-tight ${m.status === 'UNREAD' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40'} truncate uppercase tracking-widest`}>
                   {m.subject}
                </p>
                <p className="text-sm font-medium text-slate-400 dark:text-white/30 line-clamp-1 italic font-serif">
                   "{m.message}"
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 pr-4">
                  <button 
                    className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-blue-600 rounded-2xl transition-all active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === m.id ? null : m.id);
                    }}
                  >
                    {expandedId === m.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  <div className="hidden lg:flex" onClick={e => e.stopPropagation()}>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl">
                           <MoreVertical size={20} />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-200 dark:border-white/5 shadow-2xl">
                         {m.status !== 'READ' && (
                           <DropdownMenuItem onClick={() => handleMarkAsRead(m.id)} className="rounded-xl py-3 font-bold text-xs">
                             <MailOpen size={16} className="mr-3 text-blue-600" /> Marquer comme lu
                           </DropdownMenuItem>
                         )}
                         {m.status !== 'ARCHIVED' && (
                           <DropdownMenuItem onClick={() => handleArchive(m.id)} className="rounded-xl py-3 font-bold text-xs">
                             <Archive size={16} className="mr-3 text-amber-600" /> Archiver
                           </DropdownMenuItem>
                         )}
                         <DropdownMenuItem onClick={() => setReplyingTo(m)} className="rounded-xl py-3 font-bold text-xs">
                           <Reply size={16} className="mr-3 text-emerald-600" /> Répondre
                         </DropdownMenuItem>
                         <DropdownMenuSeparator className="my-2 opacity-50" />
                         <DropdownMenuItem className="rounded-xl py-3 font-bold text-xs text-red-600">
                           <Trash2 size={16} className="mr-3" /> Supprimer définitivement
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
              </div>
            </div>

            {/* Expanded Content MODERNE */}
            {expandedId === m.id && (
              <div className="px-6 md:px-24 pb-12 space-y-10 animate-in slide-in-from-top-4 fade-in duration-700">
                <div className="bg-slate-50 dark:bg-white/[0.03] p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-10">
                  <div className="flex flex-col md:flex-row gap-8 justify-between border-b border-slate-100 dark:border-white/5 pb-8">
                     <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-widest ml-1">Expéditeur</span>
                        <p className="text-xl font-serif font-black text-slate-900 dark:text-white leading-tight">{m.name}</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400/60 uppercase tracking-widest">{m.email}</p>
                     </div>
                     <div className="space-y-2 lg:text-right">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-widest mr-1">Date et Heure</span>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{new Date(m.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/20 tracking-widest ml-1">Corps de la Requête</span>
                    <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif bg-white dark:bg-slate-900/40 p-10 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner italic">
                      {m.message}
                    </div>
                  </div>

                  {m.replyContent && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-600/10 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Réponse Transmise</span>
                         </div>
                         <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">{formatDate(m.repliedAt!)}</span>
                      </div>
                      <p className="text-base text-emerald-900 dark:text-emerald-400 font-serif leading-relaxed italic">
                        {m.replyContent}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-5">
                   <Button 
                     variant="outline" 
                     className="text-[10px] font-black uppercase tracking-widest rounded-2xl h-14 px-10 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 transition-all"
                     onClick={() => handleArchive(m.id)}
                     disabled={isPending || m.status === 'ARCHIVED'}
                   >
                     <Archive size={18} className="mr-3" /> Archiver
                   </Button>
                   <Button 
                     className="bg-slate-900 dark:bg-blue-600 hover:scale-105 active:scale-95 text-white h-14 px-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all"
                     onClick={() => setReplyingTo(m)}
                     disabled={isPending}
                   >
                     <Reply size={18} className="mr-3" /> Répondre officiellement
                   </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="py-32 text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 border-dashed rounded-[3rem]">
            <Inbox size={64} className="mx-auto text-slate-200 dark:text-white/5 mb-6" />
            <div className="space-y-2">
               <h3 className="text-xl font-serif font-black text-slate-400 dark:text-white/20 uppercase tracking-tighter italic">Boîte aux lettres vide</h3>
               <p className="text-[10px] text-slate-300 dark:text-white/10 uppercase font-black tracking-widest">Aucun message ne correspond à vos filtres</p>
            </div>
          </div>
        )}
      </div>

      {/* Reply Dialog LUXE */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
        <DialogContent className="sm:max-w-[700px] rounded-[3rem] border-none shadow-3xl p-0 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="bg-slate-900 dark:bg-blue-600 p-12 text-white space-y-2 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-md" />
            <h2 className="text-3xl font-serif font-black italic tracking-tighter leading-none relative z-10">Rédaction de Réponse</h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] relative z-10">{replyingTo?.name} • {replyingTo?.email}</p>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
               <span className="text-[9px] font-black uppercase text-slate-400 dark:text-white/20 tracking-[0.3em] mb-3 block">Sujet de Référence</span>
               <p className="text-base font-serif font-bold text-slate-900 dark:text-white italic leading-tight">RE: {replyingTo?.subject}</p>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-slate-500 dark:text-white/40 tracking-widest ml-1">Contenu de la Réponse</Label>
              <Textarea 
                placeholder="Rédigez votre réponse officielle ici..."
                className="min-h-[250px] bg-slate-50 dark:bg-white/5 rounded-[2.5rem] border-slate-200 dark:border-white/10 p-8 focus:ring-blue-600/10 focus:border-blue-600 font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 text-slate-400 dark:text-white/20 ml-2">
               <div className="w-1.5 h-1.5 rounded-md bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <p className="text-[9px] font-black uppercase tracking-widest">Envoi via les serveurs sécurisés CREDDA-CDE</p>
            </div>
          </div>

          <div className="p-10 pt-0 flex flex-col sm:flex-row justify-between items-center gap-6">
            <Button variant="ghost" onClick={() => setReplyingTo(null)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest gap-2">
              <X size={16} /> Annuler
            </Button>
            <Button 
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 hover:scale-105 active:scale-95 text-white px-12 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl transition-all"
              onClick={handleSendReply}
              disabled={isPending || !replyText.trim()}
            >
              <span className="flex items-center gap-4">
                 {isPending ? "Expédition en cours..." : "Transmettre la réponse"}
                 <ArrowRight size={16} />
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
