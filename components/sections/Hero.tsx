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
    <div className="relative size-28 sm:size-36" aria-label="Open to work">
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
        <p className="h-fade mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-dim">
          {profile.roleTrilingual.join("  /  ")}
        </p>

        <h1 className="h-title pointer-events-auto font-display font-bold uppercase leading-[0.82] tracking-[-0.045em]">
          <SplitText text="Muhammad" trigger="load" playful className="block text-[15vw] sm:text-[min(14.5vw,210px)]" />
          <span className="flex items-end gap-[2vw]">
            <SplitText text="Al Faruq" trigger="load" delay={0.12} playful className="block text-[15vw] text-lime sm:text-[min(14.5vw,210px)]" />
            <span className="h-fade mb-[2.2vw] hidden max-w-[16ch] font-sans text-sm normal-case leading-snug tracking-normal text-fg-dim lg:block">
              (a.k.a. Ed) Hover the letters. Press and hold on the terrain.
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <p className="h-fade max-w-md text-lg leading-snug text-fg sm:text-xl">
            Full-stack developer building <span className="text-lime">multilingual platforms</span>,{" "}
            <span className="text-accent">monitoring dashboards</span> and <span className="text-lime">maps</span> for
            mining, energy and disaster work.
          </p>
          <div className="h-fade pointer-events-auto flex items-center gap-6">
            <Magnetic>
              <Link
                href="/projects"
                data-cursor="Let's go"
                className="inline-flex h-14 items-center rounded-full bg-fg px-7 font-mono text-sm uppercase tracking-widest text-bg transition-colors hover:bg-lime"
              >
                See work →
              </Link>
            </Magnetic>
            <Badge />
          </div>
        </div>
      </div>
    </section>
  );
}
