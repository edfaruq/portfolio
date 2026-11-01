import type { Metadata } from "next";
import { FieldPass } from "@/components/fx/FieldPass";
import { Magnetic } from "@/components/fx/Magnetic";
import { PhotoStack } from "@/components/fx/PhotoStack";
import { Marquee } from "@/components/fx/Marquee";
import { Reveal } from "@/components/fx/Reveal";
import { ScrollWords } from "@/components/fx/ScrollWords";
import { SplitText } from "@/components/fx/SplitText";
import { Container, Eyebrow } from "@/components/ui";
import { certifications, education, organization, profile, skills } from "@/content/profile";
import { getProject } from "@/content/projects";

export const metadata: Metadata = {
  title: "About",
  description: `About ${profile.name}: education, certifications and background.`,
};

export default function AboutPage() {
  const kkn = getProject("semarang-hazard-webgis")!;
  const thesis = getProject("b2b-exporter-ecommerce")!;
  const pertagas = getProject("pertagas-security-dashboard")!;
  const notes = [
    { p: kkn, text: "A hazard-mapping WebGIS built with residents of West Semarang, from fieldwork to the award stage." },
    { p: pertagas, text: "Interning at Pertamina Gas: a Sophos security dashboard, and a great crew to build it with." },
    { p: thesis, text: "Thesis on a B2B exporter e-commerce app for PT Telaga Cipta, then the gown and the sash." },
  ];
  return (
    <>
      <Container className="pb-20 pt-36 sm:pt-44">
        <Eyebrow>About · {profile.location}</Eyebrow>
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="mt-6 font-display font-bold uppercase leading-[0.85] tracking-[-0.05em]">
              <SplitText text="Hi, I'm" trigger="load" playful className="block text-[16vw] sm:text-[min(11vw,180px)]" />
              <SplitText text="Faruq." trigger="load" delay={0.1} playful className="block text-[16vw] text-lime sm:text-[min(11vw,180px)]" />
            </h1>
            <div className="mt-14 grid gap-10 xl:grid-cols-[1.5fr_auto] xl:items-end">
              <ScrollWords
                className="font-display text-3xl leading-[1.15] tracking-tight sm:text-5xl"
                text={profile.intro.replace("two mining companies", "two *mining* companies").replace("energy company", "*energy* company").replace("hazard-mapping WebGIS", "hazard-mapping *WebGIS*")}
              />
              <Magnetic className="justify-self-start xl:justify-self-end">
                <a
                  href={profile.cv}
                  data-cursor="Download"
                  className="group flex size-44 items-center justify-center rounded-full bg-accent text-center font-mono text-sm uppercase tracking-widest text-bg transition-transform duration-500 hover:scale-110 sm:size-52"
                >
                  Download
                  <br />
                  CV ↓
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="lg:-mt-20 lg:w-[340px]">
            <FieldPass />
            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim">
              ↑ Hold &amp; drag the card ↑
            </p>
          </div>
        </div>
      </Container>

      <section className="rotate-[-1.5deg] border-y border-bg bg-accent py-4 text-bg">
        <Marquee speed={60}>
          {["Laravel", "Next.js", "Fieldwork", "React", "i18n", "Leaflet", "Dashboards", "TypeScript", "MySQL", "Python"].map((s) => (
            <span key={s} className="flex items-center gap-6 pr-6 font-display text-5xl font-bold uppercase tracking-tight sm:text-7xl">
              {s} <span className="text-lime">✺</span>
            </span>
          ))}
        </Marquee>
      </section>

      <Container className="grid gap-20 py-28 lg:grid-cols-2">
        <section>
          <Eyebrow>Education</Eyebrow>
          <Reveal className="mt-6">
            <p className="font-mono text-xs uppercase tracking-widest text-fg-dim">{education.period}</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">{education.school}</h2>
            <p className="mt-1 text-lg text-fg-dim">{education.degree} · {education.place}</p>
            <div className="mt-8 rounded-2xl border border-line p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">Thesis</p>
              <p className="mt-2 leading-relaxed">{education.thesis}</p>
            </div>
            <div className="mt-4 rounded-2xl bg-lime p-6 text-bg">
              <p className="font-mono text-[11px] uppercase tracking-widest">★ KKN-T 35 KATANA</p>
              <p className="mt-2 font-medium leading-relaxed">
                Best Program Award at Gelar Karya KKN UNDIP for the West Semarang hazard-mapping WebGIS.
              </p>
            </div>
          </Reveal>
        </section>

        <section>
          <Eyebrow>Certifications</Eyebrow>
          <Reveal className="mt-6 border-t border-line">
            {certifications.map((c) => (
              <a
                key={c.title}
                href={c.pdf}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View PDF"
                aria-label={`${c.title}, ${c.issuer}, ${c.year}: open certificate PDF in a new tab`}
                className="group relative block overflow-hidden border-b border-line"
              >
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-fg transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />
                <div className="relative flex items-baseline justify-between gap-4 py-6 transition-colors duration-300 group-hover:text-bg">
                  <span>
                    <span className="block font-display text-xl font-semibold leading-tight">{c.title}</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                      {c.issuer} · <span className="underline decoration-1 underline-offset-4">PDF ↗</span>
                    </span>
                  </span>
                  <span className="font-display text-3xl font-bold">{c.year}</span>
                </div>
              </a>
            ))}
          </Reveal>

          <div className="mt-16">
            <Eyebrow>Off the keyboard</Eyebrow>
            <Reveal className="mt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-fg-dim">{organization.period}</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{organization.name}</h2>
              <p className="text-fg-dim">{organization.role}</p>
              <p className="mt-3 leading-relaxed">{organization.summary}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {organization.certificates.map((c) => (
                  <a
                    key={c.pdf}
                    href={c.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="View PDF"
                    aria-label={`HMIF certificate, ${c.label}: open PDF in a new tab`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-xs uppercase tracking-widest transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                  >
                    Certificate · {c.label} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </Container>

      <Container className="pb-32">
        <Eyebrow>Field notes</Eyebrow>
        {/* Each note spans three shared rows (title, text, photos) so the stacks line up across columns. */}
        <div className="mt-10 grid gap-x-12 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
          {notes.map(({ p, text }) => (
            <section key={p.slug} className="row-span-3 grid grid-rows-subgrid content-start gap-y-0">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{p.gallery!.title}</h2>
              <p className="mt-2 max-w-md text-fg-dim">{text}</p>
              <div className="mt-6">
                <PhotoStack photos={p.gallery!.photos} accent={p.color} />
              </div>
            </section>
          ))}
        </div>
      </Container>

      <Container className="pb-32">
        <Eyebrow>Toolkit</Eyebrow>
        <Reveal className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group} className="bg-bg p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">{g.group}</p>
              <ul className="mt-4 space-y-1">
                {g.items.map((s) => (
                  <li key={s} className="font-display text-xl font-medium transition-all duration-300 hover:translate-x-2 hover:text-lime">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </Container>
    </>
  );
}
