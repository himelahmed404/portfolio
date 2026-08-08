import { ArrowRight } from "lucide-react";
import type { Writeup } from "@/lib/types";
import { Heading } from "@/components/ui/Typography";

export function WriteupPanel({
  writeup,
  allWriteups,
  onOpen,
  onClose,
}: {
  writeup: Writeup;
  allWriteups: Writeup[];
  onOpen: (slug: string) => void;
  onClose: () => void;
}) {
  const i = allWriteups.findIndex((w) => w.slug === writeup.slug);
  const prev = i > 0 ? allWriteups[i - 1] : null;
  const next = i < allWriteups.length - 1 ? allWriteups[i + 1] : null;

  return (
    <article className="mx-auto max-w-[720px] px-6 pt-8 pb-24 sm:px-10 sm:pt-12">
      <div className="mb-[18px] flex flex-wrap items-center gap-x-[18px] gap-y-2.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
        <span className="text-teal-500">WRITEUP {String(writeup.index).padStart(2, "0")}</span>
        <span>{writeup.tag}</span>
        <span>{writeup.readTime}</span>
        {writeup.rank && <span className="text-brass-500">{writeup.rank}</span>}
        {writeup.badge && (
          <span className="inline-flex items-center gap-1.5 rounded bg-ink-800 px-2 py-1 text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-verified" />
            {writeup.badge}
          </span>
        )}
      </div>
      <Heading as="h1" size="m" className="mb-4">
        {writeup.title}
      </Heading>
      <p className="m-0 mb-7 text-lg leading-[1.6] text-ink-100 text-pretty">{writeup.dek}</p>

      {(writeup.body ?? []).map((p, idx, body) => (
        <p
          key={idx}
          className={`m-0 text-base leading-[1.65] text-ink-300 text-pretty ${idx > 0 ? "mt-3.5" : ""} ${idx === body.length - 1 ? "mb-9" : ""}`}
        >
          {p}
        </p>
      ))}

      <nav className="flex items-center justify-between gap-4 border-t border-ink-600 pt-5 font-mono text-[11px] font-medium tracking-[0.14em]">
        {prev ? (
          <button
            onClick={() => onOpen(prev.slug)}
            className="cursor-pointer border-0 bg-transparent p-0 text-teal-500 hover:text-teal-300"
          >
            ← {prev.title.toUpperCase()}
          </button>
        ) : (
          <button onClick={onClose} className="cursor-pointer border-0 bg-transparent p-0 text-ink-400 hover:text-ink-300">
            ← ALL WRITEUPS
          </button>
        )}
        {next && (
          <button
            onClick={() => onOpen(next.slug)}
            className="cursor-pointer border-0 bg-transparent p-0 text-teal-500 hover:text-teal-300"
          >
            {next.title.toUpperCase()} <ArrowRight className="inline h-3 w-3" />
          </button>
        )}
      </nav>
    </article>
  );
}
