import projectsData from "@/content/projects.json";
import type { ProjectSummary } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";

const projects = projectsData as ProjectSummary[];

export function WorkSection() {
  return (
    <div className="mx-auto flex max-w-300 flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-ink-600 pb-3.5">
        <Reveal className="font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
          SELECTED WORK / {projects.length.toString().padStart(2, "0")}
        </Reveal>
        <Reveal className="text-sm leading-normal text-ink-300">
          A selection of projects I’ve worked on, including personal work, client work, and collaborations.
        </Reveal>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
