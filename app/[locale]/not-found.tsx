import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import { Home, Mail, BookOpen, Calendar, ImageIcon } from 'lucide-react'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <main className="min-h-screen bg-[#0C0C0A] flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] select-none flex items-center justify-center"
        aria-hidden
      >
        <span className="font-fraunces italic text-[clamp(8rem,28vw,22rem)] leading-none text-[#C9A84C] animate-pulse">
          404
        </span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.45em] font-outfit font-semibold text-[#C9A84C]/80">
            CREDDA · CDE
          </p>
          <h1 className="text-4xl md:text-5xl font-fraunces font-semibold text-[#F5F2EC] tracking-tight">
            {t('title')}
          </h1>
          <p className="text-base text-[#F5F2EC]/55 font-outfit max-w-md mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C9A84C] text-[#0C0C0A] text-[11px] font-outfit font-bold uppercase tracking-[0.2em] hover:bg-[#E8C97A] transition-colors rounded-sm"
          >
            <Home size={16} className="mr-2" />
            {t('home')}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-[#C9A84C] text-[#C9A84C] text-[11px] font-outfit font-bold uppercase tracking-[0.2em] hover:bg-[#C9A84C]/10 transition-colors rounded-sm"
          >
            <Mail size={16} className="mr-2" />
            {t('contact')}
          </Link>
        </div>

        <div className="pt-8 border-t border-[rgba(245,242,236,0.07)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#F5F2EC]/35 font-outfit mb-6">
            {t('explore')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <QuickLink href="/research" label={t('research')} icon={<BookOpen size={14} />} />
            <QuickLink href="/publications" label={t('publications')} icon={<BookOpen size={14} />} />
            <QuickLink href="/events" label={t('events')} icon={<Calendar size={14} />} />
            <QuickLink href="/gallery" label={t('gallery')} icon={<ImageIcon size={14} />} />
          </div>
        </div>
      </div>
    </main>
  )
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-outfit font-medium uppercase tracking-wider text-[#F5F2EC]/50 border border-[rgba(245,242,236,0.08)] hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors rounded-sm"
    >
      {icon}
      {label}
    </Link>
  )
}
