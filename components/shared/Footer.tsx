import { Link } from "../../navigation"; 
import { useLocale } from "next-intl";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050a15] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        {/* Colonne 1: Identité */}
        <div className="space-y-6">
          <div className="text-3xl font-serif font-bold tracking-tighter">
            CREDDA<span className="text-blue-500">.ULPGL</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Centre de Recherche sur la Démocratie et le Développement en Afrique. 
            Une institution de l'Université Libre des Pays des Grands Lacs (ULPGL).
          </p>
          <div className="flex gap-4">
            <Facebook size={18} className="text-slate-500 hover:text-white cursor-pointer" />
            <Twitter size={18} className="text-slate-500 hover:text-white cursor-pointer" />
            <Linkedin size={18} className="text-slate-500 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Colonne 2: Domaines */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Expertise</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-light">
            <li className="hover:text-white cursor-pointer">Gouvernance Institutionnelle</li>
            <li className="hover:text-white cursor-pointer">Droit de l'Environnement</li>
            <li className="hover:text-white cursor-pointer">Paix et Résolution de Conflits</li>
            <li className="hover:text-white cursor-pointer">Clinique Juridique Mobile</li>
          </ul>
        </div>

        {/* Colonne 3: Liens Utiles */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Ressources</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-light">
            <li><Link href="/publications" className="hover:text-white">Bibliothèque Numérique</Link></li>
            <li><Link href="/team" className="hover:text-white">Chercheurs Associés</Link></li>
            <li><Link href="/contact" className="hover:text-white">Devenir Partenaire</Link></li>
            <li><Link href="/admin" className="hover:text-white italic">Portail Admin</Link></li>
          </ul>
        </div>

        {/* Colonne 4: Contact */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-light">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 shrink-0" />
              <span>Campus ULPGL, Goma, Nord-Kivu, RD Congo</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500 shrink-0" />
              <span>+243 812 345 678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <span>contact@credda-ulpgl.org</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} CREDDA-ULPGL. All Rights Reserved.
        </p>
        <p className="text-[10px] text-slate-600">
          Developed for Academic Excellence
        </p>
      </div>
    </footer>
  );
}