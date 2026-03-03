"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";

const clients = [
  "Foodora",
  "Byggmakker",
  "Jula",
  "Nille",
  "Elkjøp",
  "Coop",
  "Rema 1000",
  "Biltema",
];

// Repeat 4x so one set is always wider than the viewport
const repeated = [...clients, ...clients, ...clients, ...clients];

export default function References() {
  return (
    <section className="bg-[#faf8f6] py-28 sm:py-36">
      <AnimateOnScroll className="text-center mb-14">
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
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marquee 40s linear infinite",
          }}
        >
          {repeated.map((client, i) => (
            <div
              key={i}
              style={{ margin: "0 12px", flexShrink: 0 }}
              className="flex h-16 items-center justify-center rounded-xl border border-black/[0.04] bg-white px-10 shadow-sm"
            >
              <span className="text-base font-semibold tracking-wide text-text-dark/30 whitespace-nowrap">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>

      <AnimateOnScroll delay={0.2}>
        <div className="mt-12 text-center">
          <a
            href="/referanser"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 hover:gap-3"
          >
            Se alle referanser
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
