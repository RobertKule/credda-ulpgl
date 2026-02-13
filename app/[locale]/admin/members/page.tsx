// AdminMembersPage.tsx
"use client"; // <-- ajoute ça tout en haut
import { db } from "@/lib/db";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCircle, Mail, GripVertical, Edit } from "lucide-react";
import Image from "next/image";
import DeleteButton from "@/components/admin/DeleteButton";


import { useState } from "react";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminMembersPage({ params }: Props) {
  const { locale } = await params;

  const members = await db.member.findMany({
    include: { translations: { where: { language: locale } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Corps de Recherche</h1>
          <p className="text-slate-500 text-sm">Gérez les membres de la direction et les chercheurs associés.</p>
        </div>
        <Button asChild className="bg-slate-900 hover:bg-blue-600 rounded-none">
          <Link href="/admin/members/new" className="flex items-center gap-2">
            <UserPlus size={18} /> Ajouter un membre
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {members.map((m) => (
    <div
      key={m.id}
      className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* HEADER IMAGE + ROLE */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex-shrink-0">
          {m.image ? (
            <Image src={m.image} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <UserCircle size={32} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-bold text-lg text-slate-900 truncate">
            {m.translations[0]?.name || "Nom inconnu"}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-blue-50 text-blue-600">
            {m.translations[0]?.role || "Rôle non défini"}
          </span>
        </div>
      </div>

      {/* EMAIL */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-4">
        <Mail size={14} /> {m.email || "Non renseigné"}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" asChild className="flex-1 mr-2">
          <Link href={`/admin/members/${m.id}/edit`} className="text-[10px] font-bold">
            Modifier
          </Link>
        </Button>
        <DeleteButton id={m.id} type="member" />
      </div>
    </div>
  ))}
</div>

    </div>
  );
}