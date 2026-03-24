'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from '@/components/shared/ThemeProvider'

const W = 900
const H = 900
const CX = W / 2
const CY = H / 2
const R = 320

const africa: [number, number][] = [
  [37,10],[37,15],[36,22],[32,28],[28,33],[22,36],[15,40],[10,42],[5,41],
  [0,42],[-5,40],[-10,38],[-15,36],[-20,34],[-25,33],[-28,31],[-32,27],
  [-34,22],[-35,18],[-34,14],[-32,10],[-28,17],[-25,15],[-20,14],[-15,12],
  [-10,10],[-5,8],[0,8],[5,5],[10,2],[12,-3],[10,-8],[5,-12],[0,-10],
  [-5,-8],[-10,-5],[-15,-3],[-17,2],[-15,5],[-12,8],[-10,10],[-5,8],
  [0,8],[5,10],[10,12],[15,15],[18,20],[20,25],[22,30],[28,33]
]

const cities = [
  { lat: -1.68, lon: 29.23, name: 'Goma', r: 5, gold: true },
  { lat: -4.32, lon: 15.32, name: 'Kinshasa', r: 3, gold: false },
  { lat: -1.28, lon: 36.82, name: 'Nairobi', r: 3, gold: false },
  { lat: 9.05, lon: 38.74, name: 'Addis', r: 2.5, gold: false },
  { lat: 30.06, lon: 31.25, name: 'Cairo', r: 2.5, gold: false },
  { lat: 14.69, lon: -17.44, name: 'Dakar', r: 2.5, gold: false },
]

const lines = [
  { from: { lat: -1.68, lon: 29.23 }, to: { lat: -1.28, lon: 36.82 } },
  { from: { lat: -1.68, lon: 29.23 }, to: { lat: -4.32, lon: 15.32 } },
  { from: { lat: -1.68, lon: 29.23 }, to: { lat: 9.05, lon: 38.74 } },
]

function makeParticles() {
  return Array.from({ length: 140 }, () => ({
    lat: (Math.random() - 0.5) * 160,
    lon: Math.random() * 360 - 180,
    size: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.5 + 0.1,
  }))
}

function project(lat: number, lon: number, rotation: number) {
  const phi = (lat * Math.PI) / 180
  const lam = ((lon + rotation) * Math.PI) / 180
  const x = R * Math.cos(phi) * Math.sin(lam)
  const y = -R * Math.sin(phi)
  const z = R * Math.cos(phi) * Math.cos(lam)
  return { x: CX + x, y: CY + y, z, visible: z > 0 }
}

type Palette = {
  ocean: string
  rim: string
  gridLat: string
  gridLon: string
  particle: string
  africa: string
  africaLine: string
  lineAnim: string
  cityMuted: string
  gomaCore: string
  gomaGlow: string
}

/** Mode sombre : globe en tons clairs (or / blanc cassé) sur océan noir */
const paletteDark: Palette = {
  ocean: '#0D0D0B',
  rim: 'rgba(245,242,236,0.22)',
  gridLat: 'rgba(245,242,236,0.11)',
  gridLon: 'rgba(245,242,236,0.08)',
  particle: '230,230,228',
  africa: '245,242,236',
  africaLine: '220,230,230',
  lineAnim: '201,168,76',
  cityMuted: '245,242,236',
  gomaCore: '#F5F2EC',
  gomaGlow: '201,168,76',
}

/** Mode clair : silhouette en noir / gris foncé sur océan très clair */
const paletteLight: Palette = {
  ocean: '#EDEAE4',
  rim: 'rgba(18,16,14,0.28)',
  gridLat: 'rgba(18,16,14,0.11)',
  gridLon: 'rgba(18,16,14,0.085)',
  particle: '35,35,38',
  africa: '18,16,14',
  africaLine: '18,16,14',
  lineAnim: '55,50,45',
  cityMuted: '55,52,48',
  gomaCore: '#121210',
  gomaGlow: '40,38,36',
}

export default function AfricaGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const palette: Palette = isLight ? paletteLight : paletteDark

    canvas.width = W
    canvas.height = H

    const particles = makeParticles()
    let rot = 0
    let t = 0
    let raf = 0

    function draw() {
      ctx.clearRect(0, 0, W, H)

      ctx.beginPath()
      ctx.arc(CX, CY, R, 0, Math.PI * 2)
      ctx.fillStyle = palette.ocean
      ctx.fill()
      ctx.strokeStyle = palette.rim
      ctx.lineWidth = 0.5
      ctx.stroke()

      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath()
        let first = true
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lat, lon, rot)
          if (!p.visible) { first = true; continue }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
          first = false
        }
        ctx.strokeStyle = palette.gridLat
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath()
        let first = true
        for (let lat2 = -90; lat2 <= 90; lat2 += 3) {
          const p = project(lat2, lon, rot)
          if (!p.visible) { first = true; continue }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
          first = false
        }
        ctx.strokeStyle = palette.gridLon
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      particles.forEach(pt => {
        const pos = project(pt.lat, pt.lon + (t * pt.speed * 40), rot)
        if (!pos.visible) return
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + pt.phase)
        const alpha = pt.alpha * (0.4 + 0.6 * (pos.z / R)) * (0.7 + 0.3 * pulse)
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, pt.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${palette.particle},${alpha.toFixed(2)})`
        ctx.fill()
      })

      let prevP: { x: number; y: number; z: number } | null = null
      africa.forEach(([alat, alon]) => {
        const p = project(alat, alon, rot)
        if (!p.visible) { prevP = null; return }
        const alpha = 0.3 + 0.4 * (p.z / R)
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${palette.africa},${alpha.toFixed(2)})`
        ctx.fill()
        if (prevP) {
          ctx.beginPath()
          ctx.moveTo(prevP.x, prevP.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(${palette.africaLine},${(alpha * 0.6).toFixed(2)})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
        prevP = p
      })

      lines.forEach(line => {
        let prevPt: { x: number; y: number; z: number } | null = null
        for (let i = 0; i <= 40; i++) {
          const f = i / 40
          const p = project(
            line.from.lat + (line.to.lat - line.from.lat) * f,
            line.from.lon + (line.to.lon - line.from.lon) * f,
            rot
          )
          if (!p.visible) { prevPt = null; continue }
          if (prevPt) {
            const progress = (Math.sin(t * 1.5 + f * Math.PI) + 1) / 2
            ctx.beginPath()
            ctx.moveTo(prevPt.x, prevPt.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(${palette.lineAnim},${(progress * 0.5 * p.z / R).toFixed(2)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
          prevPt = p
        }
      })

      cities.forEach(city => {
        const p = project(city.lat, city.lon, rot)
        if (!p.visible) return
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + city.lon)
        const alpha = 0.5 + 0.5 * (p.z / R)
        if (city.gold) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, city.r * (1 + 0.3 * pulse), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${palette.gomaGlow},${(alpha * 0.15 * pulse).toFixed(2)})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, city.r, 0, Math.PI * 2)
          ctx.fillStyle = palette.gomaCore
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, city.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${palette.cityMuted},${(alpha * 0.7).toFixed(2)})`
          ctx.fill()
        }
      })

      if (reduceMotion) return
      rot += 0.12
      t += 0.016
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isLight])

  return (
    <canvas
      ref={canvasRef}
      className="h-auto w-full max-w-none"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )
}
