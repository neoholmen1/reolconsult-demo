"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";

const images = [
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg", alt: "Pallreoler i lager" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg", alt: "Butikkdisk Vrengen Maritime" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg", alt: "Mesanin-løsning" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg", alt: "Dagligvare Foodora" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg", alt: "Nettinghyller" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  // Swipe / drag support
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = e.clientX - pointerStart.current.x;
      const dy = Math.abs(e.clientY - pointerStart.current.y);
      pointerStart.current = null;
      // Only swipe if horizontal movement > 50px and more horizontal than vertical
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  return (
    <section className="relative overflow-hidden bg-white -mt-[180px] pt-48 pb-20 sm:pt-56 sm:pb-28 lg:pt-60 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
            >
              Siden 1984
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ lineHeight: 1 }}
            >
              Alt til ditt
              <br />
              lager, butikk
              <br />
              og kontor
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 max-w-md text-lg leading-relaxed text-text-muted"
            >
              Vi leverer innredningsløsninger til bedrifter over hele Norge.
              Besøk vår 350 kvm store utstilling på Vear i Tønsberg.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10"
            >
              <button
                onClick={() => document.getElementById("kategorier")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full border border-accent/30 px-8 py-4 text-base font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-[0_8px_30px_rgba(212,32,39,0.25)] hover:gap-3"
              >
                Utforsk våre løsninger
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-text-muted"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                40+ års erfaring
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                350 kvm utstilling
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Hele Norge
              </span>
            </motion.div>
          </div>

          {/* Image carousel right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div
              className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] touch-pan-y select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {images.map((img, i) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 pointer-events-none"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}

              {/* Prev / Next arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                aria-label="Forrige bilde"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                aria-label="Neste bilde"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                    aria-label={`Bilde ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating accent element — hidden on mobile to prevent overflow */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 rounded-2xl bg-primary px-6 py-4 text-white shadow-lg">
              <p className="text-2xl font-bold">350 kvm</p>
              <p className="text-sm text-white/70">utstilling på Vear</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
