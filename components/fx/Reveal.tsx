"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/** Slides direct children up in sequence when the group scrolls into view. */
export function Reveal({ children, className = "", y = 60 }: { children: ReactNode; className?: string; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(ref.current.children, { y, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Moves its child at a different speed to the page for depth. */
export function Parallax({ children, speed = 15, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current.firstElementChild,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
