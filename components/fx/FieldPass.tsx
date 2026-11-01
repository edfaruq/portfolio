"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Rope length from the anchor (above the card) to the card's clip, in px. */
const ROPE = 190;
const STRAP_TEXT = "FIELD PASS ✦ EDFARUQ ✦ BH-01 ✦ ".repeat(4);

/**
 * A lanyard ID card hanging from the top of the page. Grab it and fling it around:
 * the strap bends, the card swings with the motion and springs back when released.
 */
export function FieldPass({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const strap = useRef<SVGPathElement>(null);
  const strapText = useRef<SVGPathElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const c = card.current;
    if (!w || !c || !strap.current || !strapText.current) return;
    const reduced = prefersReducedMotion();

    const pos = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    const grab = { x: 0, y: 0 };
    let rot = 0;
    let dragging = false;
    let t = 0;

    /** Pointer position relative to the card's resting clip point. */
    const local = (e: PointerEvent) => {
      const r = w.getBoundingClientRect();
      return { x: e.clientX - (r.left + r.width / 2), y: e.clientY - r.top };
    };

    const down = (e: PointerEvent) => {
      dragging = true;
      c.setPointerCapture(e.pointerId);
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      grab.x = p.x - pos.x;
      grab.y = p.y - pos.y;
      c.dataset.cursor = "Wheee!";
      c.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (c.hasPointerCapture(e.pointerId)) c.releasePointerCapture(e.pointerId);
      c.dataset.cursor = "Drag me";
      c.classList.remove("is-dragging");
    };

    const tick = (_time: number, dt: number) => {
      const f = Math.min(dt / 16.67, 3); // frame-rate independent
      t += dt / 1000;
      if (dragging) {
        const nx = pointer.x - grab.x;
        const ny = pointer.y - grab.y;
        vel.x = (nx - pos.x) / f;
        vel.y = (ny - pos.y) / f;
        pos.x = nx;
        pos.y = ny;
      } else {
        // Damped spring back to rest, plus a lazy idle sway.
        const sway = reduced ? 0 : Math.sin(t * 1.3) * 6;
        vel.x = (vel.x + (sway - pos.x) * 0.07 * f) * Math.pow(0.86, f);
        vel.y = (vel.y + (0 - pos.y) * 0.07 * f) * Math.pow(0.86, f);
        pos.x += vel.x * f;
        pos.y += vel.y * f;
      }

      // Hang along the strap, and lag behind fast motion like a real card.
      const hang = (Math.atan2(pos.x, pos.y + ROPE) * 180) / Math.PI;
      const target = gsap.utils.clamp(-50, 50, -hang * 0.6 - vel.x * 1.4);
      rot += (target - rot) * 0.18 * f;
      c.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${rot}deg)`;

      // Strap: slack curve when shorter than the rope, straight when pulled taut.
      const cx = w.clientWidth / 2;
      const ax = cx;
      const ay = -ROPE;
      const bx = cx + pos.x;
      const by = pos.y;
      const d = Math.hypot(bx - ax, by - ay);
      const slack = Math.max(0, ROPE - d);
      const mx = (ax + bx) / 2 - vel.x * 2;
      const my = (ay + by) / 2 + slack * 0.7;
      const path = `M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`;
      strap.current!.setAttribute("d", path);
      strapText.current!.setAttribute("d", path);
    };

    gsap.ticker.add(tick);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    return () => {
      gsap.ticker.remove(tick);
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={wrap} className={`relative ${className}`} style={{ marginTop: ROPE }}>
      {/* The strap reaches up past the top of the box, towards the header. */}
      <svg aria-hidden className="pointer-events-none absolute left-0 w-full overflow-visible" style={{ top: 0, height: 1 }}>
        <path ref={strap} fill="none" stroke="var(--lime)" strokeWidth="18" strokeLinecap="round" />
        <path ref={strapText} id="field-pass-strap" fill="none" />
        <text fontSize="9" letterSpacing="2" fill="var(--bg)" fontFamily="var(--font-plex-mono)" dominantBaseline="middle">
          <textPath href="#field-pass-strap">{STRAP_TEXT}</textPath>
        </text>
      </svg>

      <div
        ref={card}
        data-cursor="Drag me"
        className="field-pass group relative z-20 mx-auto w-[min(78vw,300px)] origin-top touch-none select-none will-change-transform"
        role="img"
        aria-label={`ID card: photo of ${profile.name}, ${profile.role}`}
      >
        {/* Metal clip */}
        <div aria-hidden className="absolute -top-3 left-1/2 z-10 h-7 w-10 -translate-x-1/2 rounded-md border-2 border-fg-dim bg-bg-2 shadow-md">
          <div className="mx-auto mt-1.5 h-1.5 w-5 rounded-full bg-bg" />
        </div>

        <div className="rounded-[22px] bg-fg p-3 pb-4 text-bg shadow-[0_30px_60px_-20px_rgba(0,0,0,.8)] ring-1 ring-black/10">
          <div className="flex items-center justify-between px-1 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>Field pass</span>
            <span className="rounded-full bg-accent px-2 py-0.5 text-fg">BH-01</span>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg">
            <Image
              src="/images/about-edfaruq-card.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 78vw, 300px"
              draggable={false}
              className="pointer-events-none object-cover grayscale contrast-[1.08] transition-[filter,scale] duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 group-[.is-dragging]:scale-[1.04] group-[.is-dragging]:grayscale-0"
            />
            {/* Survey crosshair over the photo */}
            <svg aria-hidden viewBox="0 0 100 125" className="pointer-events-none absolute inset-0 size-full text-lime opacity-80 mix-blend-screen">
              <g fill="none" stroke="currentColor" strokeWidth="0.6">
                <path d="M6 6h8M6 6v8M94 6h-8M94 6v8M6 119h8M6 119v-8M94 119h-8M94 119v-8" />
              </g>
            </svg>
            <span className="absolute bottom-2 left-2 rounded-full bg-bg/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-lime backdrop-blur-sm">
              {profile.coords}
            </span>
          </div>

          <div className="px-1 pt-3">
            <p className="font-display text-[1.35rem] font-bold leading-[1.05] tracking-tight">{profile.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">{profile.role}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              {/* Decorative barcode */}
              <svg aria-hidden viewBox="0 0 120 26" className="h-7 w-32">
                {[2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 4, 1, 2, 2, 1, 3, 1, 1, 2].reduce<{ x: number; els: React.ReactNode[] }>(
                  (acc, wdt, i) => {
                    if (i % 2 === 0) acc.els.push(<rect key={i} x={acc.x} y="0" width={wdt * 1.4} height="26" fill="currentColor" />);
                    acc.x += wdt * 1.4 + 0.6;
                    return acc;
                  },
                  { x: 0, els: [] },
                ).els}
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">Valid · 2026 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
