// app/admin/members/MembersList.tsx
"use client";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  Calendar,
  Edit,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Globe
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListProps {
  members: any[];
  locale: string;
}

export default function MembersList({ members }: MemberListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fonction pour obtenir l'initiale du nom
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Couleurs de fond aléatoires mais cohérentes par ID
  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-emerald-100 text-emerald-600',
      'bg-amber-100 text-amber-600',
      'bg-rose-100 text-rose-600',
      'bg-purple-100 text-purple-600',
      'bg-cyan-100 text-cyan-600'
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Fonction pour formater le rôle
  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER avec contrôles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">
            Corps de Recherche
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {members.length} membre{members.length > 1 ? 's' : ''} • Gérez l'équipe de recherche
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Toggle view mode */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid" 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list" 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <Button asChild className="bg-slate-900 hover:bg-blue-600 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex-1 sm:flex-none">
            <Link href="/admin/members/new" className="flex items-center gap-2">
              <UserPlus size={18} /> 
              <span className="hidden sm:inline">Ajouter un membre</span>
              <span className="sm:hidden">Ajouter</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m, index) => (
            <div
              key={m.id}
              className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Card content */}
              <div className="p-6">
                {/* Avatar section */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    {m.image ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-100 group-hover:ring-blue-100 transition-all duration-300">
                        <Image
                          src={m.image}
                          alt={m.translations[0]?.name || "Avatar"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ${getAvatarColor(m.id)} ring-4 ring-slate-100 group-hover:ring-blue-100 transition-all duration-300`}>
                        {getInitials(m.translations[0]?.name || "Unknown")}
                      </div>
                    )}
                    
                    {/* Status dot */}
                    <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                      m.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </div>
                </div>

                {/* Info section */}
                <div className="text-center mb-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                    {m.translations[0]?.name || "Nom inconnu"}
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    {formatRole(m.translations[0]?.role || m.role || "Chercheur")}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  {m.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate text-xs">{m.email}</span>
                    </div>
                  )}
                  {m.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate text-xs">{m.phone}</span>
                    </div>
                  )}
                  {m.department && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate text-xs">{m.department}</span>
                    </div>
                  )}
                  {m.joinedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate text-xs">Depuis {new Date(m.joinedAt).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-100">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-slate-900">{m.publications || 0}</div>
                    <div className="text-[10px] text-slate-500">Publications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-slate-900">{m.projects || 0}</div>
                    <div className="text-[10px] text-slate-500">Projets</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 text-xs hover:bg-slate-50"
                  >
                    <Link href={`/admin/members/${m.id}/edit`}>
                      <Edit size={14} className="mr-1" /> Modifier
                    </Link>
                  </Button>
                  <DeleteButton id={m.id} type="member" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {members.map((m, index) => (
            <div
              key={m.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-slate-50 transition-colors duration-200 ${
                index !== members.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {m.image ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={m.image}
                      alt={m.translations[0]?.name || "Avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(m.id)} flex-shrink-0`}>
                    {getInitials(m.translations[0]?.name || "Unknown")}
                  </div>
                )}
                
                <div className="flex-1 min-w-0 sm:hidden">
                  <h3 className="font-serif font-bold text-slate-900 truncate">
                    {m.translations[0]?.name || "Nom inconnu"}
                  </h3>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {formatRole(m.translations[0]?.role || m.role || "Chercheur")}
                  </Badge>
                </div>
              </div>

              {/* Info - Hidden on mobile (already shown above) */}
              <div className="hidden sm:block flex-1 min-w-0">
                <h3 className="font-serif font-bold text-slate-900 truncate">
                  {m.translations[0]?.name || "Nom inconnu"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {formatRole(m.translations[0]?.role || m.role || "Chercheur")}
                  </Badge>
                  <span className={`w-2 h-2 rounded-full ${
                    m.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                </div>
              </div>

              {/* Contact info */}
              <div className="flex-1 text-sm text-slate-600 hidden lg:block">
                {m.email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{m.email}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-slate-900">{m.publications || 0}</div>
                  <div className="text-[10px] text-slate-500">Pub.</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-slate-900">{m.projects || 0}</div>
                  <div className="text-[10px] text-slate-500">Proj.</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-slate-200"
                >
                  <Link href={`/admin/members/${m.id}/edit`}>
                    <Edit size={16} />
                  </Link>
                </Button>
                <DeleteButton id={m.id} type="member" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
            Aucun membre pour le moment
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Commencez par ajouter votre premier membre de recherche.
          </p>
          <Button asChild className="bg-slate-900 hover:bg-blue-600">
            <Link href="/admin/members/new" className="flex items-center gap-2">
              <UserPlus size={18} /> Ajouter un membre
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}