import type { ReactNode } from "react";

/** Text that rolls up to a duplicate on hover (pure CSS, uses parent .group). */
export function Roll({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block text-lime transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim ${className}`}>
      <span className="inline-block size-1.5 rounded-full bg-accent" />
      {children}
    </p>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-8 ${className}`}>{children}</div>;
}
