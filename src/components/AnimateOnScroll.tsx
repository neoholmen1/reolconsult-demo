"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";

type Variant = "fadeUp" | "fadeIn" | "scaleIn";

/* Uten filter: blur(). Blur tvinger nettleseren til å raster-e elementet på
   nytt for hver frame, og med et innslag på nesten hver seksjon var det den
   største kilden til hakking under scroll. opacity og transform går på
   compositoren og koster i praksis ingenting. Bevegelsen er også kortet ned
   fra 40px til 24px — kortere vei leser som mer bestemt, ikke tregere. */
const variants: Record<Variant, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
};

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
}: Props) {
  const reduce = useReducedMotion();
  const v = variants[variant];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.62,
        delay,
        // Samme entré-kurve som --ease-entre i globals.css.
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
