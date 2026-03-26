// app/[locale]/clinical/environmental/sessions/page.tsx
import { getUpcomingMobileClinics } from "@/services/clinic-session-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ChevronRight,
  Info,
  Map as MapIcon,
  Bell,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Link } from "@/navigation";
import MobileClinicMapWrapper from "@/components/clinical/MobileClinicMapWrapper";

export default async function MobileClinicPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const result = await getUpcomingMobileClinics();
  const sessions = result.success ? result.data : [];

  // Mock coordinates for demo purposes
  const sessionsWithCoords = sessions.map((s: any, i: number) => ({
    ...s,
    lat: s.lat ?? -1.6585 + (Math.random() - 0.5) * 0.5,
    lng: s.lng ?? 29.2230 + (Math.random() - 0.5) * 0.5
  }));

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. EDITORIAL HEADER */}
      <section className="bg-primary text-white pt-32 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <Link href="/clinical/environmental" className="inline-flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors group">
              <div className="w-8 h-[1px] bg-secondary group-hover:w-12 transition-all" />
              <span>Back to Clinic Hub</span>
            </Link>
            <h1 className="text-5xl md:text-8xl font-serif font-black leading-[0.9] tracking-tighter">
              Mobile <br /> <span className="text-secondary italic">Clinics.</span>
            </h1>
            <p className="text-xl text-white/50 font-light leading-relaxed max-w-2xl">
              Mapping our direct intervention across the territories. Sustainable legal empowerment for local communities and indigenous peoples.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE TERRITORY MAP */}
      <section className="container mx-auto px-6 -mt-24 relative z-20">
         <div className="bg-white border border-light-gray shadow-3xl overflow-hidden">
            <div className="p-8 border-b border-light-gray flex flex-col md:flex-row justify-between items-center gap-6 bg-soft-cream/30">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary text-secondary">
                     <MapIcon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                     <h3 className="font-serif font-black text-primary uppercase text-xs tracking-widest">Intervention Map</h3>
                     <p className="text-anthracite/40 text-[10px] font-black uppercase tracking-widest">Visualizing Clinical Deployment</p>
                  </div>
               </div>
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-secondary rounded-md animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">Active Sessions</span>
                  </div>
               </div>
            </div>
            <MobileClinicMapWrapper locations={sessionsWithCoords} />
         </div>
      </section>

      {/* 3. SESSION LOG & REGISTRY */}
      <section className="container mx-auto px-6 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          <div className="lg:col-span-8 space-y-16">
            <div className="flex items-end justify-between border-b border-light-gray pb-8">
               <h2 className="text-4xl font-serif font-black text-primary italic">Upcoming Registry.</h2>
               <Badge className="bg-primary/5 text-primary border-none rounded-none px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
                 Total: {sessions.length} Deployments
               </Badge>
            </div>

            {sessions.length === 0 ? (
              <div className="p-24 text-center border-2 border-dashed border-light-gray bg-soft-cream/20 space-y-8">
                <ShieldAlert className="mx-auto text-light-gray" size={64} strokeWidth={1} />
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-black text-primary">Mission Planning in Progress</h3>
                  <p className="text-anthracite/40 font-light max-w-sm mx-auto">We are finalizing logistics for the next quarter. Stay tuned for deployment updates.</p>
                </div>
                <Button className="bg-primary text-secondary rounded-none px-10 py-6 font-black uppercase tracking-widest text-[10px] hover:bg-secondary hover:text-primary transition-all">
                  <Bell size={16} className="mr-3" /> Get Deployment Alerts
                </Button>
              </div>
            ) : (
              <div className="grid gap-8">
                {sessions.map((session: any) => (
                  <div key={session.id} className="group bg-white border border-light-gray flex flex-col md:flex-row hover:border-secondary transition-all">
                    <div className="bg-primary text-white p-10 md:w-56 flex flex-col items-center justify-center text-center group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">
                        {new Date(session.date).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })}
                      </span>
                      <span className="text-6xl font-serif font-black leading-none">
                        {new Date(session.date).getDate()}
                      </span>
                      <span className="text-xs font-black mt-3 uppercase tracking-widest opacity-70">
                        {new Date(session.date).getFullYear()}
                      </span>
                    </div>
                    <div className="p-12 flex-1 space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-secondary/10 text-secondary border-none rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                             Tactical Deployment
                           </Badge>
                        </div>
                        <h3 className="text-3xl font-serif font-black text-primary leading-tight">{session.title}</h3>
                        <p className="text-anthracite/60 font-light leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-12 pt-8 border-t border-light-gray">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-anthracite/40">Deployment Location</p>
                          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                            <MapPin size={14} className="text-secondary" />
                            {session.location}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-anthracite/40">Operational Hours</p>
                          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                            <Clock size={14} className="text-secondary" />
                            09:00 — 16:00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="bg-primary p-12 text-white space-y-10 relative overflow-hidden shadow-3xl">
               <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
                 <Users size={200} strokeWidth={1} />
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-3xl font-serif font-black italic">Protocol.</h3>
                  <div className="w-12 h-1 bg-secondary" />
               </div>
               <ol className="space-y-10 relative z-10">
                 {[
                   { t: "Identification", d: "Locate the clinic in your territory (Schools, Local Offices)." },
                   { t: "Intake", d: "Confidential interview with our specialized legal clinicians." },
                   { t: "Strategy", d: "Immediate counsel or case registration for litigation." }
                 ].map((step, i) => (
                    <li key={i} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-serif font-black text-secondary">0{i+1}</span>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{step.t}</h4>
                      </div>
                      <p className="text-xs text-white/50 font-light leading-relaxed pl-10">{step.d}</p>
                    </li>
                 ))}
               </ol>
            </div>

            <div className="p-12 border border-light-gray bg-soft-cream/20 space-y-8">
               <h3 className="text-xl font-serif font-black text-primary">Field Partners</h3>
               <div className="grid grid-cols-1 gap-4 opacity-40">
                  <div className="border border-light-gray p-6 grayscale hover:grayscale-0 transition-all flex items-center justify-center font-black uppercase text-[10px] tracking-widest">
                    ULPGL University
                  </div>
                  <div className="border border-light-gray p-6 grayscale hover:grayscale-0 transition-all flex items-center justify-center font-black uppercase text-[10px] tracking-widest">
                    Justice for Peace (JFP)
                  </div>
               </div>
               <Button variant="ghost" className="w-full justify-between text-primary font-black uppercase tracking-widest text-[9px] p-0 hover:bg-transparent group">
                 <span>Collaborate with us</span>
                 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
