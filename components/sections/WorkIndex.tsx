"use client";

import Link from "next/link";
import { type ReactNode, useRef, useState } from "react";
import { projects, sectors, type Sector } from "@/content/projects";
import { gsap, isFinePointer, useGSAP } from "@/lib/motion";

/**
 * Big-type project index. On desktop a preview card follows the pointer,
 * swapping artwork per row; rows fill with the project colour on hover.
 */
/** `arts`: a server-rendered ContourArt per project slug. */
export function WorkIndex({ arts }: { arts: Record<string, ReactNode> }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<Sector | "all">("all");
  const used = Array.from(new Set(projects.map((p) => p.sector)));
  const list = projects.filter((p) => filter === "all" || p.sector === filter);

  useGSAP(
    () => {
      if (!isFinePointer()) return;
      const el = preview.current!;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const rTo = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.to(preview.current, {
        scale: active === null ? 0 : 1,
        opacity: active === null ? 0 : 1,
        duration: 0.5,
        ease: "expo.out",
      });
    },
    { dependencies: [active] },
  );

  useGSAP(
    () => {
      gsap.fromTo(".wi-row", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "expo.out" });
    },
    { dependencies: [filter], scope: root, revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
        {(["all", ...used] as const).map((s) => {
          const on = filter === s;
          return (
            <button
              key={s}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                on ? "border-lime bg-lime text-bg" : "border-line text-fg-dim hover:border-fg hover:text-fg"
              }`}
            >
              {s === "all" ? "All" : `${sectors[s].symbol} ${sectors[s].label}`}
            </button>
          );
        })}
      </div>

      <ul className="border-t border-line" onPointerLeave={() => setActive(null)}>
        {list.map((p) => {
          const idx = projects.indexOf(p);
          return (
            <li key={p.slug} className="wi-row overflow-hidden border-b border-line">
              <Link
                href={`/projects/${p.slug}`}
                onPointerEnter={() => setActive(idx)}
                data-cursor="Open"
                data-cursor-color="#0d0e0b"
                className="group relative grid grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-1 py-6 sm:grid-cols-[4rem_1fr_auto] sm:py-9"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100"
                  style={{ background: p.color }}
                />
                <span className="relative font-mono text-xs text-fg-dim transition-colors group-hover:text-bg">{p.code}</span>
                <span className="relative font-display text-3xl font-bold uppercase leading-[0.95] tracking-tighter transition-all duration-500 group-hover:translate-x-4 group-hover:text-bg sm:text-6xl lg:text-7xl">
                  {p.title}
                </span>
                <span className="relative col-start-2 font-mono text-[11px] uppercase tracking-widest text-fg-dim transition-colors group-hover:text-bg sm:col-start-3 sm:text-right">
                  {p.client}
                  <br className="hidden sm:block" /> · {p.period}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Pointer-following preview (desktop only). */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] ml-6 mt-14 hidden h-[256px] w-[340px] scale-0 overflow-hidden rounded-xl opacity-0 shadow-2xl [@media(pointer:fine)]:block"
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className="absolute inset-0 transition-[clip-path] duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
            style={{ clipPath: active === i ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
          >
            {arts[p.slug]}
          </div>
        ))}
      </div>
    </div>
  );
}
