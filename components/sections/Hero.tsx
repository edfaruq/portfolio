"use client";

import Link from "next/link";
import { useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";
import { Magnetic } from "../fx/Magnetic";
import { SplitText } from "../fx/SplitText";
import { Terrain } from "../fx/Terrain";

function Badge() {
  const text = "OPEN TO WORK ✺ FULL-STACK DEV ✺ ";
  return (
    <div className="relative size-[8.4rem] shrink-0 sm:size-[10.8rem]" aria-label="Open to work">
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0" aria-hidden>
        <defs>
          <path id="badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text fontSize="9.4" letterSpacing="1.4" fill="currentColor" fontFamily="var(--font-plex-mono)">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-3xl text-accent">↓</span>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const intro = () =>
        gsap.fromTo(".h-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.5 });
      const w = window as unknown as { __loaded?: boolean };
      if (w.__loaded) intro();
      else window.addEventListener("app:loaded", intro, { once: true });

      // Parallax-out the headline as the hero scrolls away.
      gsap.to(".h-title", {
        yPercent: -35,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => window.removeEventListener("app:loaded", intro);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden" data-cursor-crosshair>
      <Terrain className="absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-4 pb-8 pt-28 sm:px-8 sm:pb-12">
        <div className="h-fade mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-fg/80 sm:text-[13px]">
            {profile.roleTrilingual.join("  /  ")}
          </p>
          <p className="rounded-xl bg-bg/70 px-3 py-1.5 sm:rounded-full font-mono text-[11px] uppercase tracking-widest text-fg/90 ring-1 ring-line backdrop-blur-sm">
            Hover the letters. Press and hold on the terrain.
          </p>
        </div>

        <h1
          aria-label="Hi, I'm Faruq."
          className="h-title pointer-events-auto font-display font-bold uppercase leading-[0.82] tracking-[-0.045em]"
        >
          <SplitText text="Hi, I'm" trigger="load" playful className="block text-[min(22vw,20svh)] sm:text-[min(13vw,20svh,190px)]" />
          <SplitText text="Faruq." trigger="load" delay={0.12} playful className="block text-[min(22vw,20svh)] text-lime sm:text-[min(13vw,20svh,190px)]" />
        </h1>

        <div className="mt-6 grid gap-8 sm:mt-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="h-fade max-w-[30ch] text-[1.65rem] font-medium leading-[1.15] tracking-tight text-fg sm:text-[2.1rem] lg:text-[2.5rem]">
              Full-stack developer building <span className="text-lime">multilingual platforms</span>,{" "}
              <span className="text-accent">monitoring dashboards</span> and <span className="text-lime">maps</span> for
              mining, energy and disaster work.
            </p>
            <div className="h-fade pointer-events-auto mt-7 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/projects"
                  data-cursor="Let's go"
                  className="inline-flex h-14 items-center rounded-full bg-fg px-7 font-mono text-sm uppercase tracking-widest text-bg transition-colors hover:bg-lime"
                >
                  See work →
                </Link>
              </Magnetic>
              <span className="inline-flex h-10 items-center gap-2.5 rounded-full bg-bg/70 px-4 font-mono text-xs uppercase tracking-widest text-fg ring-1 ring-line backdrop-blur-sm">
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex size-full rounded-full bg-lime opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-lime" />
                </span>
                Open to work · Jakarta
              </span>
            </div>
          </div>
          <div className="h-fade justify-self-end">
            <Badge />
          </div>
        </div>
      </div>
    </section>
  );
}
