import recordData from "@/content/record.json";
import type { RecordRow } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

const { rows, summary } = recordData as { rows: RecordRow[]; summary: string };

export function RecordSection() {
  return (
    <div className="mx-auto w-full max-w-[1000px] mt-10 sm:mt-12 md:mt-16 lg:mt-20">
      <Reveal className="mb-7 font-mono text-[11px] font-medium tracking-[0.14em] text-brass-500">
        COMPETITION RECORD
      </Reveal>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <Reveal
            key={row.name}
            delay={i * 0.05}
            className="group relative flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-ink-600/70 py-4 px-3 -mx-3 rounded-lg transition-colors duration-200 hover:bg-ink-700/40"
          >
            <span className="min-w-[110px] flex-none font-mono text-lg font-medium text-brass-500 tabular-nums sm:text-xl transition-all duration-200 group-hover:text-brass-400 group-hover:drop-shadow-[0_0_8px_rgba(194,161,101,0.4)]">
              {row.rank}
            </span>
            <span className="flex-1 text-base leading-[1.5] text-ink-100 transition-colors duration-200 group-hover:text-white">
              {row.name}
            </span>
            <span className="flex-none text-sm leading-[1.5] text-ink-300 transition-colors duration-200 group-hover:text-ink-200">
              {row.tag}
            </span>
          </Reveal>
        ))}
      </div>
      <Reveal delay={rows.length * 0.05 + 0.05} className="mt-6 font-mono text-sm font-medium text-ink-400">
        {summary}
      </Reveal>
    </div>
  );
}
