"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Click anywhere (not on a control) to drop a "contour ripple":
 * wobbly topographic rings expanding from the click point.
 */
export function Ripples() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d")!;
    const colors = ["#d4ff3a", "#ff5b1f", "#f1ece0"];
    type R = { x: number; y: number; t: number; c: string; seed: number };
    let ripples: R[] = [];
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ripples = ripples.filter((r) => r.t < 1);
      for (const r of ripples) {
        r.t += 0.012;
        for (let k = 0; k < 5; k++) {
          const p = r.t - k * 0.06;
          if (p <= 0) continue;
          const rad = p * 220;
          ctx.beginPath();
          for (let i = 0; i <= 48; i++) {
            const a = (i / 48) * Math.PI * 2;
            const wob = 1 + 0.12 * Math.sin(3 * a + r.seed + k) + 0.06 * Math.sin(5 * a - r.seed);
            const x = r.x + Math.cos(a) * rad * wob;
            const y = r.y + Math.sin(a) * rad * wob * 0.85;
            if (i) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
          }
          ctx.strokeStyle = r.c;
          ctx.globalAlpha = Math.max(0, (1 - p) * 0.7);
          ctx.lineWidth = k === 0 ? 1.6 : 1;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = ripples.length ? requestAnimationFrame(draw) : 0;
    };

    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,input,textarea,[data-no-ripple]")) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: 0, c: colors[ripples.length % 3], seed: Math.random() * 6 });
      if (!raf) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("click", click);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", click);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />;
}
