"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { AsciiCanvas } from "@/components/ui/AsciiCanvas";
import { ImageIcon } from "lucide-react";

export type TransitionPhase = "clear" | "constructing" | "ascii" | "resolving";

interface OperatorPortraitProps {
  src: string;
  alt: string;
  className?: string;
}

const CLEAR_DURATION = 4000; // 4 seconds clear photo loop
const CONSTRUCT_DURATION = 750; // 750ms smooth diagonal fade from top-left to bottom-right
const ASCII_DURATION = 2000; // 2 seconds hold in binary ASCII mode
const RESOLVE_DURATION = 750; // 750ms smooth diagonal fade from top-left to bottom-right

export function OperatorPortrait({
  src,
  alt,
  className = "",
}: OperatorPortraitProps) {
  const [phase, setPhase] = useState<TransitionPhase>("clear");
  const [wipeProgress, setWipeProgress] = useState(0); // 0 to 1
  const [imgErrored, setImgErrored] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const animFrameRef = useRef<number | null>(null);

  // Periodic State Machine Loop:
  // 3.0s clear -> diagonal fade in (top-left to bottom-right) -> 1.5s binary -> diagonal fade out (top-left to bottom-right) -> repeat
  useEffect(() => {
    if (shouldReduceMotion) return;

    let timer: NodeJS.Timeout;

    if (phase === "clear") {
      timer = setTimeout(() => {
        setWipeProgress(0);
        setPhase("constructing");
      }, CLEAR_DURATION);
    } else if (phase === "constructing") {
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / CONSTRUCT_DURATION);
        // Smooth cubic ease-in-out
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setWipeProgress(eased);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setWipeProgress(1);
          setPhase("ascii");
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    } else if (phase === "ascii") {
      timer = setTimeout(() => {
        setWipeProgress(0);
        setPhase("resolving");
      }, ASCII_DURATION);
    } else if (phase === "resolving") {
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / RESOLVE_DURATION);
        // Smooth cubic ease-in-out
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setWipeProgress(eased);

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setPhase("clear");
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    }

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [phase, shouldReduceMotion]);

  const isAsciiActive = phase === "constructing" || phase === "ascii" || phase === "resolving";

  // Diagonal feathered fade mask (135deg: top-left to bottom-right)
  let maskStyle: React.CSSProperties = {};
  if (phase === "constructing") {
    // Binary layer fades in diagonally from top-left to bottom-right
    const start = wipeProgress * 150 - 25;
    const end = wipeProgress * 150 + 25;
    const grad = `linear-gradient(135deg, rgba(0,0,0,1) ${start}%, rgba(0,0,0,0) ${end}%)`;
    maskStyle = {
      WebkitMaskImage: grad,
      maskImage: grad,
      opacity: 1,
      visibility: "visible",
    };
  } else if (phase === "resolving") {
    // Clear photo sweeps in diagonally from top-left to bottom-right
    // (binary layer fades out from top-left to bottom-right)
    const start = wipeProgress * 150 - 25;
    const end = wipeProgress * 150 + 25;
    const grad = `linear-gradient(135deg, rgba(0,0,0,0) ${start}%, rgba(0,0,0,1) ${end}%)`;
    maskStyle = {
      WebkitMaskImage: grad,
      maskImage: grad,
      opacity: 1,
      visibility: "visible",
    };
  } else if (phase === "ascii") {
    maskStyle = {
      WebkitMaskImage: "none",
      maskImage: "none",
      opacity: 1,
      visibility: "visible",
    };
  } else {
    // Clear phase: completely hidden, 0% opacity, no transitions to avoid flicker
    maskStyle = {
      opacity: 0,
      visibility: "hidden",
      pointerEvents: "none",
    };
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-ink-900 ${className}`}
      style={{ aspectRatio: "4/5" }}
    >
      {/* 1. Underlying High-Res Main Photo */}
      {!imgErrored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setImgErrored(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center font-mono text-[11px] tracking-wide text-ink-400">
          <ImageIcon className="h-6 w-6 opacity-50" aria-hidden />
          <span>{alt}</span>
        </div>
      )}

      {/* 2. Micro Binary (0 & 1) ASCII Layer with Top-Left to Bottom-Right Diagonal Fade */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        style={maskStyle}
      >
        <AsciiCanvas
          src={src}
          active={isAsciiActive}
          wipeProgress={1}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
