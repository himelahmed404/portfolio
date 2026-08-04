"use client";

import { useState } from "react";
import { ImageIcon, Maximize2 } from "lucide-react";

type Aspect = "16/10" | "16/9" | "4/5";

/**
 * Image slot with a graceful placeholder. Points at a real file under
 * public/shots/*; until that file exists (or if it 404s), the placeholder
 * icon + label show instead — drop the real screenshot in later and this
 * swaps automatically, no code changes needed.
 *
 * Pass `onClick` to make it a zoom target: adds a hover affordance and
 * swaps the div for a focusable button, without owning the modal itself.
 */
export function ShotPlaceholder({
  src,
  alt,
  label,
  aspect = "16/10",
  className = "",
  rounded = "md",
  onClick,
}: {
  src?: string;
  alt?: string;
  label: string;
  aspect?: Aspect;
  className?: string;
  rounded?: "md" | "lg";
  onClick?: () => void;
}) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;
  const zoomable = Boolean(onClick) && !showPlaceholder;

  return (
    <div
      onClick={onClick}
      role={zoomable ? "button" : undefined}
      tabIndex={zoomable ? 0 : undefined}
      onKeyDown={
        zoomable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`group relative w-full overflow-hidden border border-ink-600 bg-ink-800 ${rounded === "lg" ? "rounded-xl" : "rounded-lg"} ${zoomable ? "cursor-zoom-in" : ""} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {showPlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center font-mono text-[11px] tracking-wide text-ink-400">
          <ImageIcon className="h-6 w-6 opacity-50" aria-hidden />
          <span>{label}</span>
        </div>
      )}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- graceful onError fallback needs a plain img
        <img
          src={src}
          alt={alt ?? label}
          onError={() => setErrored(true)}
          className={`absolute inset-0 h-full w-full object-cover ${zoomable ? "transition-transform duration-300 ease-out group-hover:scale-[1.04]" : ""}`}
        />
      )}
      {zoomable && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-200 group-hover:bg-ink-900/40 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-500 bg-ink-800/90 px-3 py-1.5 font-mono text-[11px] font-medium tracking-widest text-ink-100">
            <Maximize2 className="h-3.5 w-3.5" aria-hidden /> VIEW
          </span>
        </div>
      )}
    </div>
  );
}
