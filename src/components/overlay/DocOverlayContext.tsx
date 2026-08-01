"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface DocOverlayValue {
  activeDoc: string | null;
  openDoc: (slug: string) => void;
  closeDoc: () => void;
}

const DocOverlayContext = createContext<DocOverlayValue | null>(null);

export function DocOverlayProvider({ children }: { children: ReactNode }) {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const scrollMemo = useRef(0);

  const openDoc = useCallback((slug: string) => {
    // Capture the scroll position only on the *first* open — internal nav
    // between panels (case study prev/next) should still restore to where
    // the reader originally came from, not to the previous panel.
    setActiveDoc((prev) => {
      if (prev === null) {
        scrollMemo.current = window.scrollY;
        document.documentElement.style.overflow = "hidden";
      }
      return slug;
    });
  }, []);

  const closeDoc = useCallback(() => {
    document.documentElement.style.overflow = "";
    setActiveDoc(null);
    window.scrollTo(0, scrollMemo.current);
  }, []);

  useEffect(() => {
    if (!activeDoc) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDoc();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeDoc, closeDoc]);

  return <DocOverlayContext.Provider value={{ activeDoc, openDoc, closeDoc }}>{children}</DocOverlayContext.Provider>;
}

export function useDocOverlay() {
  const ctx = useContext(DocOverlayContext);
  if (!ctx) throw new Error("useDocOverlay must be used within a DocOverlayProvider");
  return ctx;
}
