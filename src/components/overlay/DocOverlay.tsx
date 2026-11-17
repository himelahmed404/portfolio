"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useDocOverlay } from "./DocOverlayContext";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { WriteupPanel } from "./WriteupPanel";
import caseStudiesData from "@/content/caseStudies.json";
import writeupsData from "@/content/writeups.json";
import type { CaseStudy, Writeup } from "@/lib/types";

const studies = caseStudiesData as CaseStudy[];
const posts = (writeupsData as Writeup[]).filter((w) => !w.externalHref);

export function DocOverlay() {
  const { activeDoc, openDoc, closeDoc } = useDocOverlay();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const study = activeDoc ? studies.find((s) => s.slug === activeDoc) : undefined;
  const writeup = activeDoc && !study ? posts.find((w) => w.slug === activeDoc) : undefined;

  // Pause background Lenis scrolling when overlay is active
  useEffect(() => {
    if (activeDoc) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [activeDoc, lenis]);

  useEffect(() => {
    if (!activeDoc) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const heading = scrollRef.current?.querySelector("h1");
    if (heading instanceof HTMLElement) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }, [activeDoc]);

  return (
    <AnimatePresence>
      {activeDoc && (study || writeup) && (
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-ink-900"
          role="dialog"
          aria-modal="true"
          aria-label="Case study reader"
        >
          <div className="flex h-11 flex-none items-center gap-3.5 border-b border-ink-600 bg-ink-800/95 backdrop-blur-md px-4 shadow-[0_1px_0_rgba(0,0,0,0.4)] sm:px-7">
            <button
              onClick={closeDoc}
              className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400 hover:text-teal-200 transition-colors"
            >
              ← BACK TO THE PRINT
            </button>
            <span className="ml-auto font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">
              ESC TO CLOSE
            </span>
          </div>
          <div ref={scrollRef} data-lenis-prevent className="thin-scroll flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {study && (
                <motion.div
                  key={study.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CaseStudyPanel study={study} allStudies={studies} onOpen={openDoc} />
                </motion.div>
              )}
              {writeup && (
                <motion.div
                  key={writeup.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <WriteupPanel writeup={writeup} allWriteups={posts} onOpen={openDoc} onClose={closeDoc} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
