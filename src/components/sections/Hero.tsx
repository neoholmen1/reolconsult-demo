"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";

const images = [
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg", alt: "Pallreoler i lager" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg", alt: "Butikkdisk Vrengen Maritime" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg", alt: "Mesanin-løsning" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg", alt: "Dagligvare Foodora" },
  { src: "https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg", alt: "Nettinghyller" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export type HeroData = {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
};

export default function Hero({ heroData }: { heroData?: HeroData }) {
  const { settings } = useSite();
  const [current, setCurrent] = useState(0);
  const [kenBurnsKey, setKenBurnsKey] = useState(0);

  const eyebrow = heroData?.eyebrow || "Siden 1984";
  const title = heroData?.title || "Alt til ditt\nlager, butikk\nog kontor";
  const subtitle =
    heroData?.subtitle ||
    "Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert. Bredt sortiment, og 350 kvm utstilling i Tønsberg.";
  const primaryLabel = heroData?.primaryLabel || "Utforsk produkter";
  const secondaryLabel = heroData?.secondaryLabel || "Ring oss";

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
    setKenBurnsKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setKenBurnsKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

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
      if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev],
  );

  return (
    <section className="relative overflow-hidden bg-white -mt-[84px] pt-28 pb-8 sm:pt-56 sm:pb-12 md:-mt-[192px] lg:pt-60 lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-5 text-[2rem] font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-[4.25rem] whitespace-pre-line"
              style={{ lineHeight: 1.05 }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease }}
              className="mt-6 sm:mt-8 max-w-md text-base sm:text-lg leading-relaxed text-text-muted"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <button
                onClick={() => document.getElementById("kategorier")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(220,38,38,0.25)] active:translate-y-[1px]"
              >
                {primaryLabel}
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>
              <a
                href={formatPhoneLink(settings.phone)}
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-white active:translate-y-[1px]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                {secondaryLabel}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
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

          {/* Image carousel with crossfade + Ken Burns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="relative"
          >
            <div
              className="relative aspect-[16/10] sm:aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.1)] touch-pan-y select-none cursor-grab active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {images.map((img, i) => (
                <div
                  key={img.src}
                  className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover pointer-events-none ${
                      i === current ? "animate-ken-burns" : ""
                    }`}
                    style={{ animationDelay: "0s" }}
                    key={i === current ? `active-${kenBurnsKey}` : `inactive-${i}`}
                    priority={i === 0}
                    draggable={false}
                  />
                </div>
              ))}

              {/* Arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/30 active:translate-y-[1px]"
                aria-label="Forrige bilde"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-200 hover:bg-white/30 active:translate-y-[1px]"
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
                    onClick={() => { setCurrent(i); setKenBurnsKey((k) => k + 1); }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-6 bg-white" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Bilde ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-white shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold">350 kvm</p>
                <p className="text-sm text-white/60">utstilling på Vear</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
