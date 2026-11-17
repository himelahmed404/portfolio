"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TICKS = ["0.00", "0.20", "0.45", "0.60", "0.75", "0.90", "1.00"];
const LAYER_NAMES = [
  "00 · BASE (The print)",
  "01 · BUILD (Selected work)",
  "02 · RECORD (Competition)",
  "03 · BREAK (Writeups)",
  "04 · STACK (Skills)",
  "05 · OPERATOR (About)",
  "06 · CONTACT (Reach out)",
];

export function Rail({
  z,
  active,
  onJump,
}: {
  z: number;
  active: number;
  onJump: (index: number) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-y-0 left-0 z-[60] hidden w-[72px] flex-col items-center border-r border-ink-600/70 bg-ink-900/95 backdrop-blur-md py-6 layout:flex select-none"
    >
      {/* Top Z indicator */}
      <div className="flex flex-col items-center">
        <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-ink-400">AXIS</span>
        <div className="mt-1 flex items-baseline gap-0.5">
          <span className="font-mono text-xs font-semibold text-teal-400">Z</span>
          <span className="font-mono text-sm font-semibold text-teal-400 tabular-nums">
            {z.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Vertical tick track */}
      <div className="relative flex flex-1 flex-col justify-center items-center py-6">
        {/* Subtle continuous vertical guide track */}
        <div className="absolute top-8 bottom-8 w-[1px] bg-ink-700/60 pointer-events-none" />

        <div className="flex flex-col justify-center gap-4 relative z-10">
          {TICKS.map((label, i) => {
            const isActive = active === i;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={label}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <button
                  onClick={() => onJump(i)}
                  aria-label={`Jump to ${LAYER_NAMES[i]}`}
                  className="group relative flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent px-3 py-1.5 focus:outline-none"
                >
                  {/* Tick line */}
                  <div className="relative flex items-center justify-center w-8 h-3">
                    {isActive ? (
                      <motion.span
                        layoutId="activeTickGlow"
                        className="absolute block h-[2px] w-7 bg-teal-400 shadow-[0_0_10px_rgba(79,151,163,0.85)] rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    ) : (
                      <span
                        className={`block h-px w-5 transition-all duration-200 ${
                          isHovered ? "w-6 bg-ink-300" : "bg-ink-600"
                        }`}
                      />
                    )}
                  </div>

                  {/* Tick label */}
                  <span
                    className={`font-mono text-[10px] tracking-tight tabular-nums transition-colors duration-200 ${
                      isActive ? "font-semibold text-teal-300" : isHovered ? "text-ink-200" : "text-ink-400"
                    }`}
                  >
                    {label}
                  </span>
                </button>

                {/* Floating tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-[70px] z-50 whitespace-nowrap rounded-md border border-ink-600 bg-ink-800/95 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.1em] text-ink-100 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md pointer-events-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
                        <span>{LAYER_NAMES[i]}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom vertical branding */}
      <div
        className="font-mono text-[10px] font-medium tracking-[0.2em] text-ink-400/80 transition-colors hover:text-ink-200"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        HIMELAHMED.DEV
      </div>
    </nav>
  );
}
