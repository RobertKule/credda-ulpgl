"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const yValue = direction === 'vertical' ? (speed * 100) : 0;
    const xValue = direction === 'horizontal' ? (speed * 100) : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(element, 
        { 
          y: yValue,
          x: xValue 
        }, 
        {
          y: -yValue,
          x: -xValue,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div ref={elementRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
