"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  triggerOnce?: boolean;
  className?: string;
}

export default function GSAPReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8, // Slightly faster than the GSAP original for better feel
  triggerOnce = true,
  className = ""
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: shouldReduceMotion ? 0 : direction === "left" ? 40 : direction === "right" ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1] as const, // Expo-like ease
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, margin: "-10% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
