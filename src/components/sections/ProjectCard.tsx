"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/types";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import { Heading } from "@/components/ui/Typography";
import { useDocOverlay } from "@/components/overlay/DocOverlayContext";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const { openDoc } = useDocOverlay();

  return (
    <motion.article
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 350, damping: 26 } }}
      className="group relative flex flex-col gap-3.5 rounded-xl border border-ink-600 bg-ink-700/80 p-5 backdrop-blur-xs transition-[border-color,box-shadow] duration-300 hover:border-teal-500/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4),0_0_24px_rgba(79,151,163,0.1)]"
    >
      <div className="overflow-hidden rounded-lg">
        <div className="transition-transform duration-500 ease-out group-hover:scale-[1.025]">
          <ShotPlaceholder
            src={project.image ?? `/shots/${project.slug}-card.png`}
            label={project.shotLabel}
            aspect="16/10"
          />
        </div>
      </div>

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
              className="group/ext flex-none whitespace-nowrap font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400 hover:text-teal-200 transition-colors"
            >
              {project.externalLabel}{" "}
              <ArrowUpRight className="inline h-3 w-3 transition-transform duration-200 group-hover/ext:translate-x-0.5 group-hover/ext:-translate-y-0.5" />
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
          className="group/btn inline-flex items-center gap-1.5 w-fit cursor-pointer self-start border-0 bg-transparent p-0 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400 hover:text-teal-200 transition-colors"
        >
          <span>READ CASE STUDY</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
        <div className="mt-0.5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          <StatusChip status={project.status}>{project.statusLabel}</StatusChip>
        </div>
      </div>
    </motion.article>
  );
}
