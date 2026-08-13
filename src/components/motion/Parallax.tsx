"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Hvor mange px innholdet forskyves gjennom viewport-passasjen. */
  distance?: number;
};

/**
 * Scroll-parallax-wrapper. Forskyver innholdet mykt mens seksjonen passerer.
 * Gi en overflow-hidden-forelder hvis innholdet er et oversized bilde.
 */
export default function Parallax({ children, className = "", distance = 70 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
