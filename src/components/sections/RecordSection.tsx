import recordData from "@/content/record.json";
import type { RecordRow } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

const { rows, summary } = recordData as { rows: RecordRow[]; summary: string };

export function RecordSection() {
  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <Reveal className="mb-7 font-mono text-[11px] font-medium tracking-[0.14em] text-brass-500">
        COMPETITION RECORD
      </Reveal>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <Reveal
            key={row.name}
            delay={i * 0.06}
            className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-ink-600 py-4"
          >
            <span className="min-w-[110px] flex-none font-mono text-lg font-medium text-brass-500 tabular-nums sm:text-xl">
              {row.rank}
            </span>
            <span className="flex-1 text-base leading-[1.5] text-ink-100">{row.name}</span>
            <span className="flex-none text-sm leading-[1.5] text-ink-300">{row.tag}</span>
          </Reveal>
        ))}
      </div>
      <Reveal delay={rows.length * 0.06} className="mt-6 font-mono text-sm font-medium text-ink-400">
        {summary}
      </Reveal>
    </div>
  );
}
