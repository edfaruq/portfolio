"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Hold scrolling until the preloader announces it is done.
    const w = window as unknown as { __loaded?: boolean };
    const start = () => l.start();
    if (!w.__loaded) {
      l.stop();
      window.addEventListener("app:loaded", start, { once: true });
    }
    const id = requestAnimationFrame(() => setLenis(l));
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("app:loaded", start);
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Jump to top and refresh triggers on every route change. Render inside <Suspense>. */
export function RouteScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [pathname, lenis]);
  return null;
}
