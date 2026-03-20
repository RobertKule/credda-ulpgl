// app/[locale]/events/page.tsx
import { db } from "@/lib/db";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function EventsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  
  const events = await db.event.findMany({
    include: {
      translations: { where: { language: locale } }
    },
    orderBy: { date: 'asc' }
  }).catch(() => []);

  const now = new Date();
  const upcomingEvents = events.filter((e: any) => new Date(e.date) >= now);
  const pastEvents = events.filter((e: any) => new Date(e.date) < now);

  return (
    <main className="min-h-screen bg-[#0C0C0A] py-24 px-6 lg:px-12">
       <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-24">
             <span className="text-[10px] uppercase tracking-[0.6em] font-outfit font-bold text-[#C9A84C] block mb-6">Agenda Académique</span>
             <h1 className="text-5xl md:text-8xl font-fraunces font-extrabold text-[#F5F2EC] mb-10 leading-tight">
                Événements <span className="text-[#C9A84C] italic-accent">&</span> Conférences
             </h1>
             <p className="text-lg text-[#F5F2EC]/40 max-w-2xl mx-auto font-outfit font-light">
                Participez à nos symposiums, ateliers cliniques et présentations de rapports annuels.
             </p>
          </div>

          {/* UPCOMING EVENTS */}
          <section className="mb-32">
             <div className="flex items-center gap-6 mb-16">
                <h2 className="text-2xl font-fraunces font-bold text-[#F5F2EC] shrink-0">À Venir</h2>
                <div className="h-[1px] w-full bg-white/5" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.length > 0 ? upcomingEvents.map((event: any) => (
                  <EventCard key={event.id} event={event} locale={locale} />
                )) : (
                  <div className="col-span-full py-20 text-center bg-[#111110] border border-white/5">
                     <p className="text-white/20 uppercase font-outfit font-bold tracking-widest text-[10px]">Aucun événement prévu prochainement</p>
                  </div>
                )}
             </div>
          </section>

          {/* PAST EVENTS */}
          <section>
             <div className="flex items-center gap-6 mb-16">
                <h2 className="text-2xl font-fraunces font-bold text-white/30 shrink-0">Archives</h2>
                <div className="h-[1px] w-full bg-white/5" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                {pastEvents.map((event: any) => (
                  <EventCard key={event.id} event={event} locale={locale} isPast />
                ))}
             </div>
          </section>
       </div>
    </main>
  );
}

function EventCard({ event, locale, isPast = false }: { event: any; locale: string; isPast?: boolean }) {
  const t = event.translations?.[0];
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' }).toUpperCase();

  return (
    <Link 
      href={`/events/${event.slug || event.id}`}
      className="group relative bg-[#111110] border border-white/5 block overflow-hidden transition-all duration-500 hover:border-[#C9A84C]/50"
    >
       <div className="p-10">
          <div className="flex justify-between items-start mb-12">
             <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 pr-8">
                <div className="text-3xl font-fraunces font-extrabold text-[#C9A84C] leading-none">{day}</div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="text-[10px] font-outfit font-bold uppercase tracking-widest text-white/40">{month}</div>
             </div>
             {!isPast && (
               <div className="w-3 h-3 rounded-full bg-[#C9A84C] animate-pulse" />
             )}
          </div>

          <h3 className="text-2xl font-bricolage font-bold text-[#F5F2EC] mb-8 leading-tight group-hover:text-[#C9A84C] transition-colors">
            {t?.title || "Conference CREDDA"}
          </h3>

          <div className="space-y-4">
             <div className="flex items-center gap-3 text-xs text-white/40 font-outfit font-light">
                <MapPin size={14} className="text-[#C9A84C]" />
                {event.location || "Goma, Campus ULPGL"}
             </div>
             <div className="flex items-center gap-3 text-xs text-white/40 font-outfit font-light">
                <Clock size={14} className="text-[#C9A84C]" />
                {event.time || "09:00 - 16:00"}
             </div>
          </div>
       </div>

       <div className="absolute bottom-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <ArrowRight className="text-[#C9A84C]" size={24} />
       </div>
    </Link>
  );
}
