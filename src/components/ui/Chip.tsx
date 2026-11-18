"use client";

import { motion } from "framer-motion";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      className="inline-flex cursor-default items-center rounded border border-ink-600/70 bg-ink-800/90 px-2 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300 transition-colors duration-200 hover:border-teal-500/60 hover:bg-ink-700/80 hover:text-teal-200 hover:shadow-[0_0_10px_rgba(79,151,163,0.25)] select-none"
    >
      {children}
    </motion.span>
  );
}

type StatusKind = "live" | "shipped" | "wip";

const DOT_COLOR: Record<StatusKind, string> = {
  live: "bg-verified",
  shipped: "bg-verified",
  wip: "bg-wip",
};

export function StatusChip({ status, children }: { status: StatusKind; children: React.ReactNode }) {
  return (
    <motion.span
      whileHover={{ scale: 1.03 }}
      className="ml-auto inline-flex items-center gap-1.5 rounded border border-ink-700/60 bg-ink-800/90 px-2 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300 transition-colors duration-200 hover:border-ink-500 hover:text-ink-200 select-none"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${DOT_COLOR[status]}`}
        />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${DOT_COLOR[status]}`} />
      </span>
      {children}
    </motion.span>
  );
}
