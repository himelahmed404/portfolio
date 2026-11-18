"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import stackData from "@/content/stack.json";
import experienceData from "@/content/experience.json";
import type { ExperienceItem, StackGroup } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";

const stackGroups = stackData as StackGroup[];
const { items: experience, certifications } = experienceData as {
  items: ExperienceItem[];
  certifications: string[];
};

export function StackSection() {
  const [hoveredExp, setHoveredExp] = useState<number | null>(null);

  return (
    <div className="mx-auto grid max-w-300 mt-8 sm:mt-10 grid-cols-1 items-start gap-8 layout:grid-cols-2 layout:gap-14">
      <div>
        <Reveal className="mb-4.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
          <span>STACK</span>
        </Reveal>
        <div className="flex flex-col gap-4">
          {stackGroups.map((group, i) => (
            <Reveal key={group.label} delay={0.06 + i * 0.05}>
              <div className="mb-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div>
        <Reveal className="mb-4.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
          <span>EXPERIENCE</span>
        </Reveal>
        <div className="flex flex-col relative" onMouseLeave={() => setHoveredExp(null)}>
          {experience.map((item, i) => {
            const isHovered = hoveredExp === i;

            return (
              <Reveal key={item.title} delay={0.06 + i * 0.05}>
                <div
                  onMouseEnter={() => setHoveredExp(i)}
                  className={`group relative border-b border-ink-600/70 py-4 px-3.5 -mx-3.5 rounded-lg transition-colors duration-150 cursor-default ${
                    isHovered ? "z-10" : "z-1"
                  } ${i === 0 ? "pt-2" : ""}`}
                >
                  {isHovered && (
                    <motion.div
                      layoutId="expRowHighlight"
                      className="absolute inset-0 rounded-lg bg-ink-700/60 border border-teal-500/20 shadow-[0_4px_16px_rgba(0,0,0,0.2)] pointer-events-none"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-4">
                    <h4 className="m-0 font-display text-[21px] font-medium leading-[1.3] text-ink-100 transition-colors duration-200 group-hover:text-white">
                      {item.title}
                    </h4>
                    <span className="flex-none font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400 transition-colors duration-200 group-hover:text-teal-400">
                      {item.date}
                    </span>
                  </div>
                  <p className="relative z-10 m-0 mt-1.5 text-base leading-[1.6] text-ink-300 text-pretty transition-colors duration-200 group-hover:text-ink-200">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={0.06 + experience.length * 0.05} className="mt-5">
          <div className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
            CERTIFICATIONS
          </div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {certifications.map((c) => (
              <li key={c} className="text-sm leading-normal text-ink-300 transition-colors hover:text-ink-100">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
