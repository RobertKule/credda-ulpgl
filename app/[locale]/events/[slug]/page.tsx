// app/[locale]/events/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, ArrowLeft, Users, Camera, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  
  const event = await db.event.findUnique({
    where: { slug },
    include: {
      translations: { where: { language: locale } },
      galleryImages: {
        include: { translations: { where: { language: locale } } }
      }
    }
  });

  if (!event) notFound();

  const t = event.translations?.[0];
  const date = new Date(event.date);

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
       <div className="max-w-5xl mx-auto">
          {/* NAVIGATION */}
          <Link href="/events" className="inline-flex items-center gap-2 text-[#C9A84C] text-[10px] uppercase font-black tracking-[0.3em] mb-16 hover:gap-4 transition-all">
             <ArrowLeft size={14} /> Agenda des événements
          </Link>

          {/* HERO */}
          <header className="mb-24">
             <div className="flex items-center gap-6 mb-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Détail Événement</span>
                <div className="h-[1px] flex-1 bg-white/5" />
             </div>

             <h1 className="text-5xl md:text-8xl font-serif font-black text-[#F5F2EC] leading-tight mb-16">
                {t?.title || "Événement CREDDA"}
             </h1>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-[#111110] border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-black flex items-center justify-center text-[#C9A84C] border border-white/5">
                      <Calendar size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Date</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">{date.toLocaleDateString(locale, { dateStyle: 'full' })}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-black flex items-center justify-center text-[#C9A84C] border border-white/5">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Lieu</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">{event.location || "Campus ULPGL Goma"}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-black flex items-center justify-center text-[#C9A84C] border border-white/5">
                      <Clock size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Horaire</p>
                      <p className="text-sm font-bold text-[#F5F2EC]">{event.time || "09:00 - 15:30"}</p>
                   </div>
                </div>
             </div>
          </header>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-32">
             <div className="lg:col-span-2 space-y-12">
                <h2 className="text-2xl font-serif font-black text-[#F5F2EC] pb-6 border-b border-white/5">À propos de cet événement</h2>
                <div className="prose prose-invert prose-gold max-w-none text-[#F5F2EC]/70 text-lg leading-relaxed font-light">
                   {t?.description ? (
                     <div dangerouslySetInnerHTML={{ __html: t.description }} />
                   ) : (
                     <p>Les détails de cette conférence seront communiqués prochainement par le secrétariat scientifique du CREDDA.</p>
                   )}
                </div>

                <div className="flex flex-wrap gap-4 pt-10">
                   <Button className="bg-[#C9A84C] text-[#0C0C0A] rounded-none px-10 py-7 font-black uppercase text-[10px] tracking-widest">
                      S'inscrire à l'événement
                   </Button>
                   <Button variant="outline" className="border-white/10 text-white rounded-none px-10 py-7 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black">
                      Ajouter au calendrier
                   </Button>
                </div>
             </div>

             <aside className="space-y-12">
                <div className="p-10 border border-white/5 bg-gradient-to-b from-[#111110] to-transparent">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#C9A84C] mb-8">Informations</h3>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between text-xs pb-4 border-b border-white/5">
                         <span className="text-white/20 uppercase font-bold tracking-widest">Type</span>
                         <span className="font-bold text-[#F5F2EC]">Public</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-4 border-b border-white/5">
                         <span className="text-white/20 uppercase font-bold tracking-widest">Organisateur</span>
                         <span className="font-bold text-[#F5F2EC]">CREDDA Lab</span>
                      </div>
                   </div>
                   <div className="mt-8 pt-8 flex justify-center">
                      <Share2 className="text-white/20 hover:text-[#C9A84C] transition-colors cursor-pointer" />
                   </div>
                </div>
             </aside>
          </div>

          {/* EVENT GALLERY */}
          {event.galleryImages?.length > 0 && (
            <section>
               <div className="flex items-center gap-6 mb-12">
                  <div className="flex items-center gap-3">
                     <Camera className="text-[#C9A84C]" size={20} />
                     <h3 className="text-2xl font-serif font-black text-[#F5F2EC]">Galerie de l'événement</h3>
                  </div>
                  <div className="h-[1px] flex-1 bg-white/5" />
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {event.galleryImages.map((img: any) => (
                    <div key={img.id} className="aspect-square bg-[#111110] relative overflow-hidden group">
                       <img 
                          src={img.src} 
                          alt="Event action" 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                       />
                    </div>
                  ))}
               </div>
            </section>
          )}
       </div>
    </main>
  );
}
