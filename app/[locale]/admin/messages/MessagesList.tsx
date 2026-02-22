// app/admin/messages/MessagesList.tsx
"use client";

import { useState, useMemo } from "react";
import { MessageItem } from "./MessageItem";
import { 
  Inbox, 
  Filter, 
  Search, 
  Mail, 
  MailOpen,
  Archive,
  Star,
  Clock,
  ChevronDown,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MessagesListProps {
  messages: any[];
}

type FilterType = "all" | "unread" | "read" | "archived";
type SortType = "newest" | "oldest" | "unread";

export function MessagesList({ messages }: MessagesListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [search, setSearch] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  // Filtrer et trier les messages
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];

    // Filtre par statut
    if (filter === "unread") {
      filtered = filtered.filter(m => m.status === "UNREAD");
    } else if (filter === "read") {
      filtered = filtered.filter(m => m.status === "READ");
    } else if (filter === "archived") {
      filtered = filtered.filter(m => m.status === "ARCHIVED");
    }

    // Recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchLower) ||
        m.email.toLowerCase().includes(searchLower) ||
        m.subject.toLowerCase().includes(searchLower) ||
        m.message.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sort === "unread") {
        if (a.status === "UNREAD" && b.status !== "UNREAD") return -1;
        if (a.status !== "UNREAD" && b.status === "UNREAD") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return filtered;
  }, [messages, filter, sort, search]);

  // Statistiques par filtre
  const counts = {
    all: messages.length,
    unread: messages.filter(m => m.status === "UNREAD").length,
    read: messages.filter(m => m.status === "READ").length,
    archived: messages.filter(m => m.status === "ARCHIVED").length
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Rechercher un message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 py-2 border-slate-200 focus:border-blue-500 rounded-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtres rapides */}
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v: FilterType) => setFilter(v)}>
              <SelectTrigger className="w-[140px] border-slate-200">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous ({counts.all})</SelectItem>
                <SelectItem value="unread">Non lus ({counts.unread})</SelectItem>
                <SelectItem value="read">Lus ({counts.read})</SelectItem>
                <SelectItem value="archived">Archivés ({counts.archived})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v: SortType) => setSort(v)}>
              <SelectTrigger className="w-[140px] border-slate-200">
                <Clock size={16} className="mr-2" />
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="oldest">Plus anciens</SelectItem>
                <SelectItem value="unread">Non lus d'abord</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions de masse (quand des messages sont sélectionnés) */}
        {selectedMessages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-xs"
              >
                {selectedMessages.length === filteredMessages.length ? "Tout désélectionner" : "Tout sélectionner"}
              </Button>
              <span className="text-sm text-slate-500">
                {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} sélectionné{selectedMessages.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <MailOpen size={14} className="mr-2" />
                Marquer comme lu
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Archive size={14} className="mr-2" />
                Archiver
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-slate-500">
            {filteredMessages.length} message{filteredMessages.length > 1 ? 's' : ''} trouvé{filteredMessages.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectAll}
              className="text-xs text-slate-500"
            >
              Tout sélectionner
            </Button>
          </div>
        </div>

        {filteredMessages.length > 0 ? (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <MessageItem 
                key={msg.id} 
                msg={msg} 
                isSelected={selectedMessages.includes(msg.id)}
                onSelect={(id) => {
                  setSelectedMessages(prev =>
                    prev.includes(id)
                      ? prev.filter(i => i !== id)
                      : [...prev, id]
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white border border-slate-200 rounded-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
              Aucun message trouvé
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {search 
                ? "Aucun message ne correspond à votre recherche. Essayez d'autres mots-clés."
                : "Votre boîte de réception est vide. Les nouveaux messages apparaîtront ici."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}