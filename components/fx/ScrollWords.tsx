"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/**
 * Paragraph whose words light up one by one as you scroll through it.
 * Words wrapped in *asterisks* get the accent colour.
 */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = ref.current?.querySelectorAll(".sw");
      if (!words) return;
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => {
        const hl = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i} className={`sw ${hl ? "text-lime" : ""}`}>
            {clean}{" "}
          </span>
        );
      })}
    </p>
  );
}
