"use client";

import { useState, useEffect, useRef } from "react";

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return count;
}

const stats = [
  { value: 40, suffix: "+", label: "års erfaring", description: "Etablert i 1984", highlight: true },
  { value: 350, suffix: "", label: "kvm utstilling", description: "Besøk oss på Vear", highlight: false },
  { value: 1000, suffix: "+", label: "prosjekter", description: "Over hele Norge", highlight: false },
  { value: 100, suffix: "%", label: "norsk", description: "Lokal leverandør", highlight: false },
];

export default function TrustNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-28 sm:py-36">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => {
            const count = useCountUp(stat.value, 2000, visible);
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/[0.04] bg-[#faf8f6] px-4 py-6 text-center sm:px-6 sm:py-8"
              >
                <p className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                  <span className={stat.highlight ? "text-accent" : "text-primary"}>
                    {count}
                  </span>
                  <span className="text-accent">{stat.suffix}</span>
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-text-dark">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm text-text-muted">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
