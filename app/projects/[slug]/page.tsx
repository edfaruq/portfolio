import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContourArt } from "@/components/ContourArt";
import { CountUp } from "@/components/fx/CountUp";
import { Magnetic } from "@/components/fx/Magnetic";
import { Parallax, Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Container, Eyebrow } from "@/components/ui";
import { getProject, projects, sectors } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  // Cap the title size so its longest word always fits the viewport width.
  const longest = Math.max(...p.title.split(" ").map((w) => w.length));
  const fit = `${(90 / (longest * 0.68)).toFixed(2)}vw`;

  return (
    <article>
      {/* Coloured hero */}
      <header className="relative overflow-hidden pb-14 pt-32 text-bg sm:pt-40" style={{ background: p.color }}>
        <Container>
          <Link href="/projects" className="group inline-flex font-mono text-xs uppercase tracking-widest" data-cursor="Back">
            ← All work
          </Link>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em]">
            {p.code} · {sectors[p.sector].symbol} {sectors[p.sector].label} · {p.period}
          </p>
          <h1
            className="mt-4 font-display font-bold uppercase leading-[0.86] tracking-[-0.045em]"
            style={{ "--fit": fit } as React.CSSProperties}
          >
            <SplitText
              text={p.title}
              trigger="load"
              playful
              className="block text-[min(12vw,var(--fit))] sm:text-[min(8.5vw,var(--fit))]"
            />
          </h1>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <p className="max-w-xl text-xl font-medium leading-snug sm:text-2xl">{p.summary}</p>
            {p.award && (
              <div className="flex size-36 rotate-12 items-center justify-center rounded-full bg-bg p-4 text-center font-mono text-[10px] uppercase leading-tight tracking-wider text-lime">
                ★ {p.award}
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Facts bar */}
      <Container>
        <dl className="grid grid-cols-2 border-b border-line sm:grid-cols-4">
          {[
            ["Client", p.client],
            ["Role", p.role],
            ["Location", p.place.name],
            ["Stack", p.stack.join(" · ")],
          ].map(([k, v]) => (
            <div key={k} className="border-r border-line py-6 pr-4 last:border-r-0 [&:nth-child(2)]:max-sm:border-r-0 sm:px-4 sm:first:pl-0">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">{k}</dt>
              <dd className="mt-1 text-sm">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* Big art with parallax */}
      <Container className="py-16">
        <Parallax speed={8} className="rounded-3xl">
          <div className="group">
            <ContourArt project={p} className="aspect-[16/9] scale-110" />
          </div>
        </Parallax>
      </Container>

      {/* Metrics */}
      <Container>
        <Reveal className="grid grid-cols-2 gap-x-6 gap-y-12 border-y border-line py-14 sm:grid-cols-3 lg:grid-cols-5">
          {p.metrics.map((m) => (
            <div key={m.label}>
              <CountUp value={m.value} className="block font-display text-6xl font-bold tracking-tighter" />
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-fg-dim">{m.label}</span>
            </div>
          ))}
        </Reveal>
      </Container>

      {/* Story */}
      <Container className="grid gap-16 py-24 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>The context</Eyebrow>
          <p className="mt-6 font-display text-2xl leading-snug tracking-tight sm:text-3xl">{p.context}</p>
        </div>
        <div>
          <Eyebrow>What I built</Eyebrow>
          <Reveal className="mt-6">
            {p.built.map((b, n) => (
              <div key={n} className="group flex gap-6 border-b border-line py-8 first:border-t">
                <span className="font-display text-4xl font-bold transition-colors duration-300" style={{ color: p.color }}>
                  {String(n + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-lg leading-relaxed transition-transform duration-500 group-hover:translate-x-2">{b}</p>
              </div>
            ))}
          </Reveal>
          {p.link && (
            <Magnetic>
              <a href={p.link} target="_blank" rel="noopener noreferrer" data-cursor="Open" className="mt-10 inline-flex h-14 items-center rounded-full bg-lime px-7 font-mono text-sm uppercase tracking-widest text-bg">
                Visit live site ↗
              </a>
            </Magnetic>
          )}
        </div>
      </Container>

      {/* Next project */}
      <Link
        href={`/projects/${next.slug}`}
        data-cursor="Next"
        data-cursor-color={next.color}
        className="group relative block overflow-hidden border-t border-line"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100"
          style={{ background: next.color }}
        />
        <Container className="relative py-20 transition-colors duration-500 group-hover:text-bg sm:py-28">
          <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Next project · {next.code}</span>
          <span className="mt-3 block font-display text-[11vw] font-bold uppercase leading-[0.86] tracking-[-0.045em] transition-transform duration-700 group-hover:translate-x-4 sm:text-[7vw]">
            {next.title} →
          </span>
        </Container>
      </Link>
    </article>
  );
}
