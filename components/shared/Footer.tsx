import { Link } from "../../navigation"; 
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050a15] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Colonne 1: Identité */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="text-3xl font-serif font-bold tracking-tighter">
                CREDDA<span className="text-blue-500">.ULPGL</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light max-w-xs">
                Institution d'excellence de l'Université Libre des Pays des Grands Lacs dédiée à la recherche scientifique et à la pratique clinique juridique.
              </p>
            </div>
            <div className="flex gap-5">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-600 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-400 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-blue-800 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 2: Expertise */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Domaines d'Expertise</h4>
            <ul className="space-y-4">
              {["Démocratie & Élections", "Gouvernance Foncière", "Justice Environnementale", "Paix & Résolution de Conflits"].map((item) => (
                <li key={item} className="group">
                  <Link href="/research" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Navigation Rapide */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Ressources Académiques</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white flex items-center justify-between group">Notre Histoire <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/publications" className="hover:text-white flex items-center justify-between group">Bibliothèque de Rapports <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/team" className="hover:text-white flex items-center justify-between group">Corps de Recherche <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/contact" className="hover:text-white flex items-center justify-between group">Partenariats Scientifiques <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100" /></Link></li>
              <li><Link href="/admin" className="text-blue-400 font-bold italic mt-4 block">Espace Administration</Link></li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Secrétariat Goma</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Campus ULPGL, Quartier Himbi, <br /> Goma, Nord-Kivu, RD Congo.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-blue-500 shrink-0" />
                <p className="text-sm text-slate-400 font-light">+243 812 345 678</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-blue-500 shrink-0" />
                <p className="text-sm text-slate-400 font-light">contact@credda-ulpgl.org</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              © {currentYear} CREDDA-ULPGL. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[9px] uppercase font-bold text-slate-600 tracking-widest">
              <a href="#" className="hover:text-blue-400">Mentions Légales</a>
              <a href="#" className="hover:text-blue-400">Politique de Confidentialité</a>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Système Opérationnel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}