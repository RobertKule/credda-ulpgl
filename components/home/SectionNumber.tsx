'use client'
import { useRef, useState, useEffect } from 'react'

export function SectionNumber({ number }: { number: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      setOffset((rect.top + rect.height / 2 - window.innerHeight / 2) * 0.08)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <div ref={ref} style={{
      fontFamily: 'var(--font-fraunces)',
      fontSize: 'clamp(80px, 12vw, 140px)',
      fontWeight: 700,
      fontStyle: 'italic',
      lineHeight: 1,
      color: '#C9A84C',
      opacity: visible ? 0.07 : 0,
      transform: `translateY(${visible ? offset : 24}px)`,
      transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
      userSelect: 'none',
      pointerEvents: 'none',
      flexShrink: 0,
      marginTop: '-16px',
    }}>
      {number}
    </div>
  )
}
