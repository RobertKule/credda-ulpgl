"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // 0.1 to 1.0 (multiplier)
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export default function ParallaxWrapper({ 
  children, 
  speed = 0.5, 
  direction = 'vertical',
  className = "" 
}: ParallaxWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate the range of movement
  const range = speed * 100;

  // Vertical parallax
  const yTranslate = useTransform(
    scrollYProgress, 
    [0, 1], 
    [range, -range]
  );
  
  const y = useSpring(yTranslate, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Horizontal parallax
  const xTranslate = useTransform(
    scrollYProgress, 
    [0, 1], 
    [range, -range]
  );

  const x = useSpring(xTranslate, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div 
      ref={containerRef} 
      style={{ 
        y: direction === 'vertical' ? y : 0, 
        x: direction === 'horizontal' ? x : 0 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
