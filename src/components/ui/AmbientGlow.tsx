"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export function AmbientGlow() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const opacity = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 28 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const background = useMotionTemplate`radial-gradient(300px circle at ${smoothX}px ${smoothY}px, rgba(79, 151, 163, 0.045), transparent 70%)`;

  useEffect(() => {
    // Only enable for pointer: fine (desktop mice/trackpads)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    let hasMoved = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        opacity.set(1);
      }
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-700"
      style={{
        opacity,
        background,
      }}
    />
  );
}
