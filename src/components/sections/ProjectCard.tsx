"use client";

import { ArrowUpRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/types";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import { Heading } from "@/components/ui/Typography";
import { useDocOverlay } from "@/components/overlay/DocOverlayContext";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const { openDoc } = useDocOverlay();

  return (
    <article className="flex flex-col gap-3.5 rounded-xl border border-ink-600 bg-ink-700 p-5 transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-teal-500/40">
      <ShotPlaceholder src={`/shots/${project.slug}-card.png`} label={project.shotLabel} aspect="16/10" />
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2.5">
          <Heading as="h3" size="title">
            {project.title}
          </Heading>
          {project.externalHref ? (
            <a
              href={project.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.14em]"
            >
              {project.externalLabel} <ArrowUpRight className="inline h-3 w-3" />
            </a>
          ) : (
            <span className="flex-none font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
              {project.externalLabel}
            </span>
          )}
        </div>
        <p className="m-0 text-base leading-[1.5] text-ink-100 text-pretty">{project.claim}</p>
        <p className="m-0 text-sm leading-[1.5] text-ink-300">{project.role}</p>
        <button
          onClick={() => openDoc(project.slug)}
          className="w-fit cursor-pointer self-start border-0 bg-transparent p-0 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500 hover:text-teal-300"
        >
          READ CASE STUDY →
        </button>
        <div className="mt-0.5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          <StatusChip status={project.status}>{project.statusLabel}</StatusChip>
        </div>
      </div>
    </article>
  );
}
