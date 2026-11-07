"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import { Magnetic } from "./fx/Magnetic";
import { Marquee } from "./fx/Marquee";
import { ArrowUpRight, Container, Roll } from "./ui";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-accent text-bg">
      <Marquee speed={90} className="border-b border-bg/20 py-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-display text-[13vw] font-bold leading-none tracking-tighter sm:text-[9vw]">
            Let&apos;s build something{" "}
            <svg viewBox="0 0 24 24" aria-hidden className="spin-slow inline-block size-[0.8em] shrink-0 fill-current">
              <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.27l-6.18 3.24L7 13.63 2 8.76l6.91-1z" />
            </svg>
          </span>
        ))}
      </Marquee>

      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em]">Got a project or a role? Say hi.</p>
          <Magnetic strength={0.15}>
            <button
              type="button"
              onClick={copy}
              data-cursor={copied ? "Copied!" : "Copy"}
              data-cursor-color="#0d0e0b"
              className="mt-4 block break-all text-left font-display text-[8.5vw] font-bold leading-[0.95] tracking-tight underline decoration-2 underline-offset-[0.15em] sm:text-6xl lg:text-7xl"
            >
              {profile.email}
            </button>
          </Magnetic>
          <p className="mt-3 h-5 font-mono text-xs" aria-live="polite">
            {copied ? "✓ Copied to clipboard" : "Click to copy"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 self-end font-mono text-sm uppercase tracking-widest">
          <ul className="space-y-2">
            <li><a className="group" href={profile.links.linkedin}><Roll>LinkedIn <ArrowUpRight /></Roll></a></li>
            <li><a className="group" href={profile.links.github}><Roll>GitHub <ArrowUpRight /></Roll></a></li>
            <li><a className="group" href={profile.cv}><Roll>CV / PDF ↓</Roll></a></li>
          </ul>
          <ul className="space-y-2 text-bg/70">
            <li>Semarang</li>
            <li>Jakarta</li>
            <li>Indonesia</li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-wrap justify-between gap-3 border-t border-bg/20 py-5 font-mono text-[11px] uppercase tracking-widest">
        <span>© 2026 {profile.name}</span>
        <span>Psst, click anywhere for ripples</span>
      </Container>
    </footer>
  );
}
