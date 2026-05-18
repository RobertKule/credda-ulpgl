"use client";

import { m as motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface WordRevealProps {
  text: string;
  className?: string;
  /** Delay before the first word starts (seconds) */
  delay?: number;
  /** Duration per word (seconds) */
  duration?: number;
  /** Stagger between words (seconds) */
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WordReveal({
  text,
  className,
  delay = 0,
  duration = 0.65,
  stagger = 0.05,
  as: Tag = "h2",
}: WordRevealProps) {
  const shouldReduce = useReducedMotion();
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: shouldReduce ? 0 : stagger,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduce ? 0 : 18,
      filter: shouldReduce ? "blur(0px)" : "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: EASE,
      },
    },
  };

  return (
    <motion.span
      // cast to satisfy TS — motion.span renders as the Tag via `as`
      className={`inline ${className ?? ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block will-change-transform"
              variants={wordVariants}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.span>
  );
}
