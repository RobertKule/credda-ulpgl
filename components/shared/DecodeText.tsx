'use client'
import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue, animate } from "framer-motion";

interface DecodeTextProps {
  text: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export default function DecodeText({ 
  text, 
  delay = 0, 
  duration = 1, 
  once = true,
  className 
}: DecodeTextProps) {
  const [displayText, setDisplayText] = useState("");
  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  const [isVisible, setIsVisible] = useState(false);
  
  // Optimization: use a ref for the current iteration to keep logic tight
  const iterationRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const totalChars = text.length;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      // Calculate how many characters to reveal (0 to totalChars)
      const revealCount = Math.floor(progress * totalChars);
      
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < revealCount) {
              return text[index];
            }
            if (char === " ") return " ";
            // Only scramble the next few characters for a "glitch" effect
            if (index < revealCount + 3) {
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
            return " "; // Keep future chars hidden or space
          })
          .join("")
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text); // Final catch-all to ensure correct text
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible, text, duration]);

  return (
    <motion.span
      onViewportEnter={() => {
        if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000);
        } else {
            setIsVisible(true);
        }
      }}
      viewport={{ once }}
      className={className}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText || (isVisible ? "" : " ")}
      </span>
    </motion.span>
  );
}
