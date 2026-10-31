"use client";

import Link from "next/link";
import { useRef } from "react";
import { projects } from "@/content/projects";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { ContourArt } from "../ContourArt";
import { CountUp } from "../fx/CountUp";

/** Pinned section: vertical scroll drives a horizontal strip of project cards (desktop). */
export function HorizontalWork() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set(bar.current, { scaleX: s.progress }),
          },
        });
        // Cards tilt in as they enter from the right.
        gsap.utils.toArray<HTMLElement>(".hw-card").forEach((card) => {
          gsap.fromTo(card, { rotate: 6, yPercent: 12 }, {
            rotate: 0,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "left 55%",
              scrub: true,
            },
          });
        });
        return () => ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-bg py-20 min-[900px]:flex min-[900px]:h-screen min-[900px]:flex-col min-[900px]:justify-center min-[900px]:py-0">
      <div className="mx-auto mb-10 flex w-full max-w-[1440px] items-end justify-between px-4 sm:px-8 min-[900px]:mb-8">
        <h2 className="font-display text-5xl font-bold uppercase leading-none tracking-tighter sm:text-7xl">
          Selected <span className="text-outline">work</span>
        </h2>
        <span className="font-mono text-xs uppercase tracking-widest text-fg-dim">
          ({String(projects.length).padStart(2, "0")}) scroll →
        </span>
      </div>

      <div ref={track} className="flex flex-col gap-6 px-4 sm:px-8 min-[900px]:w-max min-[900px]:flex-row min-[900px]:gap-8">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            data-cursor="View"
            data-cursor-color={p.color}
            className="hw-card group flex flex-col min-[900px]:w-[min(44vw,620px)]"
          >
            <ContourArt project={p} className="aspect-[4/3] rounded-2xl" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                  {String(i + 1).padStart(2, "0")} · {p.client}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {p.title}
                </h3>
              </div>
              <div className="shrink-0 text-right">
                <CountUp value={p.metrics[0].value} className="block font-display text-3xl font-bold" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-dim">{p.metrics[0].label}</span>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/projects"
          data-cursor="All"
          className="group flex aspect-[4/3] items-center justify-center rounded-2xl border border-line min-[900px]:w-[min(30vw,420px)]"
        >
          <span className="font-display text-5xl font-bold uppercase tracking-tighter transition-transform duration-500 group-hover:scale-110 group-hover:text-lime">
            All work ↗
          </span>
        </Link>
      </div>

      <div className="mx-auto mt-10 hidden w-full max-w-[1440px] px-8 min-[900px]:block">
        <div className="h-px w-full bg-line">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-lime" />
        </div>
      </div>
    </section>
  );
}
