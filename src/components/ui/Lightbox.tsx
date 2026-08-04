"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type LightboxImage = { src: string; alt: string; caption?: string };

export function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  useEffect(() => {
    if (!image) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-900/95 p-4 backdrop-blur-sm sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close image"
            className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-ink-100 transition-colors hover:border-teal-500 hover:text-teal-300 sm:right-7 sm:top-7"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="absolute left-4 top-4 hidden font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400 sm:left-7 sm:top-7 sm:block">
            ESC TO CLOSE
          </span>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.65, 0, 0.35, 1] }}
            className="flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox loads arbitrary shot paths, next/image constraints don't fit */}
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-[80vh] max-w-[90vw] rounded-xl border border-ink-600 object-contain shadow-2xl sm:max-h-[85vh]"
            />
            {image.caption && (
              <p className="m-0 mt-4 max-w-[70ch] text-center text-sm leading-[1.5] text-ink-300">{image.caption}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
