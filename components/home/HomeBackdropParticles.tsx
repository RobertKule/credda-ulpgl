'use client'

import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import { useTheme } from '@/components/shared/ThemeProvider'

const N = 190

function initParticles(w: number, h: number) {
  return Array.from({ length: N }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2.2 + 0.55,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
    drift: 0.4 + Math.random() * 1.2,
  }))
}

/**
 * Particules plein écran dont la dérive est amplifiée par le scroll (canvas).
 */
export default function HomeBackdropParticles({
  reduceMotion,
  scrollYProgress,
}: {
  reduceMotion: boolean
  scrollYProgress: MotionValue<number>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let t = 0
    let particles = initParticles(1, 1)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = initParticles(w, h)
    }

    resize()
    window.addEventListener('resize', resize)

    const isLight = theme === 'light'
    /* Clair : points sombres ; sombre : points dorés / crème */
    const fill = isLight ? 'rgba(28,26,24,' : 'rgba(201,168,76,'
    const fillSoft = isLight ? 'rgba(80,76,72,' : 'rgba(245,242,236,'

    const loop = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const p = scrollYProgress.get()
      const scrollBoost = reduceMotion ? 0 : p * 640

      ctx.clearRect(0, 0, w, h)

      particles.forEach((pt, i) => {
        if (!reduceMotion) {
          pt.x += pt.vx + scrollBoost * pt.drift * 0.015
          pt.y +=
            pt.vy +
            Math.sin(t * 0.4 + pt.phase) * 0.42 +
            p * 34 * pt.drift
        }
        if (pt.x < -20) pt.x = w + 20
        if (pt.x > w + 20) pt.x = -20
        if (pt.y < -20) pt.y = h + 20
        if (pt.y > h + 20) pt.y = -20

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + pt.phase)
        const alpha =
          (isLight ? 0.28 : 0.34) * pulse * (0.65 + (i % 5) * 0.09)
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2)
        ctx.fillStyle = (i % 3 === 0 ? fillSoft : fill) + alpha.toFixed(3) + ')'
        ctx.fill()
      })

      if (!reduceMotion) t += 0.016
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [theme, reduceMotion, scrollYProgress])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      aria-hidden
    />
  )
}
