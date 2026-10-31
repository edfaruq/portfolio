"use client";

import { useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "load" animates after the preloader; "view" when scrolled into view. */
  trigger?: "load" | "view";
  delay?: number;
  /** Letters jump when hovered. */
  playful?: boolean;
};

/**
 * Splits text into masked words → letters and slides them up.
 * Screen readers get the plain text via aria-label.
 */
export function SplitText({ text, as: Tag = "span", className = "", trigger = "view", delay = 0, playful }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chars = ref.current?.querySelectorAll<HTMLElement>(".char");
      if (!chars?.length || prefersReducedMotion()) return;
      gsap.set(chars, { yPercent: 115, y: 0, rotate: 8 });
      // Unmask once in place so playful letters can jump out of their line.
      const unmask = () =>
        ref.current?.querySelectorAll<HTMLElement>(".word-mask").forEach((m) => (m.style.overflow = "visible"));
      const play = () =>
        gsap.to(chars, {
          yPercent: 0,
          y: 0,
          rotate: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.025,
          delay,
          onComplete: unmask,
        });
      if (trigger === "load") {
        const w = window as unknown as { __loaded?: boolean };
        if (w.__loaded) play();
        else window.addEventListener("app:loaded", play, { once: true });
        return () => window.removeEventListener("app:loaded", play);
      }
      gsap.to(chars, {
        yPercent: 0,
        y: 0,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.02,
        delay,
        onComplete: unmask,
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref },
  );

  const bounce = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!playful || prefersReducedMotion()) return;
    const el = e.currentTarget;
    if (gsap.isTweening(el)) return;
    gsap.fromTo(
      el,
      { y: 0, rotate: 0 },
      {
        keyframes: [
          { y: -18 - Math.random() * 18, rotate: (Math.random() - 0.5) * 30, color: "var(--lime)", duration: 0.22, ease: "power2.out" },
          { y: 0, rotate: 0, color: "inherit", duration: 0.6, ease: "bounce.out" },
        ],
      },
    );
  };

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="word-mask">
          {Array.from(w).map((c, ci) => (
            <span key={ci} className="char" onPointerEnter={bounce}>
              {c}
            </span>
          ))}
          {wi < words.length - 1 && <span className="char">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
