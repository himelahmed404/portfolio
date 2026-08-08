"use client";

import { ArrowUpRight } from "lucide-react";
import writeupsData from "@/content/writeups.json";
import type { Writeup } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { useDocOverlay } from "@/components/overlay/DocOverlayContext";

const writeups = writeupsData as Writeup[];

export function BreakSection() {
  const { openDoc } = useDocOverlay();

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 layout:grid-cols-2 layout:gap-12">
      <div>
        <Reveal className="mb-5 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
          DISCLOSURE + WRITEUPS
        </Reveal>
        <Reveal delay={0.06} className="rounded-xl border border-ink-600 bg-ink-700 p-6">
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded bg-ink-800 px-2 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300">
              <span className="h-1.5 w-1.5 rounded-full bg-verified" />
              ACKNOWLEDGED
            </span>
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">2025</span>
          </div>
          <h3 className="m-0 mb-3 font-display text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-100">
            DW News — email verification bypass
          </h3>
          <p className="m-0 mb-3 text-lg leading-[1.6] text-ink-100 text-pretty">
            The account registration API returned the one-time passcode in its response body. Any email address
            could be registered without owning it.
          </p>
          <p className="m-0 text-base leading-[1.65] text-ink-300 text-pretty">
            Reported 2025; acknowledged by the vendor. No bounty programme was running at the time.
          </p>
        </Reveal>
      </div>

      <div className="flex flex-col">
        <Reveal delay={0.12} className="mb-4 flex items-baseline justify-between gap-3 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
          <span>WRITEUPS / {writeups.length.toString().padStart(2, "0")}</span>
          <a
            href="https://medium.com/@himelahmed404"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-300"
          >
            @himelahmed404 ON MEDIUM
          </a>
        </Reveal>
        <div className="thin-scroll flex max-h-125 flex-col overflow-y-auto pr-2">
          {writeups.map((w, i) => {
            const meta = [w.tag, w.readTime, w.date].filter(Boolean).join(" · ");
            const content = (
              <>
                <div className="mb-1.5 flex items-baseline gap-3">
                  <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-teal-500">
                    {String(w.index).padStart(2, "0")}
                  </span>
                  <h4 className="m-0 flex items-center gap-1.5 font-display text-[21px] font-medium leading-[1.3] text-ink-100">
                    {w.title}
                    {w.externalHref && <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-400" />}
                  </h4>
                </div>
                {w.dek && <p className="m-0 mb-2 ml-7.5 text-base leading-[1.6] text-ink-300 text-pretty">{w.dek}</p>}
                <span className="ml-7.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">{meta}</span>
              </>
            );
            const className = `block w-full border-0 border-t border-ink-600 bg-transparent px-0 py-4.5 text-left ${i === writeups.length - 1 ? "border-b" : ""}`;
            return (
              <Reveal key={w.slug} delay={0.18 + i * 0.06}>
                {w.externalHref ? (
                  <a
                    href={w.externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${className} cursor-pointer`}
                  >
                    {content}
                  </a>
                ) : (
                  <button onClick={() => openDoc(w.slug)} className={`${className} cursor-pointer`}>
                    {content}
                  </button>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
