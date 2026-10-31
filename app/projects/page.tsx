import type { Metadata } from "next";
import { SplitText } from "@/components/fx/SplitText";
import { WorkIndex } from "@/components/sections/WorkIndex";
import { Container, Eyebrow } from "@/components/ui";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects by Muhammad Anshar Al Faruq: WebGIS hazard mapping, trilingual mining platforms and an energy-sector security dashboard.",
};

export default function ProjectsPage() {
  return (
    <Container className="pb-32 pt-36 sm:pt-44">
      <Eyebrow>Index · {String(projects.length).padStart(2, "0")} projects</Eyebrow>
      <h1 className="mt-6 font-display font-bold uppercase leading-[0.85] tracking-[-0.05em]">
        <SplitText text="All the" trigger="load" playful className="block text-[16vw] sm:text-[11vw]" />
        <SplitText text="work." trigger="load" delay={0.1} playful className="block text-[16vw] text-lime sm:text-[11vw]" />
      </h1>
      <div className="mt-16">
        <WorkIndex />
      </div>
    </Container>
  );
}
