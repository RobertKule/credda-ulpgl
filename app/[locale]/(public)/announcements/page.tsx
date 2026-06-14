// app/[locale]/announcements/page.tsx
import type { Metadata } from "next";
import { sql } from "@/lib/db";
import EditorialPageHero from "@/components/shared/EditorialPageHero";

interface Announcement {
  id: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Announcements - CREDDA" };
}

export default async function AnnouncementsPage() {
  const announcements = (await sql`
    SELECT id, content, "isActive", "createdAt"
    FROM "announcements"
    ORDER BY "createdAt" DESC
  `.catch(() => [])) as Announcement[];

  return (
    <main className="min-h-screen bg-background">
      <EditorialPageHero 
        title="Annonces & Alertes" 
        subtitle="Restez informés des dernières actualités institutionnelles."
        badge="Updates"
      />
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
             {announcements.map((annc) => (
               <div key={annc.id} className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-md flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${annc.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                     {annc.isActive ? "Active" : "Archived"}
                   </span>
                   <span className="text-xs text-muted-foreground font-mono">
                     {new Date(annc.createdAt).toLocaleDateString()}
                   </span>
                 </div>
                 <p className="text-lg md:text-xl font-serif text-foreground leading-relaxed">
                   {annc.content}
                 </p>
               </div>
             ))}
             {announcements.length === 0 && (
               <p className="text-muted-foreground text-center py-12">Aucune annonce pour le moment.</p>
             )}
          </div>
        </div>
      </section>
    </main>
  );
}
