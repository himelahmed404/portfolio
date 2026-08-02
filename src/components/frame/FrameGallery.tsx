"use client";

import { useDeferredImages } from "@/lib/useDeferredImages";
import { FrameRow } from "@/components/frame/FrameRow";
import type { FramePhoto, FrameRowData } from "@/lib/types";

export function FrameGallery({ rows, photos }: { rows: FrameRowData[]; photos: FramePhoto[] }) {
  const ready = useDeferredImages();

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      {rows.map((row, i) => (
        <FrameRow key={i} row={row} photos={photos} ready={ready} />
      ))}
    </div>
  );
}
