"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { FramePhoto, FrameRowType } from "@/lib/types";

const SIZES: Record<FrameRowType, string> = {
  full: "(max-width: 768px) 100vw, 1200px",
  pair: "(max-width: 768px) 100vw, 50vw",
  trio: "(max-width: 768px) 100vw, 33vw",
  solo: "(max-width: 768px) 100vw, 58vw",
};

export function FrameImage({
  photo,
  rowType,
  ready,
  delay,
}: {
  photo: FramePhoto;
  rowType: FrameRowType;
  ready: boolean;
  delay: number;
}) {
  const solo = rowType === "solo";

  return (
    <figure
      className={`group m-0 w-full min-w-0 ${solo ? "md:w-[58%]" : "flex-none md:w-auto md:flex-[var(--ar)_1_0]"}`}
      style={{ "--ar": photo.w / photo.h } as CSSProperties}
    >
      <Reveal duration={0.48} delay={delay}>
        <div
          className="relative z-1 hover:z-10 w-full overflow-hidden rounded-xl border border-ink-700/60 bg-ink-800 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-[border-color,box-shadow,transform,z-index] duration-500 hover:-translate-y-1 group-hover:border-teal-500/50 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.5),0_0_24px_rgba(79,151,163,0.12)] cursor-pointer"
          style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- inline base64 LQIP, not an optimizable asset */}
          <img
            src={photo.blur}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
          />
          {ready && (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              quality={82}
              sizes={SIZES[rowType]}
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          )}

          {/* Interactive photo metadata pill on hover */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-ink-600/70 bg-ink-900/85 px-3 py-1 font-mono text-[10px] font-medium tracking-widest text-ink-200 backdrop-blur-md opacity-0 translate-y-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
            <span>
              {photo.w} × {photo.h} {photo.alt ? `· ${photo.alt.toUpperCase()}` : ""}
            </span>
          </div>
        </div>
      </Reveal>
    </figure>
  );
}
