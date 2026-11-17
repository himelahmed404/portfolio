"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

const wipe: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: { clipPath: "inset(0 0 0 0)" },
};

/**
 * The site's signature 3D print deposit reveal: a precision clip-path wipe
 * from the bottom edge, depositing content onto the plate as you scroll.
 * Tuned with luxury cubic-bezier easing [0.16, 1, 0.3, 1] for smooth,
 * deliberate momentum scrolling.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.42,
  className = "",
}: {
  children?: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -30px 0px" });

  return (
    <div ref={ref}>
      <motion.div
        className={className}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={wipe}
        transition={{
          duration: shouldReduceMotion ? 0 : duration,
          ease: [0.16, 1, 0.3, 1],
          delay: shouldReduceMotion ? 0 : delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
