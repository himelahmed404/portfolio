"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

const wipe: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: { clipPath: "inset(0 0 0 0)" },
};

/**
 * The site's one signature reveal: a clip-path wipe from the bottom edge,
 * as if the content were being deposited under it — not a fade-and-rise
 * (the single clearest tell of a generated site).
 *
 * The clip-path lives on an inner motion.div, observed by a plain outer
 * div. Watching the clipped element directly would never work: it starts
 * clipped to zero height, so IntersectionObserver sees an empty rect and
 * never reports it as visible, regardless of scroll position.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children?: ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref}>
      <motion.div
        className={className}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={wipe}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
          delay: shouldReduceMotion ? 0 : delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
