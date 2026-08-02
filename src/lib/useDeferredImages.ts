"use client";

import { useEffect, useState } from "react";

/**
 * Gates real <Image> mounts until the main thread is idle, so the page's own
 * JS finishes first. Blur placeholders (rendered unconditionally) keep the
 * grid's geometry and visible content correct in the meantime — this is only
 * safe because those never wait on this flag.
 */
export function useDeferredImages() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  return ready;
}
