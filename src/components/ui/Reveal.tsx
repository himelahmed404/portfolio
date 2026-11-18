"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

const wipe: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transitionEnd: {
      clipPath: "none",
    },
  },
};

/**
 * The site's signature 3D print deposit reveal: a precision clip-path wipe
 * from the bottom edge, depositing content onto the plate as you scroll.
 * Tuned with luxury cubic-bezier easing [0.16, 1, 0.3, 1] for smooth,
 * deliberate momentum scrolling.
 *
 * Crucially, once the entrance wipe finishes, clipPath transitions to "none"
 * so that children (3D tilt cards, magnetic buttons, shadows, badges) can
 * freely move, tilt, and expand without being cut off by the reveal bounding box.
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
  const [revealed, setRevealed] = useState(false);

  return (
    <div ref={ref} className="overflow-visible">
      <motion.div
        className={`${className} overflow-visible`}
        initial={shouldReduceMotion ? "show" : "hidden"}
        animate={inView || shouldReduceMotion ? "show" : "hidden"}
        variants={wipe}
        onAnimationComplete={(definition) => {
          if (definition === "show") {
            setRevealed(true);
          }
        }}
        style={{
          clipPath: revealed || shouldReduceMotion ? "none" : undefined,
        }}
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
