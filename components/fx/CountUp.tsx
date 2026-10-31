"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/** Counts numeric part of a value ("1,700+", "5 min") up when scrolled into view. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);

  useGSAP(
    () => {
      if (!m || !ref.current || prefersReducedMotion()) return;
      const target = Number(m[2].replace(/,/g, ""));
      const obj = { v: 0 };
      const fmt = (n: number) => (m[2].includes(",") ? n.toLocaleString("en-US") : String(n));
      ref.current.textContent = m[1] + fmt(0) + m[3];
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = m[1] + fmt(Math.round(obj.v)) + m[3];
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
