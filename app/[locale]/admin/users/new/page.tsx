"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/services/user-actions";
import { useRouter, useParams } from "next/navigation";
import { ShieldAlert, Save } from "lucide-react";

export default function NewUserPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [data, setData] = useState({ name: "", email: "", password: "", role: "ADMIN" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createUser(data);
    if (res.success) router.push(`/${locale}/admin/users`);
    else alert(res.error);
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-white border border-slate-200 p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <ShieldAlert size={48} className="mx-auto text-blue-600" />
          <h1 className="text-2xl font-serif font-bold">Créer un Administrateur</h1>
          <p className="text-slate-500 text-sm">Ce compte aura accès à toute la gestion du site.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest">Nom Complet</label>
            <Input required value={data.name} onChange={e => setData({...data, name: e.target.value})} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest">Email Professionnel</label>
            <Input required type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="rounded-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest">Mot de passe provisoire</label>
            <Input required type="password" value={data.password} onChange={e => setData({...data, password: e.target.value})} className="rounded-none" />
          </div>
          <Button type="submit" className="w-full bg-blue-600 rounded-none h-14 uppercase font-black text-xs tracking-widest">
            Générer l'accès
          </Button>
        </form>
      </div>
    </div>
  );
}