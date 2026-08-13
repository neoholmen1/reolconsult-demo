"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Shot = {
  src: string;
  alt: string;
  box: string;
  depth: number;
  float: number;
  dur: number;
  delay: number;
  index: number;
};

const shots: Omit<Shot, "index">[] = [
  {
    src: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg",
    alt: "Pallreoler i nytt lager",
    box: "absolute left-[6%] top-[12%] w-[58%] aspect-[4/5] z-20 rotate-[-3deg]",
    depth: 26,
    float: 12,
    dur: 7,
    delay: 0,
  },
  {
    src: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg",
    alt: "Butikkdisk levert til Vrengen Maritime",
    box: "absolute right-[2%] top-[4%] w-[44%] aspect-[4/3] z-30 rotate-[4deg]",
    depth: 44,
    float: 16,
    dur: 6,
    delay: 0.4,
  },
  {
    src: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg",
    alt: "Mesaninløsning som dobler gulvarealet",
    box: "absolute right-[6%] bottom-[6%] w-[46%] aspect-[4/3] z-30 rotate-[-4deg]",
    depth: 36,
    float: 14,
    dur: 8,
    delay: 0.8,
  },
];

function Card({ shot, sx, sy, reduce }: { shot: Shot; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean }) {
  const x = useTransform(sx, (n) => n * shot.depth);
  const y = useTransform(sy, (n) => n * shot.depth);

  return (
    <motion.div
      className={shot.box}
      style={reduce ? undefined : { x, y }}
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 + shot.index * 0.12, ease }}
    >
      <motion.div
        className="h-full w-full overflow-hidden rounded-[1.4rem] border border-white/70 bg-white shadow-[var(--shadow-float)] ring-1 ring-black/5"
        animate={reduce ? {} : { y: [0, -shot.float, 0] }}
        transition={{ duration: shot.dur, delay: shot.delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={shot.src} alt={shot.alt} fill sizes="320px" className="object-cover" unoptimized />
      </motion.div>
    </motion.div>
  );
}

/** Ren, moderne bildegruppe (Apple-aktig): overlappende avrundede kort med myk dybde + subtil mus-parallax. */
export default function HeroGallery() {
  const reduce = useReducedMotion() ?? false;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 2);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 2);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >
      <div className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.10),transparent_70%)] blur-2xl" />
      {shots.map((s, i) => (
        <Card key={i} shot={{ ...s, index: i }} sx={sx} sy={sy} reduce={reduce} />
      ))}
    </div>
  );
}
