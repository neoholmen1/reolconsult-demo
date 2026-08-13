"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const BG_IMAGE = "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg";

// Deterministiske støv-/lyspartikler (unngår hydrerings-mismatch).
const PARTICLES = [
  { x: 12, y: 22, s: 3, d: 14, delay: 0, c: "rgba(255,255,255,0.6)" },
  { x: 78, y: 16, s: 2, d: 18, delay: 2, c: "rgba(220,38,38,0.7)" },
  { x: 35, y: 70, s: 4, d: 22, delay: 1, c: "rgba(255,255,255,0.4)" },
  { x: 64, y: 48, s: 2, d: 16, delay: 3, c: "rgba(255,200,160,0.6)" },
  { x: 88, y: 64, s: 3, d: 20, delay: 0.5, c: "rgba(255,255,255,0.5)" },
  { x: 22, y: 52, s: 2, d: 24, delay: 4, c: "rgba(220,38,38,0.5)" },
  { x: 50, y: 30, s: 2.5, d: 17, delay: 2.5, c: "rgba(255,255,255,0.45)" },
  { x: 70, y: 82, s: 3, d: 19, delay: 1.5, c: "rgba(255,220,180,0.5)" },
  { x: 15, y: 84, s: 2, d: 21, delay: 3.5, c: "rgba(255,255,255,0.4)" },
  { x: 92, y: 34, s: 2.5, d: 23, delay: 0.8, c: "rgba(220,38,38,0.45)" },
  { x: 44, y: 90, s: 2, d: 15, delay: 2.2, c: "rgba(255,255,255,0.5)" },
  { x: 58, y: 12, s: 3, d: 26, delay: 1.2, c: "rgba(255,255,255,0.35)" },
];

/**
 * Levende, fotorealistisk bakteppe: ekte lagerfoto med sakte zoom,
 * muse-styrt 2.5D-parallax, drivende lys og støvpartikler. Fast bak hele siden.
 */
export default function LivingBackdrop() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 40, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      px.set(-nx * 22);
      py.set(-ny * 22);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#070708]">
      {/* Ekte foto med parallax + ken-burns */}
      <motion.div style={{ x: sx, y: sy }} className="absolute -inset-12">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className={`scale-110 object-cover ${reduce ? "" : "animate-ken-burns"}`}
        />
      </motion.div>

      {/* Dyp grade for kontrast + brand-glød */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070708]/92 via-[#070708]/55 to-[#070708]/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070708]/90 via-transparent to-[#070708]/55" />
      {/* Mykt topp-scrim for header-lesbarhet — toner jevnt ut, ingen kant */}
      <div className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-[#070708]/85 via-[#070708]/30 to-transparent" />
      <div className="animate-glow-drift absolute -bottom-1/4 left-[-10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_50%,rgba(0,0,0,0.6))]" />

      {/* Drivende lys/støv-partikler */}
      {!reduce &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: p.c, filter: "blur(0.5px)" }}
            animate={{ y: [0, -28, 0], x: [0, 12, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
}
