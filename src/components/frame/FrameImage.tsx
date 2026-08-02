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
      className={`m-0 w-full min-w-0 ${solo ? "md:w-[58%]" : "flex-none md:w-auto md:flex-[var(--ar)_1_0]"}`}
      style={{ "--ar": photo.w / photo.h } as CSSProperties}
    >
      <Reveal duration={0.4} delay={delay}>
        <div
          className="relative w-full overflow-hidden rounded-xl bg-ink-800"
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
              quality={72}
              sizes={SIZES[rowType]}
              loading="lazy"
              className="object-cover"
            />
          )}
        </div>
      </Reveal>
    </figure>
  );
}
