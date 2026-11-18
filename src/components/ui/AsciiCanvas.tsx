"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  type AsciiConfig,
  SEVE_ASCII_CONFIG,
  sampleImageToGrid,
  renderAsciiFrame,
  type GridSampleData,
} from "@/lib/asciiEngine";

export interface AsciiCanvasProps {
  src: string;
  config?: Partial<AsciiConfig>;
  active?: boolean;
  wipeProgress?: number;
  isConstructing?: boolean;
  className?: string;
  onLoaded?: () => void;
}

export function AsciiCanvas({
  src,
  config: customConfig,
  active = true,
  wipeProgress = 1,
  isConstructing = false,
  className = "",
  onLoaded,
}: AsciiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const gridDataRef = useRef<GridSampleData | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Merge custom config with Seve defaults
  const mergedConfig: AsciiConfig = useMemo(
    () => ({
      ...SEVE_ASCII_CONFIG,
      ...customConfig,
      pfx: {
        ...SEVE_ASCII_CONFIG.pfx,
        ...(customConfig?.pfx || {}),
      },
    }),
    [customConfig]
  );

  // Re-sample image to grid on size change or image load
  const updateSampling = useCallback(() => {
    if (!imgRef.current || !canvasRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(10, Math.floor(rect.width));
    const height = Math.max(10, Math.floor(rect.height));

    const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;
    const canvas = canvasRef.current;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    gridDataRef.current = sampleImageToGrid(imgRef.current, width, height, mergedConfig);
  }, [mergedConfig]);

  // Load image
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      imgRef.current = img;
      setLoaded(true);
      updateSampling();
      onLoaded?.();
    };

    return () => {
      isMounted = false;
    };
  }, [src, updateSampling, onLoaded]);

  // Observe container resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      updateSampling();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateSampling]);

  // Animation Loop
  useEffect(() => {
    if (!active || !loaded || !canvasRef.current) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();

    const loop = (currentTime: number) => {
      if (!active) return;
      const elapsed = currentTime - startTime;

      if (gridDataRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        renderAsciiFrame(
          ctx,
          rect.width,
          rect.height,
          gridDataRef.current,
          mergedConfig,
          elapsed,
          {
            sourceImg: imgRef.current,
            wipeProgress,
            isConstructing,
          }
        );
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [active, loaded, mergedConfig, wipeProgress, isConstructing]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
