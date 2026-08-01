"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

type Aspect = "16/10" | "16/9" | "4/5";

/**
 * Image slot with a graceful placeholder. Points at a real file under
 * public/shots/*; until that file exists (or if it 404s), the placeholder
 * icon + label show instead — drop the real screenshot in later and this
 * swaps automatically, no code changes needed.
 */
export function ShotPlaceholder({
  src,
  alt,
  label,
  aspect = "16/10",
  className = "",
  rounded = "md",
}: {
  src?: string;
  alt?: string;
  label: string;
  aspect?: Aspect;
  className?: string;
  rounded?: "md" | "lg";
}) {
  const [errored, setErrored] = useState(false);
  const showPlaceholder = !src || errored;

  return (
    <div
      className={`relative w-full overflow-hidden border border-ink-600 bg-ink-800 ${rounded === "lg" ? "rounded-xl" : "rounded-lg"} ${className}`}
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
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
