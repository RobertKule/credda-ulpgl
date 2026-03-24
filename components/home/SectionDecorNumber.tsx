'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Grand chiffre décoratif en fond de section — apparition au scroll (fondu),
 * sans parallaxe ni liaison au scroll.
 */
export function SectionDecorNumber({
  value,
  className = '',
}: {
  value: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute z-0 select-none font-fraunces font-extrabold italic leading-none text-[#C9A84C] text-[clamp(5.5rem,18vw,24rem)] ${className}`}
      initial={{ opacity: reduceMotion ? 0.06 : 0 }}
      whileInView={{ opacity: 0.06 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.85,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {value}
    </motion.span>
  )
}
