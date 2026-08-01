'use client'

import { useEffect } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { useTheme } from '@/components/shared/ThemeProvider'
import HomeBackdropParticles from '@/components/home/HomeBackdropParticles'

/**
 * Particules en fond : thème clair/sombre, mouvement scroll.
 */
export default function HomePageBackdrop() {
  const { theme } = useTheme()
  const reduceMotion = useReducedMotion() === true
  const { scrollYProgress } = useScroll()

  const isLight = theme === 'light'
  const vignetteClass = isLight
    ? 'from-[#f8f6f1] via-[#f8f6f1]/12 via-45% to-[#f0ebe3] opacity-[0.42]'
    : 'from-[#0D0D0B] via-[#0D0D0B]/8 via-45% to-[#0D0D0B] opacity-[0.28]'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <HomeBackdropParticles
        reduceMotion={reduceMotion}
        scrollYProgress={scrollYProgress}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b ${vignetteClass}`}
      />
    </div>
  )
}
