"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Beholdt for API-kompatibilitet (ikke lenger i bruk). */
  intensity?: number;
  glare?: boolean;
};

/**
 * Rolig, profesjonelt hover-løft (ingen 3D-tilt/glare som overlapper naboer).
 * Beholder samme API som før så kall-stedene ikke trenger endring.
 */
export default function TiltCard({ children, className = "" }: Props) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
