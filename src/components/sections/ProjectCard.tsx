"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/types";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { ShotPlaceholder } from "@/components/ui/ShotPlaceholder";
import { Heading } from "@/components/ui/Typography";
import { useDocOverlay } from "@/components/overlay/DocOverlayContext";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const { openDoc } = useDocOverlay();
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // 3D tilt motion values
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 25 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const spotlightBackground = useMotionTemplate`radial-gradient(380px circle at ${spotlightX}px ${spotlightY}px, rgba(79, 151, 163, 0.16), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (shouldReduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlightX.set(x);
      spotlightY.set(y);

      // Compute normalized offset [-0.5, 0.5] from center
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      // Subtle, refined 3D tilt (up to ±4.5 degrees)
      rawRotateX.set(-normY * 5);
      rawRotateY.set(normX * 5);
    },
    [rawRotateX, rawRotateY, spotlightX, spotlightY, shouldReduceMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  return (
    <div
      style={{ perspective: 1000 }}
      className={`h-full relative transition-[z-index] ${isHovered ? "z-30" : "z-1"}`}
    >
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
          zIndex: isHovered ? 30 : 1,
        }}
        whileHover={{
          y: -5,
          zIndex: 30,
          transition: { type: "spring", stiffness: 350, damping: 24 },
        }}
        className={`group relative flex h-full flex-col gap-3.5 rounded-xl border border-ink-600 bg-ink-700/80 p-5 backdrop-blur-xs transition-[border-color,box-shadow] duration-300 hover:border-teal-500/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(79,151,163,0.15)] ${
          isHovered ? "z-30" : "z-1"
        }`}
      >
        {/* Specular interactive spotlight sheen */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
          style={{
            opacity: isHovered && !shouldReduceMotion ? 1 : 0,
            background: spotlightBackground,
          }}
        />

        {/* Card thumbnail with smooth zoom */}
        <div className="relative z-10 overflow-hidden rounded-lg">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <ShotPlaceholder
              src={project.image ?? `/shots/${project.slug}-card.png`}
              label={project.shotLabel}
              aspect="16/10"
            />
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-10 flex flex-1 flex-col gap-2">
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

          <div className="mt-auto pt-1 flex flex-col gap-2.5">
            <button
              onClick={() => openDoc(project.slug)}
              className="group/btn inline-flex items-center gap-1.5 w-fit cursor-pointer self-start border-0 bg-transparent p-0 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400 hover:text-teal-200 transition-colors"
            >
              <span>READ CASE STUDY</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </button>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
              <StatusChip status={project.status}>{project.statusLabel}</StatusChip>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
