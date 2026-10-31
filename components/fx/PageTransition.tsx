"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/**
 * On every client-side route change, a lime curtain sweeps off the new page
 * and a label shows where you landed. Render inside <Suspense>.
 */
export function PageTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap
        .timeline()
        .set(root.current, { display: "flex" })
        .fromTo(".pt-curtain", { yPercent: 0 }, { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.15 })
        .fromTo(".pt-label", { yPercent: 0, opacity: 1 }, { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in" }, 0)
        .set(root.current, { display: "none" });
    },
    { dependencies: [pathname], scope: root },
  );

  const label = pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ");

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[85] hidden items-center justify-center">
      <div className="pt-curtain absolute inset-0 bg-lime" />
      <span className="pt-label relative font-display text-5xl font-bold capitalize tracking-tight text-bg sm:text-7xl">
        {label}
      </span>
    </div>
  );
}
