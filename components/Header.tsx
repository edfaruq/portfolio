"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/motion";
import { Magnetic } from "./fx/Magnetic";
import { Roll } from "./ui";

const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t || "--:--:--"} WIB</span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { display: "flex" })
        .fromTo(menu.current, { clipPath: "circle(0% at 95% 4%)" }, { clipPath: "circle(150% at 95% 4%)", duration: 0.9, ease: "expo.inOut" })
        .fromTo(".m-link", { yPercent: 120, rotate: 6 }, { yPercent: 0, rotate: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.45");
    },
    { scope: menu },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] mix-blend-difference">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 text-fg sm:h-20 sm:px-8">
          <Magnetic>
            <Link href="/" className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight" data-cursor="Home">
              <span className="inline-block transition-transform duration-500 group-hover:rotate-[360deg]">✺</span>
              <Roll>edfaruq</Roll>
            </Link>
          </Magnetic>
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.18em] md:block">
            <Clock />
          </div>
          <nav aria-label="Main" className="hidden sm:block">
            <ul className="flex items-center gap-7 font-mono text-xs uppercase tracking-[0.18em]">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <Magnetic strength={0.25}>
                    <Link href={n.href} className="group block py-2">
                      <Roll>{n.label}</Roll>
                    </Link>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            className="flex h-10 items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] sm:hidden"
          >
            {open ? "Close" : "Menu"}
            <span className="flex flex-col gap-1">
              <span className={`block h-px w-5 bg-fg transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-fg transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="menu"
        className="fixed inset-0 z-[79] hidden flex-col justify-between bg-lime px-4 pb-8 pt-24 text-bg"
      >
        <nav aria-label="Mobile">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="m-link flex items-baseline gap-3 font-display text-[17vw] font-bold leading-[0.95] tracking-tighter"
                >
                  <span className="font-mono text-xs">0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
          <a href={profile.links.linkedin}>LinkedIn</a>
          <a href={profile.links.github}>GitHub</a>
          <a href={profile.cv}>CV</a>
        </div>
      </div>
    </>
  );
}
