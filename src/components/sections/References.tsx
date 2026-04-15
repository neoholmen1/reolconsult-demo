"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";

const clients = [
  "Nortura",
  "Floyd by Smith",
  "Foodora Market",
  "Nordisk Aviation Products",
  "Tilbords",
  "Rheinmetall Defence",
  "Cemo Gourmet",
  "TESS",
  "ASKO",
  "Diplomat",
  "Findus",
  "Solar",
];

const repeated = [...clients, ...clients, ...clients, ...clients];

export default function References() {
  return (
    <section className="bg-bg-light pt-6 pb-10 sm:pt-8 sm:pb-12">
      <AnimateOnScroll className="text-center mb-12" variant="fadeIn">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
          Stolte leverandører til
        </p>
      </AnimateOnScroll>

      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee">
          {repeated.map((client, i) => (
            <div
              key={i}
              className="mx-3 flex h-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white px-10"
            >
              <span className="text-sm font-semibold tracking-wide text-text-muted/60 whitespace-nowrap">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimateOnScroll delay={0.2}>
        <div className="mt-10 text-center">
          <a
            href="/referanser"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:gap-3"
          >
            Se alle referanser
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
