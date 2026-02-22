// components/admin/MessageItem.tsx - VERSION CORRIGÉE
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Mail, MailOpen, Archive, Trash2, ChevronDown, ChevronUp,
  User, Calendar, MessageSquare, CheckCircle, MoreVertical, Reply
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MessageItemProps {
  msg: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function MessageItem({ msg, isSelected, onSelect }: MessageItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD": return "bg-blue-500";
      case "READ": return "bg-emerald-500";
      case "ARCHIVED": return "bg-slate-400";
      default: return "bg-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UNREAD": return <Mail size={14} className="text-blue-600" />;
      case "READ": return <MailOpen size={14} className="text-emerald-600" />;
      case "ARCHIVED": return <Archive size={14} className="text-slate-500" />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: fr 
    });
  };

  const handleMarkAsRead = async () => {
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleArchive = async () => {
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ARCHIVED" })
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: "DELETE"
        });
        if (res.ok) window.location.reload();
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage })
      });
      
      if (res.ok) {
        setShowReplyDialog(false);
        setReplyMessage("");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`group relative bg-white border rounded-xl transition-all duration-200 hover:shadow-md ${
        msg.status === "UNREAD" ? "border-blue-200 bg-blue-50/30" : "border-slate-200"
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
        
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${getStatusColor(msg.status)}`} />

        <div className="p-5 pl-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect?.(msg.id)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.status === "UNREAD" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                <span className="text-sm font-bold text-slate-700">
                  {msg.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-serif font-bold truncate ${
                    msg.status === "UNREAD" ? "text-slate-900" : "text-slate-700"
                  }`}>
                    {msg.name}
                  </h3>
                  <Badge variant={msg.status === "UNREAD" ? "default" : "secondary"} className="text-[10px]">
                    {getStatusIcon(msg.status)}
                    <span className="ml-1">
                      {msg.status === "UNREAD" ? "Non lu" : msg.status === "READ" ? "Lu" : "Archivé"}
                    </span>
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {msg.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleMarkAsRead}>
                    <MailOpen size={14} className="mr-2" /> Marquer comme lu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive size={14} className="mr-2" /> Archiver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReplyDialog(true)}>
                    <Reply size={14} className="mr-2" /> Répondre
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 size={14} className="mr-2" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="ml-14 mb-2">
            <h4 className="text-sm font-semibold text-slate-800">{msg.subject}</h4>
          </div>

          <div className="ml-14">
            <p className={`text-sm text-slate-600 ${!expanded ? 'line-clamp-2' : ''}`}>
              {msg.message}
            </p>
          </div>

          {expanded && (
            <div className="mt-4 ml-14 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} /> ID: {msg.id.slice(0, 8)}...
                </span>
                {msg.repliedAt && (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle size={12} /> Répondu le {new Date(msg.repliedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Répondre à {msg.name}</DialogTitle>
            <DialogDescription>Votre réponse sera envoyée à {msg.email}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-1">{msg.subject}</p>
              <p className="text-slate-600">{msg.message}</p>
            </div>
            
            <Textarea
              placeholder="Votre réponse..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>Annuler</Button>
            <Button onClick={handleSendReply} disabled={!replyMessage.trim() || isLoading}>
              {isLoading ? "Envoi..." : "Envoyer la réponse"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}