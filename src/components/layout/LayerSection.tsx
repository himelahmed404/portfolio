import type { ReactNode } from "react";

export const BAND_HEIGHT = 28;

export function layerTop(index: number) {
  return index * BAND_HEIGHT;
}

const ACCENT_CLASS = {
  teal: "bg-teal-500",
  brass: "bg-brass-500",
};

interface LayerSectionProps {
  index: number;
  code: string;
  name: string;
  zLabel: string;
  minHeight: number;
  background: "ink900" | "ink800";
  accent?: "teal" | "brass";
  active: boolean;
  onBandClick: () => void;
  sectionRef: (el: HTMLElement | null) => void;
  center?: boolean;
  ariaLabel: string;
  children: ReactNode;
}

/**
 * One layer of the "build plate": position:sticky at index*BAND_HEIGHT so
 * earlier layers dock into a stack of thin bands as you scroll past them.
 * Purely a CSS effect — no scroll-jacking — the active/z-value bookkeeping
 * lives in useLayerScroll.
 */
export function LayerSection({
  index,
  code,
  name,
  zLabel,
  minHeight,
  background,
  accent = "teal",
  active,
  onBandClick,
  sectionRef,
  center = false,
  ariaLabel,
  children,
}: LayerSectionProps) {
  const top = layerTop(index);
  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={background === "ink900" ? "bg-ink-900" : "bg-ink-800"}
      style={{
        position: "sticky",
        top,
        zIndex: index + 1,
        height: `calc(100vh - ${top}px)`,
        minHeight,
      }}
    >
      <button
        onClick={onBandClick}
        className="relative z-[2] flex h-7 w-full items-center gap-3 border-0 border-b border-ink-600 bg-ink-800 px-4 text-left shadow-[0_1px_0_rgba(0,0,0,0.4)] sm:px-7"
      >
        <span className={`h-3.5 w-[3px] flex-none ${ACCENT_CLASS[accent]}`} />
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300">{code}</span>
        <span
          className={`hidden overflow-hidden text-ellipsis whitespace-nowrap font-body text-[11px] layout:block ${active ? "text-ink-100" : "text-ink-400"}`}
        >
          {name}
        </span>
        <span className="ml-auto font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">{zLabel}</span>
      </button>
      <div
        data-scroll-body
        className={`thin-scroll h-[calc(100%-28px)] overflow-y-auto px-6 py-6 sm:px-8 sm:py-10 ${center ? "flex flex-col" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}
