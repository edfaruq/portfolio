"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";

/**
 * Infinite marquee whose speed and skew react to scroll velocity;
 * scrolling up reverses direction.
 */
export function Marquee({
  children,
  speed = 60,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number; // px per second
  reverse?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;
      let x = 0;
      let dir = reverse ? 1 : -1;
      let boost = 0;
      const skewTo = gsap.quickTo(el, "skewX", { duration: 0.4, ease: "power3" });

      // Velocity comes from a page-wide trigger, visibility from an IntersectionObserver, so a
      // pinned section above (which shifts everything below it) can never leave this stuck.
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const v = self.getVelocity();
          boost = Math.min(Math.abs(v) / 200, 12);
          dir = (v < 0 ? 1 : -1) * (reverse ? -1 : 1);
          skewTo(gsap.utils.clamp(-12, 12, v / -300));
        },
      });

      // Measure once (and on resize), never inside the frame loop.
      let half = el.scrollWidth / 2;
      const ro = new ResizeObserver(() => (half = el.scrollWidth / 2));
      ro.observe(el);
      let visible = false;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(root.current!);
      const setX = gsap.quickSetter(el, "x", "px");

      const tick = (_t: number, dt: number) => {
        if (!visible || !half) return; // offscreen: do nothing
        x += dir * (speed / 1000) * dt * (1 + boost);
        boost *= 0.92;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        setX(x);
        if (boost < 0.05) skewTo(0);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        io.disconnect();
        st.kill();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
