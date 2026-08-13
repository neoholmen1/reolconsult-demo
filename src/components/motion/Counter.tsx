"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/**
 * Teller som animerer fra 0 → value når den ruller inn i view.
 * Bruker @number-flow/react (per prosjektets lib-standard).
 */
export default function Counter({ value, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (inView && !reduce) setN(value);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <NumberFlow
        value={n}
        transformTiming={{ duration: 1100, easing: "cubic-bezier(0.16,1,0.3,1)" }}
        willChange
      />
      {suffix}
    </span>
  );
}
