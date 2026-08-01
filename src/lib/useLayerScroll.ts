"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const Z_PER_LAYER = [0, 0.2, 0.45, 0.6, 0.75, 0.9, 1];

/**
 * Drives the Z-rail readout and the "which layer is docked/active" state for
 * the sticky-stacked section layout. Sections are position:sticky with
 * increasing top offsets (index * bandHeight) — clip-path'd/sticky targets
 * don't fire IntersectionObserver reliably, so this measures each section's
 * layout box against the viewport directly, same approach either way.
 */
export function useLayerScroll(count: number, bandHeight: number) {
  const sectionsRef = useRef<(HTMLElement | null)[]>(Array(count).fill(null));
  const refCallbacksRef = useRef<Map<number, (el: HTMLElement | null) => void>>(new Map());
  const naturalTopsRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(0);

  const [z, setZ] = useState(0);
  const [active, setActive] = useState(0);

  const registerSection = useCallback((index: number) => {
    let fn = refCallbacksRef.current.get(index);
    if (!fn) {
      fn = (el: HTMLElement | null) => {
        sectionsRef.current[index] = el;
      };
      refCallbacksRef.current.set(index, fn);
    }
    return fn;
  }, []);

  const measureTops = useCallback(() => {
    const sections = sectionsRef.current;
    let acc = 0;
    for (
      let el = sections[0]?.offsetParent as HTMLElement | null;
      el;
      el = el.offsetParent as HTMLElement | null
    ) {
      acc += el.offsetTop;
    }
    naturalTopsRef.current = sections.map((s) => {
      const t = acc;
      acc += s ? s.offsetHeight : 0;
      return t;
    });
  }, []);

  const measure = useCallback(() => {
    const sections = sectionsRef.current;
    if (!sections.length || sections.some((s) => !s)) return;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      const top = sections[i]!.getBoundingClientRect().top;
      if (top <= (i + 1) * bandHeight + 2) idx = i;
    }
    const r = sections[idx]!.getBoundingClientRect();
    const travel = Math.max(1, r.height);
    const passed = Math.min(1, Math.max(0, (idx * bandHeight - r.top) / travel));
    const z0 = Z_PER_LAYER[idx];
    const z1 = Z_PER_LAYER[Math.min(Z_PER_LAYER.length - 1, idx + 1)];
    setZ(z0 + (z1 - z0) * passed);
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, [bandHeight]);

  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      measure();
    });
  }, [measure]);

  const goTo = useCallback(
    (i: number) => {
      const s = sectionsRef.current[i];
      if (!s) return;
      if (naturalTopsRef.current.length !== sectionsRef.current.length) measureTops();
      const y = naturalTopsRef.current[i] - i * bandHeight + 2;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: Math.min(Math.max(0, y), Math.max(0, max)),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [bandHeight, measureTops]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("resize", measureTops);
    measureTops();
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", measureTops);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll, measure, measureTops]);

  return { z, active, registerSection, goTo };
}
