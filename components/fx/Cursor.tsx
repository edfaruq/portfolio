"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/motion";

/** Pick dark or light text for a hex background. */
function inkFor(hex: string | null) {
  if (!hex || !hex.startsWith("#") || hex.length < 7) return "var(--bg)";
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "var(--bg)" : "var(--fg)";
}

const TRAIL = 14;

/**
 * Decorative cursor layer. The real pointer is an OS-drawn custom cursor (see globals.css),
 * so clicks stay exact; everything here trails behind it:
 *  - a jelly blob that stretches with speed and swells over links (mix-blend: difference)
 *  - a lime particle tail
 *  - a label pill (data-cursor="…") offset below-right
 */
export function Cursor() {
  const blob = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isFinePointer()) return;
    const raf = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!enabled || !blob.current || !pill.current || !canvas.current) return;
    const reduced = prefersReducedMotion();
    const b = blob.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      cv.width = innerWidth * dpr;
      cv.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pillX = gsap.quickTo(pill.current, "x", { duration: 0.3, ease: "power3" });
    const pillY = gsap.quickTo(pill.current, "y", { duration: 0.3, ease: "power3" });

    const mouse = { x: innerWidth / 2, y: innerHeight / 2, seen: false };
    const pos = { x: mouse.x, y: mouse.y };
    const trail = Array.from({ length: TRAIL }, () => ({ x: mouse.x, y: mouse.y }));
    let hover = false;
    let down = false;
    let size = 26;
    let painted = false;

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.seen) {
        mouse.seen = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        trail.forEach((t) => { t.x = mouse.x; t.y = mouse.y; });
        gsap.to(b, { opacity: 1, duration: 0.3 });
      }
      pillX(e.clientX + 20);
      pillY(e.clientY + 24);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setColor(labelled?.dataset.cursorColor ?? null);
      hover = !!target?.closest("a,button,[role=button],[data-cursor]");
    };

    const press = () => (down = true);
    const up = () => (down = false);
    const leave = () => {
      mouse.seen = false;
      gsap.to(b, { opacity: 0, duration: 0.3 });
      setLabel(null);
    };

    const tick = () => {
      // Blob: springy follow + velocity stretch.
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      pos.x += dx * 0.18;
      pos.y += dy * 0.18;
      const speed = Math.min(Math.hypot(dx, dy), 140);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const targetSize = down ? 18 : hover ? 64 : 26;
      size += (targetSize - size) * 0.2;
      const stretch = reduced ? 1 : 1 + speed / 160;
      gsap.set(b, {
        x: pos.x,
        y: pos.y,
        width: size,
        height: size,
        xPercent: -50,
        yPercent: -50,
        rotate: angle,
        scaleX: stretch,
        scaleY: 1 / Math.sqrt(stretch),
      });

      // Canvas: tail. Skip the full-screen redraw entirely while nothing moves.
      const tail = !reduced && mouse.seen;
      if (tail) {
        trail[0].x += (mouse.x - trail[0].x) * 0.5;
        trail[0].y += (mouse.y - trail[0].y) * 0.5;
        for (let i = 1; i < TRAIL; i++) {
          trail[i].x += (trail[i - 1].x - trail[i].x) * 0.45;
          trail[i].y += (trail[i - 1].y - trail[i].y) * 0.45;
        }
      }
      const end = trail[TRAIL - 1];
      const moving = tail && Math.abs(end.x - mouse.x) + Math.abs(end.y - mouse.y) > 0.5;
      if (!moving) {
        if (painted) ctx.clearRect(0, 0, innerWidth, innerHeight);
        painted = false;
        return;
      }
      painted = true;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (tail) {
        // Skip the first points so the tail starts behind the pointer, not on it.
        for (let i = 3; i < TRAIL; i++) {
          const t = 1 - i / TRAIL;
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, 4.5 * t + 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,255,58,${0.55 * t})`;
          ctx.fill();
        }
      }
    };

    gsap.ticker.add(tick);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", up);
    window.addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[98] h-full w-full" />
      <div
        ref={blob}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full bg-lime opacity-0 mix-blend-difference"
      />
      <div
        ref={pill}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-widest shadow-lg ring-1 ring-black/20 transition-[opacity,scale] duration-200 ease-out"
        style={{
          background: color ?? "var(--lime)",
          color: inkFor(color),
          opacity: label ? 1 : 0,
          scale: label ? 1 : 0.6,
        }}
      >
        {label}
      </div>
    </>
  );
}
