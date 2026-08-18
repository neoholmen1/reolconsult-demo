"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useSite } from "@/components/SiteProvider";
import { formatPhoneLink } from "@/lib/site";
import Counter from "@/components/motion/Counter";
import MagneticButton from "@/components/motion/MagneticButton";
import WordReveal from "@/components/motion/WordReveal";
import HeroGallery from "@/components/HeroGallery";

const quickLinks = [
  { slug: "lager", label: "Lager", desc: "Pallreoler & mesanin", icon: "M3.75 21V8.25l8.25-5.25 8.25 5.25V21M3.75 21h16.5M3.75 21H2.25m18 0h1.5M9 21v-6h6v6M6.75 10.5h.008v.008H6.75V10.5Z" },
  { slug: "butikk", label: "Butikk", desc: "Disker & gondoler", icon: "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614M5.25 9.349V21h13.5V9.35" },
  { slug: "kontor", label: "Kontor", desc: "Møbler & oppbevaring", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" },
  { slug: "verksted", label: "Verksted", desc: "Arbeidsbord & skap", icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26" },
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

  const eyebrow = heroData?.eyebrow || "Siden 1984";
  const title = heroData?.title || "Alt til ditt\nlager, butikk\nog kontor";
  const subtitle =
    heroData?.subtitle ||
    "Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert. 350 kvm utstilling i Tønsberg.";
  const primaryLabel = heroData?.primaryLabel || "Utforsk produkter";
  const secondaryLabel = heroData?.secondaryLabel || "Ring oss";

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} className="relative -mt-20 flex min-h-[100svh] flex-col overflow-hidden md:-mt-[136px]">
      {/* LYS MODUS: ren, varm cream-bakgrunn med subtil glød (ingen foto-vask) */}
      <div className="absolute inset-0 z-0 overflow-hidden dark:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#faf7f1_0%,#f4efe7_50%,#ece2d3_100%)]" />
        <div className="absolute -top-40 right-[-12%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.10),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(28,25,23,0.05),transparent_70%)] blur-3xl" />
      </div>

      {/* MØRK MODUS: samme oppbygning som lys — rolig base med subtil glød.
          Tidligere lå det bare en scrim her, og det globale foto-bakteppet
          fylte hele hero-en mens bildegalleriet var skrudd av. Da ble de to
          modusene to helt ulike layouter. Nå bærer galleriet bildene i begge,
          og bakgrunnen er rolig i begge. */}
      <div className="absolute inset-0 z-0 hidden overflow-hidden dark:block">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#12151a_0%,#0c0e12_50%,#08090b_100%)]" />
        <div className="absolute -top-40 right-[-12%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.16),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.045),transparent_70%)] blur-3xl" />
      </div>

      {/* Innhold */}
      {/* pb på lg gir plass til den flytende kategoriraden under, som trekkes
          opp med -mt-24 og ellers legger seg oppå stat-chipsene. */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-[150px] pb-32 sm:px-6 sm:pb-40 lg:px-8 lg:pt-[150px] lg:pb-44">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-10">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-black/[0.04] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.24em] text-text-dark/80 backdrop-blur-md dark:border-white/15 dark:bg-white/5 dark:text-white/85 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(220,38,38,0.9)]" />
            {eyebrow}
          </motion.p>

          <WordReveal
            as="h1"
            text={title}
            delay={0.15}
            className="font-display mt-6 text-[3rem] font-semibold leading-[0.96] tracking-[-0.035em] text-text-dark sm:text-6xl lg:text-[4.5rem] dark:text-white dark:[text-shadow:0_2px_50px_rgba(0,0,0,0.6)]"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="mt-7 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg dark:text-white/75"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="mt-9 flex flex-wrap gap-4"
          >
            {/* Rød primær-knapp */}
            <MagneticButton strength={14}>
              <button
                onClick={() => document.getElementById("kategorier")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-accent px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(220,38,38,0.35)] transition duration-200 hover:bg-accent-hover hover:shadow-[0_18px_50px_rgba(220,38,38,0.5)] active:scale-[0.97] sm:text-base dark:bg-accent/90"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/35 to-transparent" />
                <span className="relative">{primaryLabel}</span>
                <svg className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </button>
            </MagneticButton>
            {/* Glass-knapp */}
            <MagneticButton strength={10}>
              <a
                href={formatPhoneLink(settings.phone)}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black/10 bg-black/[0.04] px-8 py-4 text-sm font-medium text-text-dark backdrop-blur-md transition duration-200 hover:bg-black/[0.08] active:scale-[0.97] sm:text-base dark:border-white/25 dark:bg-white/10 dark:text-white dark:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),0_10px_34px_rgba(0,0,0,0.4)] dark:hover:bg-white/20"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 hidden h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent dark:block" />
                <svg className="relative h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span className="relative">{secondaryLabel}</span>
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stat-chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {[
              { node: <Counter value={40} suffix="+" className="font-display text-2xl font-semibold text-text-dark dark:text-white" />, label: "års erfaring" },
              { node: <Counter value={350} className="font-display text-2xl font-semibold text-text-dark dark:text-white" />, label: "kvm utstilling" },
              { node: <span className="font-display text-2xl font-semibold text-text-dark dark:text-white">Hele Norge</span>, label: "leveranse" },
            ].map((s, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-3 backdrop-blur-md dark:border-white/15 dark:bg-white/8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 hidden h-1/2 bg-gradient-to-b from-white/15 to-transparent dark:block" />
                <div className="relative flex items-baseline gap-2">
                  {s.node}
                  <span className="text-xs text-text-muted dark:text-white/60">{s.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bildegruppe (lys modus). I mørk modus vises det globale bakteppet i stedet. */}
        {/* Galleriet vises i begge moduser — det er dette som gir hero-en
            samme oppbygning i lys og mørk. */}
        <div className="hidden lg:block">
          <HeroGallery />
        </div>
        </div>
      </div>

      {/* Scroll-indikator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-[10.5rem] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center lg:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted dark:text-white/55">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="mt-2 block h-6 w-px bg-gradient-to-b from-black/40 to-transparent dark:from-white/70"
        />
      </motion.div>

      {/* Flytende kategorirad — overlapper bunnen */}
      <div className="relative z-10 mx-auto -mt-24 w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          className="relative grid grid-cols-2 gap-2 overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/70 p-3 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:gap-3 sm:p-4 lg:grid-cols-4 dark:border-white/15 dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_70px_-20px_rgba(0,0,0,0.7)]"
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:block" />
          {quickLinks.map((q) => (
            <Link
              key={q.slug}
              href={`/produkter/${q.slug}`}
              className="group flex items-center gap-3 rounded-2xl px-4 py-4 transition duration-200 hover:bg-black/[0.04] active:scale-[0.98] sm:px-5 dark:hover:bg-white/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-accent/15 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white dark:border-white/15 dark:bg-accent/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={q.icon} />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-text-dark dark:text-white">{q.label}</span>
                <span className="block truncate text-xs text-text-muted dark:text-white/55">{q.desc}</span>
              </span>
              <svg className="ml-auto h-4 w-4 shrink-0 text-text-light transition duration-200 group-hover:translate-x-0.5 group-hover:text-accent dark:text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
