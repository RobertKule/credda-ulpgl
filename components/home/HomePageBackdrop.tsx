'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useTheme } from '@/components/shared/ThemeProvider'
import HomeBackdropParticles from '@/components/home/HomeBackdropParticles'

const AfricaGlobe = dynamic(() => import('@/components/home/AfricaGlobe'), {
  ssr: false,
  loading: () => null,
})

/**
 * Globe + particules en fond : thème clair/sombre, mouvement scroll + souris.
 */
export default function HomePageBackdrop() {
  const { theme } = useTheme()
  const reduceMotion = useReducedMotion() === true
  const { scrollYProgress } = useScroll()

  const scrollGlobeX = useTransform(
    scrollYProgress,
    [0, 0.38, 1],
    reduceMotion ? [0, 0, 0] : [0, 88, -112]
  )
  const scrollGlobeY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [0, 0, 0] : [0, -58, 118]
  )
  const scrollGlobeScale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.55, 0.82, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.82, 1.12, 1.18, 1.04, 0.86]
  )
  const scrollGlobeRotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 16]
  )

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseZoom = useMotionValue(1)
  const springX = useSpring(mouseX, { stiffness: 32, damping: 24, mass: 0.4 })
  const springY = useSpring(mouseY, { stiffness: 32, damping: 24, mass: 0.4 })
  const springZoom = useSpring(mouseZoom, { stiffness: 40, damping: 28, mass: 0.35 })

  useEffect(() => {
    if (reduceMotion) return
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(nx * 36)
      mouseY.set(ny * 28)
      const dist = Math.min(1, Math.hypot(nx, ny))
      mouseZoom.set(1 + dist * 0.055)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduceMotion, mouseX, mouseY, mouseZoom])

  const isLight = theme === 'light'
  /* Vignette plus légère au centre pour laisser voir le globe ; bords assombris pour le texte */
  const vignetteClass = isLight
    ? 'from-[#f8f6f1] via-[#f8f6f1]/12 via-45% to-[#f0ebe3] opacity-[0.42]'
    : 'from-[#0D0D0B] via-[#0D0D0B]/8 via-45% to-[#0D0D0B] opacity-[0.28]'

  const globeOpacity = isLight
    ? 'opacity-[0.62] sm:opacity-[0.68] lg:opacity-[0.74]'
    : 'opacity-[0.56] sm:opacity-[0.62] lg:opacity-[0.70]'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className={`absolute left-[52%] top-[38%] w-[min(145vmin,72rem)] max-w-[1800px] -translate-x-1/2 -translate-y-1/2 lg:left-1/2 ${globeOpacity}`}
      >
        <motion.div
          className="h-full w-full"
          style={{
            x: scrollGlobeX,
            y: scrollGlobeY,
            scale: scrollGlobeScale,
            rotateZ: scrollGlobeRotate,
          }}
        >
          <motion.div
            className="h-full w-full"
            style={
              reduceMotion
                ? undefined
                : { x: springX, y: springY, scale: springZoom }
            }
          >
            <AfricaGlobe />
          </motion.div>
        </motion.div>
      </div>

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
