"use client";

import Link from "next/link";
import { useRef } from "react";
import { strata } from "@/content/profile";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

const tex = { work: "tex-dots", intern: "tex-hatch", organization: "tex-lines", education: "tex-pebble" } as const;
const fill = { work: "#ff5b1f", intern: "#ffc83a", organization: "#d4ff3a", education: "#7c9cff" } as const;

/** Experience as a drill core: a drill bit descends with scroll and each layer slams in. */
export function DrillCore() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".dc-bit",
        { top: "0%" },
        {
          top: "100%",
          ease: "none",
          scrollTrigger: { trigger: ".dc-list", start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>(".dc-row").forEach((row) => {
        const layer = row.querySelector(".dc-layer");
        const body = row.querySelector(".dc-body");
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 70%" } })
          .fromTo(layer, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.9, ease: "expo.out" })
          .fromTo(body, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, "<0.1");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto w-full max-w-[1440px] px-4 py-28 sm:px-8">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-tighter sm:text-8xl">
          Core
          <br />
          <span className="text-outline">sample</span>
        </h2>
        <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-widest text-fg-dim">
          Bore hole BH-01. Surface = today. Every layer is a chapter; drill down to read.
        </p>
      </div>

      <div className="dc-list relative">
        <div aria-hidden className="absolute bottom-0 left-[clamp(4.5rem,14vw,11rem)] top-0 z-10 w-px -translate-x-1/2 bg-line">
          <div className="dc-bit absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="22" height="30" viewBox="0 0 22 30" className="drop-shadow-[0_0_8px_#d4ff3a]">
              <path d="M2 0h18v10l-9 20L2 10z" fill="#d4ff3a" />
              <path d="M2 4h18M2 8h18" stroke="#0d0e0b" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
        <ol className="border-t border-line">
          {strata.map((s, i) => {
            const content = (
              <>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                  L{i + 1} · {s.period}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {s.org}
                </h3>
                <p className="mt-1 text-fg-dim">
                  {s.title}. {s.note}
                </p>
              </>
            );
            return (
              <li key={s.org + s.period} className="dc-row grid grid-cols-[clamp(4.5rem,14vw,11rem)_1fr] border-b border-line">
                <div
                  className={`dc-layer ${tex[s.kind]} min-h-32 border-r border-bg/40`}
                  style={{ backgroundColor: fill[s.kind] }}
                  aria-hidden
                />
                <div className="dc-body py-7 pl-6 sm:pl-10">
                  {s.href ? (
                    <Link href={s.href} className="group block" data-cursor="Read">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
