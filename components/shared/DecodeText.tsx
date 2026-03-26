'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  duration = 1.5, 
  once = true,
  className 
}: DecodeTextProps) {
  const [displayText, setDisplayText] = useState("");
  const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < Math.floor(iteration)) {
              return text[index];
            }
            if (char === " ") return " ";
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += text.length / (duration * 25); // Dynamics based on length and duration
    }, 40);

    return () => clearInterval(interval);
  }, [isVisible, text, duration]);

  return (
    <motion.span
      onViewportEnter={() => {
        setTimeout(() => setIsVisible(true), delay * 1000);
      }}
      viewport={{ once }}
      className={className}
    >
      {displayText || (isVisible ? "" : " ")}
    </motion.span>
  );
}
