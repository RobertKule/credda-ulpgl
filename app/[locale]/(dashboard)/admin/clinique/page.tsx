import React from "react";
import { Scale } from "lucide-react";
import CliniqueClient from "./CliniqueClient";
import { getClinicalCases } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CliniquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  let cases: Awaited<ReturnType<typeof getClinicalCases>> = [];
  try {
    cases = await getClinicalCases();
  } catch {
    // Not authenticated or no data — client will show empty state
  }

  return (
    <div className="w-full h-full flex flex-col space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-8 h-8 text-indigo-600" />
            <span>Clinique de Droit de l&apos;Environnement</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Gestion des litiges, dossiers contentieux et médiations environnementales.
          </p>
        </div>
      </div>

      <CliniqueClient locale={locale} initialData={cases as unknown as import("./CliniqueClient").ClinicalCase[]} userRole={session?.user?.role || "USER"} />
    </div>
  );
}
