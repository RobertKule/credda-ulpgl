import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#0C0C0A] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] flex items-center justify-center"
        aria-hidden
      >
        <span className="font-fraunces italic text-[clamp(6rem,22vw,16rem)] text-[#C9A84C] animate-pulse">
          404
        </span>
      </div>
      <div className="relative z-10 text-center space-y-8 max-w-md">
        <h1 className="text-3xl font-fraunces text-[#F5F2EC]">Page introuvable</h1>
        <p className="text-[#F5F2EC]/55 font-outfit text-sm leading-relaxed">
          La page demandée n&apos;existe pas. Utilisez les liens ci-dessous (locale par défaut : français).
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/fr"
            className="inline-flex justify-center px-6 py-3 bg-[#C9A84C] text-[#0C0C0A] text-[11px] font-outfit font-bold uppercase tracking-wider rounded-sm"
          >
            Accueil (FR)
          </Link>
          <Link
            href="/fr/contact"
            className="inline-flex justify-center px-6 py-3 border border-[#C9A84C] text-[#C9A84C] text-[11px] font-outfit font-bold uppercase tracking-wider rounded-sm"
          >
            Contact
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-2 pt-4 text-[10px] font-outfit uppercase tracking-wider">
          <Link href="/fr/about" className="text-[#F5F2EC]/45 hover:text-[#C9A84C]">
            À propos
          </Link>
          <span className="text-[#F5F2EC]/20">·</span>
          <Link href="/fr/publications" className="text-[#F5F2EC]/45 hover:text-[#C9A84C]">
            Publications
          </Link>
          <span className="text-[#F5F2EC]/20">·</span>
          <Link href="/fr/events" className="text-[#F5F2EC]/45 hover:text-[#C9A84C]">
            Événements
          </Link>
        </div>
      </div>
    </main>
  )
}
