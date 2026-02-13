"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, User, Trash2, Reply, CheckCircle2, Loader2 } from "lucide-react";
import { deleteMessage, replyToContactMessage } from "@/services/contact-actions";

export default function MessageItem({ msg }: { msg: any }) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    setIsSubmitting(true);
    const res = await replyToContactMessage(msg.id, msg.email, replyText);
    if (res.success) {
      alert("Réponse envoyée avec succès !");
      setIsReplyOpen(false);
      setReplyText("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-sm group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className={`p-3 h-fit ${msg.isRead ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{msg.subject}</h3>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                <span className="flex items-center gap-1"><User size={10}/> {msg.name}</span>
                <span className="flex items-center gap-1"><Clock size={10}/> {new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {!msg.isRead && (
            <Badge className="bg-blue-600 rounded-none text-[8px] uppercase tracking-tighter">Nouveau</Badge>
          )}
        </div>

        {/* Aperçu du message */}
        <p className="text-sm text-slate-600 line-clamp-2 font-light mb-6 px-4 py-2 bg-slate-50 border-l-2 border-slate-200 italic">
          "{msg.message}"
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <span className="text-[10px] font-mono text-slate-400">{msg.email}</span>
          <div className="flex gap-2">
            
            {/* MODAL DE LECTURE & RÉPONSE */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-none text-[10px] font-black uppercase tracking-widest">
                  Lire & Répondre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white rounded-none border-none shadow-2xl p-0">
                <DialogHeader className="bg-[#050a15] text-white p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 flex items-center justify-center font-bold text-xl uppercase italic">
                      {msg.name.substring(0, 2)}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-serif">{msg.subject}</DialogTitle>
                      <p className="text-blue-400 text-xs uppercase tracking-widest font-bold mt-1">De: {msg.name} ({msg.email})</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Message Original</h4>
                  <ScrollArea className="h-48 bg-slate-50 p-6 border-l-4 border-blue-600 italic text-slate-700 leading-relaxed">
                    {msg.message}
                  </ScrollArea>

                  <div className="mt-8 space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Réponse Académique</h4>
                    <Textarea 
                      placeholder="Rédigez votre réponse ici..." 
                      className="min-h-[150px] rounded-none border-slate-200 focus:border-blue-600"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button 
                      onClick={handleReply} 
                      disabled={isSubmitting || !replyText}
                      className="w-full h-12 bg-blue-900 rounded-none uppercase font-bold text-xs tracking-widest"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Reply size={16} className="mr-2"/> Envoyer la réponse par email</>}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="ghost" 
              onClick={() => { if(confirm("Supprimer ?")) deleteMessage(msg.id); }}
              className="h-8 w-8 text-slate-300 hover:text-red-600"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}