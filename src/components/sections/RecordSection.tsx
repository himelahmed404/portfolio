"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import recordData from "@/content/record.json";
import type { RecordRow } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

const { rows, summary } = recordData as { rows: RecordRow[]; summary: string };

export function RecordSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1000px] mt-10 sm:mt-12 md:mt-16 lg:mt-20">
      <Reveal className="mb-7 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-brass-500">
        <span className="h-1.5 w-1.5 rounded-full bg-brass-500 shadow-[0_0_6px_rgba(194,161,101,0.8)]" />
        <span>COMPETITION RECORD</span>
      </Reveal>
      <div
        className="flex flex-col relative"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {rows.map((row, i) => {
          const isHovered = hoveredIdx === i;

          return (
            <Reveal key={row.name} delay={i * 0.05}>
              <div
                onMouseEnter={() => setHoveredIdx(i)}
                className={`group relative flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-ink-600/70 py-4 px-4 -mx-4 rounded-lg cursor-default transition-colors duration-150 ${
                  isHovered ? "z-10" : "z-1"
                }`}
              >
                {/* Floating spring highlight pill */}
                {isHovered && (
                  <motion.div
                    layoutId="recordRowHighlight"
                    className="absolute inset-0 rounded-lg bg-ink-700/60 border border-teal-500/20 shadow-[0_4px_16px_rgba(0,0,0,0.25)] pointer-events-none"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}

                <span className="relative z-10 min-w-[110px] flex-none font-mono text-lg font-medium text-brass-500 tabular-nums sm:text-xl transition-all duration-200 group-hover:text-brass-400 group-hover:drop-shadow-[0_0_8px_rgba(194,161,101,0.5)]">
                  {row.rank}
                </span>
                <span className="relative z-10 flex-1 text-base leading-[1.5] text-ink-100 transition-colors duration-200 group-hover:text-white font-medium">
                  {row.name}
                </span>
                <span className="relative z-10 flex-none font-mono text-sm leading-[1.5] text-ink-300 transition-colors duration-200 group-hover:text-teal-300">
                  {row.tag}
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={rows.length * 0.05 + 0.05} className="mt-6 font-mono text-sm font-medium text-ink-400">
        {summary}
      </Reveal>
    </div>
  );
}
