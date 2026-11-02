import Link from "next/link";
import { CompanyLogo } from "@/components/CompanyLogo";
import { CountUp } from "@/components/fx/CountUp";
import { Marquee } from "@/components/fx/Marquee";
import { ScrollWords } from "@/components/fx/ScrollWords";
import { SplitText } from "@/components/fx/SplitText";
import { DrillCore } from "@/components/sections/DrillCore";
import { Hero } from "@/components/sections/Hero";
import { HorizontalWork } from "@/components/sections/HorizontalWork";
import { Container, Eyebrow } from "@/components/ui";
import { skills } from "@/content/profile";
import { projects } from "@/content/projects";

const numbers = [
  { value: "3", label: "Industry clients", note: "2 mining · 1 exporter" },
  { value: "127", label: "Shelters mapped", note: "West Semarang WebGIS" },
  { value: "1,700+", label: "Translation keys", note: "per locale · ID / EN / ZH" },
  { value: "4", label: "Security feeds", note: "unified in one dashboard" },
];

const allSkills = skills.flatMap((g) => g.items);
const companies = projects.filter((p) => p.logo);

export default function Home() {
  return (
    <>
      <Hero />

      <Container className="py-28 sm:py-40">
        <Eyebrow>About, briefly</Eyebrow>
        <ScrollWords
          className="mt-8 max-w-6xl font-display text-[8vw] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          text="I'm a fresh Computer Science graduate who has already shipped *production* platforms for two mining companies, a *security* dashboard for an energy company, and a hazard *map* built with residents in the field. I like work that touches the ground."
        />
      </Container>

      <section className="-rotate-2 border-y border-bg bg-lime py-4 text-bg">
        <Marquee speed={70}>
          {allSkills.map((s) => (
            <span key={s} className="flex items-center gap-6 pr-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
              {s} <span className="text-accent">✺</span>
            </span>
          ))}
        </Marquee>
      </section>
      <section className="rotate-1 border-y border-line bg-bg-2 py-3">
        <Marquee speed={45} reverse>
          {allSkills.map((s) => (
            <span key={s} className="flex items-center gap-6 pr-6 font-mono text-sm uppercase tracking-[0.3em] text-fg-dim">
              {s} <span>/</span>
            </span>
          ))}
        </Marquee>
      </section>

      <Container className="py-28 sm:py-36">
        <SplitText
          as="h2"
          text="By the numbers"
          className="block font-display text-5xl font-bold uppercase tracking-tighter sm:text-8xl"
        />
        <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} className="group relative flex min-h-64 flex-col justify-between overflow-hidden bg-bg p-6 transition-colors duration-500 hover:bg-lime hover:text-bg">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim transition-colors group-hover:text-bg">
                {n.label}
              </dt>
              <dd>
                <CountUp
                  value={n.value}
                  className="block font-display text-7xl font-bold tracking-tighter transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 sm:text-8xl"
                />
                <span className="mt-2 block text-sm text-fg-dim transition-colors group-hover:text-bg">{n.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      <HorizontalWork />

      {/* Logo strip: runs right to left, full bleed. */}
      <section aria-label="Clients and teams I've worked with" className="relative min-[900px]:-mt-12">
        <Marquee speed={45} className="py-4">
          {/* Three sets per half, so one half is always wider than even a very wide screen. */}
          {[0, 1, 2].flatMap((set) =>
            companies.map((p) => (
              <Link
                key={`${set}-${p.slug}`}
                href={`/projects/${p.slug}`}
                aria-hidden={set > 0 || undefined}
                tabIndex={set > 0 ? -1 : undefined}
                data-cursor={p.relation === "Client" ? "Client" : "Worked with"}
                data-cursor-color={p.color}
                className="group mx-4 flex items-center rounded-2xl px-6 py-4 text-fg/85 transition-colors duration-300 hover:bg-fg sm:mx-8 sm:px-8"
              >
                <CompanyLogo logo={p.logo!} name={p.client} area={88} reveal />
              </Link>
            )),
          )}
        </Marquee>
      </section>

      <DrillCore />
    </>
  );
}
