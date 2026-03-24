"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Only register on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  duration = 1.2,
  triggerOnce = true,
  className = ""
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const vars = {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    };

    const anim = gsap.fromTo(
      el,
      vars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: duration,
        delay: delay,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: triggerOnce ? "play none none none" : "play none none reverse",
          // markers: false, // For debugging animations
        }
      }
    );

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [direction, delay, duration, triggerOnce]);

  return (
    <div ref={elementRef} className={`will-change-transform opacity-0 ${className}`}>
      {children}
    </div>
  );
}
