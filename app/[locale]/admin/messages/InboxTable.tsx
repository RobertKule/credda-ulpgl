// app/[locale]/admin/messages/InboxTable.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  Inbox, Search, Filter, Mail, MailOpen, 
  Archive, Trash2, Reply, CheckCircle2,
  Clock, X, MoreVertical, ChevronDown,
  ChevronUp, User, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        toast.success("Message marked as read");
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  const handleArchive = async (id: string) => {
    startTransition(async () => {
      const result = await archiveMessage(id);
      if (result.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "ARCHIVED" } : m));
        toast.success("Message archived");
      } else {
        toast.error("Failed to archive message");
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
        toast.success("Reply sent successfully");
        setReplyingTo(null);
        setReplyText("");
      } else {
        toast.error(result.error || "Failed to send reply");
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
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search in inbox..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Inbox List */}
      <div className="space-y-3">
        {filteredMessages.map((m) => (
          <div 
            key={m.id} 
            className={`group bg-white border transition-all duration-300 overflow-hidden ${
              m.status === 'UNREAD' ? 'border-blue-200 shadow-sm ring-1 ring-blue-50' : 'border-slate-200'
            } ${expandedId === m.id ? 'shadow-lg border-blue-500' : 'hover:border-slate-300'}`}
          >
            <div className={`flex items-start p-4 md:p-6 gap-4 cursor-pointer`} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
              <div className={`w-12 h-12 rounded-full hidden md:flex items-center justify-center shrink-0 ${
                m.status === 'UNREAD' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {m.status === 'UNREAD' ? <Mail size={20} /> : <MailOpen size={20} />}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold truncate ${m.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-600'}`}>
                      {m.name}
                    </h3>
                    <Badge className={`rounded-none text-[8px] font-black tracking-widest uppercase ${
                      m.status === 'UNREAD' ? 'bg-blue-600' : m.status === 'READ' ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}>
                      {m.status}
                    </Badge>
                    {m.repliedAt && (
                      <Badge className="bg-emerald-600 rounded-none text-[8px] font-black tracking-widest uppercase">
                        Replied
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} /> {formatDate(m.createdAt)}
                  </span>
                </div>
                <p className={`text-sm font-serif font-bold ${m.status === 'UNREAD' ? 'text-slate-900' : 'text-slate-700'} truncate`}>
                  {m.subject}
                </p>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {m.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                 <Button 
                   size="icon" 
                   variant="ghost" 
                   className="h-8 w-8 text-slate-300 hover:text-blue-600"
                   onClick={(e) => {
                     e.stopPropagation();
                     setExpandedId(expandedId === m.id ? null : m.id);
                   }}
                 >
                   {expandedId === m.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                 </Button>
                 
                 <div className="md:opacity-0 group-hover:opacity-100 transition-opacity flex gap-1" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {m.status !== 'READ' && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(m.id)}>
                            <MailOpen size={14} className="mr-2" /> Mark as read
                          </DropdownMenuItem>
                        )}
                        {m.status !== 'ARCHIVED' && (
                          <DropdownMenuItem onClick={() => handleArchive(m.id)}>
                            <Archive size={14} className="mr-2" /> Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setReplyingTo(m)}>
                          <Reply size={14} className="mr-2" /> Reply
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === m.id && (
              <div className="px-4 md:px-24 pb-8 space-y-8 animate-in slide-in-from-top-4 duration-500">
                <div className="bg-slate-50 p-6 space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-slate-100 pb-4">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">From</span>
                        <p className="text-sm font-bold text-slate-900">{m.name} &lt;{m.email}&gt;</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Received</span>
                        <p className="text-sm font-bold text-slate-900">{new Date(m.createdAt).toLocaleString('fr-FR')}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Message</span>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                      {m.message}
                    </p>
                  </div>

                  {m.replyContent && (
                    <div className="bg-emerald-50 p-4 border-l-4 border-emerald-500 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Our Reply</span>
                         <span className="text-[9px] font-bold text-emerald-400">{formatDate(m.repliedAt!)}</span>
                      </div>
                      <p className="text-sm text-emerald-900 italic">
                        {m.replyContent}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                   <Button 
                     variant="outline" 
                     className="text-xs font-bold uppercase tracking-widest rounded-none h-12 px-6"
                     onClick={() => handleArchive(m.id)}
                     disabled={isPending || m.status === 'ARCHIVED'}
                   >
                     <Archive size={16} className="mr-2" /> Archive
                   </Button>
                   <Button 
                     className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-none h-12 px-8"
                     onClick={() => setReplyingTo(m)}
                     disabled={isPending}
                   >
                     <Reply size={16} className="mr-2" /> Reply Now
                   </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="py-20 text-center bg-slate-50 border border-slate-200 border-dashed">
            <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-serif italic">No messages found in your inbox.</p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-none border-none shadow-2xl p-0">
          <div className="bg-slate-900 p-8 text-white space-y-1">
            <h2 className="text-2xl font-serif font-bold italic tracking-tight">Responding to</h2>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">{replyingTo?.name} • {replyingTo?.email}</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="bg-slate-50 p-4 border border-slate-100">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Subject</span>
               <p className="text-sm font-bold text-slate-900 italic">RE: {replyingTo?.subject}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Content</label>
              <Textarea 
                placeholder="Write your professional response here..."
                className="min-h-[200px] rounded-none border-slate-200 focus:ring-blue-500/20 font-serif text-base"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <p className="text-[10px] text-slate-400 italic">This message will be sent instantly via email through CREDDA verified servers.</p>
          </div>

          <DialogFooter className="p-8 pt-0 flex justify-between sm:justify-between items-center">
            <Button variant="ghost" onClick={() => setReplyingTo(null)} className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Discard</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-none font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-600/20"
              onClick={handleSendReply}
              disabled={isPending || !replyText.trim()}
            >
              {isPending ? "Sending..." : "Dispatch Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
