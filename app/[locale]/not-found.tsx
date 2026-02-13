// app/[locale]/not-found.tsx
import { useTranslations } from 'next-intl'; // ✅ CHANGEMENT ICI
import { Link } from '@/navigation';
import { 
  FileSearch, 
  Home, 
  ArrowLeft, 
  BookOpen, 
  Scale, 
  Users,
  Mail,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  const t = useTranslations('NotFound'); // ✅ UTILISATION DES TRADUCTIONS
  
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-12">
        <div className="flex justify-center">
          <Badge className="bg-slate-100 text-slate-600 rounded-none px-4 py-2 uppercase tracking-[0.3em] text-[10px] font-black border-none">
            {t('badge')}
          </Badge>
        </div>

        <div className="relative flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />
            <FileSearch size={120} className="text-slate-200 relative z-10" strokeWidth={1.2} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl lg:text-8xl font-serif font-bold text-slate-900 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 p-8 space-y-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            {t('explore')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NavCard href="/" icon={<Home size={20} />} label={t('home')} />
            <NavCard href="/research" icon={<BookOpen size={20} />} label={t('research')} color="blue" />
            <NavCard href="/clinical" icon={<Scale size={20} />} label={t('clinical')} color="emerald" />
            <NavCard href="/team" icon={<Users size={20} />} label={t('team')} color="blue" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-slate-900 hover:bg-blue-700 text-white rounded-none px-10 py-6 text-xs uppercase tracking-widest font-black transition-all group">
            <Link href="/">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('back')}
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-none px-10 py-6 text-xs uppercase tracking-widest font-black transition-all group">
            <Link href="/contact">
              <Mail size={16} className="mr-2" />
              {t('contact')}
              <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <p className="text-xs text-slate-400 font-light pt-8 border-t border-slate-100">
          {t('help')}{' '}
          <a href="mailto:support@credda-ulpgl.org" className="text-blue-600 hover:underline font-medium">
            support@credda-ulpgl.org
          </a>
        </p>
      </div>
    </main>
  );
}

function NavCard({ href, icon, label, color = "blue" }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  color?: "blue" | "emerald";
}) {
  const colorClasses = {
    blue: "hover:bg-blue-600 hover:border-blue-600",
    emerald: "hover:bg-emerald-600 hover:border-emerald-600"
  };

  return (
    <Link href={href} className={`group p-4 bg-white hover:text-white transition-all duration-300 border border-slate-200 ${colorClasses[color]}`}>
      <div className="mx-auto mb-2 text-slate-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 group-hover:text-white">
        {label}
      </span>
    </Link>
  );
}