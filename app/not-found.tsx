import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col justify-center pb-20 pt-36">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Error 404 · Off the map</p>
      <h1 className="mt-4 font-display text-[28vw] font-bold leading-[0.8] tracking-tighter text-lime sm:text-[20vw]">404</h1>
      <p className="mt-6 max-w-md text-lg text-fg-dim">Dug here, found nothing. This coordinate isn&apos;t on any map I&apos;ve drawn.</p>
      <Link href="/" className="mt-8 inline-flex h-14 w-fit items-center rounded-full bg-fg px-7 font-mono text-sm uppercase tracking-widest text-bg hover:bg-lime">
        ← Back to base camp
      </Link>
    </Container>
  );
}
