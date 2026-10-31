"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

const steps = ["Calibrating terrain", "Plotting sites", "Drilling core", "Ready"];

function announceLoaded() {
  (window as unknown as { __loaded?: boolean }).__loaded = true;
  window.dispatchEvent(new Event("app:loaded"));
}

/** Counter 0→100 with survey-style status, then a split curtain lifts. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      let seen = false;
      try { seen = sessionStorage.getItem("seen-intro") === "1"; } catch {}

      if (prefersReducedMotion()) {
        setDone(true);
        announceLoaded();
        return;
      }
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          try { sessionStorage.setItem("seen-intro", "1"); } catch {}
          setDone(true);
        },
      });
      // Safety net: never trap the visitor behind the intro.
      const bail = window.setTimeout(() => tl.progress(1), seen ? 3000 : 6000);
      tl.to(counter, {
        v: 100,
        duration: seen ? 0.5 : 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          const i = Math.min(steps.length - 1, Math.floor((counter.v / 100) * steps.length));
          if (status.current) status.current.textContent = `${steps[i]}…`;
        },
      })
        .to(".pl-meta", { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
        .add(announceLoaded)
        .to(".pl-panel", {
          yPercent: (i: number) => (i % 2 ? 100 : -100),
          duration: 1,
          ease: "expo.inOut",
          stagger: 0.06,
        }, "<");
      return () => window.clearTimeout(bail);
    },
    { scope: root },
  );

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[90] flex" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="pl-panel h-full flex-1 bg-lime" />
      ))}
      <div className="pl-meta absolute inset-0 flex flex-col justify-between p-5 text-bg sm:p-8">
        <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
          <span>Ed Faruq ©2026</span>
          <span ref={status}>{steps[0]}…</span>
        </div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-widest">Portfolio / Field log</span>
          <span ref={num} className="font-display text-[26vw] font-bold leading-[0.8] tracking-tighter sm:text-[18vw]">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
