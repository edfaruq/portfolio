"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/projects";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/** Resting tilt per photo, so the pile looks hand-dropped but stays deterministic. */
const TILT = [-5, 4, -2.5, 6, -4, 3];
const tilt = (i: number) => TILT[i % TILT.length];

/**
 * A pile of taped polaroids. Drag or flick the top photo sideways to toss it to the back
 * of the pile, click it for the next one, or use the arrow buttons.
 */
export function PhotoStack({ photos, accent = "#d4ff3a" }: { photos: Photo[]; accent?: string }) {
  const n = photos.length;
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const busy = useRef(false);
  const first = useRef(true);
  const drag = useRef<{ x0: number; y0: number; dx: number; t: number; v: number; moved: boolean } | null>(null);

  // Lay the pile out whenever its order changes.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    order.forEach((idx, depth) => {
      const el = cards.current[idx];
      if (!el) return;
      gsap.set(el, { zIndex: n - depth, xPercent: -50, yPercent: -50 });
      const to = { x: depth * 14, y: depth * 10, rotate: tilt(idx), scale: 1 - depth * 0.05 };
      if (first.current || reduced) gsap.set(el, to);
      else gsap.to(el, { ...to, duration: 0.8, ease: "expo.out", overwrite: "auto" });
    });
    first.current = false;
  }, [order, n]);

  const toss = (dir: 1 | -1) => {
    if (busy.current || n < 2) return;
    const top = cards.current[order[0]];
    if (!top) return;
    busy.current = true;
    const done = () => {
      gsap.set(top, { zIndex: 0 });
      setOrder((o) => [...o.slice(1), o[0]]);
      busy.current = false;
    };
    if (prefersReducedMotion()) return done();
    gsap.to(top, {
      x: dir * top.offsetWidth * 1.25,
      y: -30,
      rotate: tilt(order[0]) + dir * 24,
      duration: 0.42,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: done,
    });
  };

  const back = () => {
    if (busy.current || n < 2) return;
    const last = order[n - 1];
    const el = cards.current[last];
    // Bring the bottom photo in from the left, on top of the pile.
    if (el && !prefersReducedMotion()) gsap.set(el, { x: -el.offsetWidth * 1.25, y: -30, rotate: tilt(last) - 24, zIndex: n + 1 });
    setOrder((o) => [o[n - 1], ...o.slice(0, n - 1)]);
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    if (idx !== order[0] || busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, y0: e.clientY, dx: 0, t: e.timeStamp, v: 0, moved: false };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>, idx: number) => {
    const d = drag.current;
    if (!d || idx !== order[0]) return;
    const dx = e.clientX - d.x0;
    const now = e.timeStamp;
    d.v = (dx - d.dx) / Math.max(now - d.t, 1);
    d.t = now;
    d.dx = dx;
    if (Math.abs(dx) > 5) d.moved = true;
    gsap.set(e.currentTarget, { x: dx, y: Math.abs(dx) * -0.06, rotate: tilt(idx) + dx * 0.06, scale: 1.03 });
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>, idx: number, cancelled = false) => {
    const d = drag.current;
    drag.current = null;
    if (!d || idx !== order[0]) return;
    const el = e.currentTarget;
    const flick = Math.abs(d.v) > 0.6;
    if (!cancelled && !d.moved) return toss(1);
    if (!cancelled && (Math.abs(d.dx) > el.offsetWidth * 0.3 || flick)) return toss((flick ? d.v : d.dx) > 0 ? 1 : -1);
    gsap.to(el, { x: 0, y: 0, rotate: tilt(idx), scale: 1, duration: 0.7, ease: "elastic.out(1, 0.55)" });
  };

  const top = photos[order[0]];

  return (
    <div>
      <div className="relative w-full" style={{ height: "calc(min(70vw, 320px) * 1.25 + 9rem)" }}>
        {photos.map((p, idx) => {
          const isTop = idx === order[0];
          return (
            <div
              key={p.src}
              ref={(el) => {
                cards.current[idx] = el;
              }}
              data-cursor={isTop ? "Drag" : undefined}
              aria-hidden={!isTop}
              onPointerDown={(e) => onDown(e, idx)}
              onPointerMove={(e) => onMove(e, idx)}
              onPointerUp={(e) => onUp(e, idx)}
              onPointerCancel={(e) => onUp(e, idx, true)}
              className="absolute left-1/2 top-1/2 w-[min(70vw,320px)] touch-pan-y select-none will-change-transform"
            >
              {/* Tape */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 opacity-80 mix-blend-multiply"
                style={{ background: accent }}
              />
              <figure className="rounded-md bg-fg p-3 pb-0 text-bg shadow-[0_28px_50px_-22px_rgba(0,0,0,.85)]">
                <div className="relative overflow-hidden rounded-sm bg-bg" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 70vw, 320px"
                    draggable={false}
                    className="pointer-events-none object-cover"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 py-3 font-mono text-[11px] uppercase tracking-widest">
                  <span className="truncate">{p.caption}</span>
                  <span className="shrink-0 opacity-50">{String(idx + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={back}
          aria-label="Previous photo"
          className="grid size-11 place-items-center rounded-full border border-line font-mono text-lg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
        >
          ←
        </button>
        <p className="min-w-[9ch] text-center font-mono text-xs uppercase tracking-widest text-fg-dim" aria-live="polite">
          <span className="text-fg">{String(order[0] + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
          <span className="sr-only">: {top.caption}</span>
        </p>
        <button
          type="button"
          onClick={() => toss(1)}
          aria-label="Next photo"
          className="grid size-11 place-items-center rounded-full border border-line font-mono text-lg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
        >
          →
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">Drag, flick or click the photo</p>
    </div>
  );
}
