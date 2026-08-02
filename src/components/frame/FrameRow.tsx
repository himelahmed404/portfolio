import { FrameImage } from "@/components/frame/FrameImage";
import type { FramePhoto, FrameRowData } from "@/lib/types";

export function FrameRow({
  row,
  photos,
  ready,
}: {
  row: FrameRowData;
  photos: FramePhoto[];
  ready: boolean;
}) {
  const soloRight = row.type === "solo" && row.align === "right";

  return (
    <div className={`flex flex-col items-start gap-12 md:flex-row md:gap-8 ${soloRight ? "md:justify-end" : ""}`}>
      {row.items.map((i, idx) => (
        <FrameImage key={photos[i].src} photo={photos[i]} rowType={row.type} ready={ready} delay={idx * 0.08} />
      ))}
    </div>
  );
}
