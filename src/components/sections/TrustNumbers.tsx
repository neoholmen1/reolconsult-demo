"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
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

const ease = [0.16, 1, 0.3, 1] as const;

function StatCard({ stat, index, visible }: { stat: typeof stats[0]; index: number; visible: boolean }) {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className="rounded-2xl border border-border bg-bg-light px-4 py-6 text-center sm:px-6 sm:py-8 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1"
    >
      <p className="text-3xl font-bold sm:text-5xl lg:text-6xl">
        <span className={stat.highlight ? "text-accent" : "text-primary"}>
          {count}
        </span>
        <span className="text-accent">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-text-dark">
        {stat.label}
      </p>
      <p className="mt-1 text-sm text-text-muted">{stat.description}</p>
    </motion.div>
  );
}

export default function TrustNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
