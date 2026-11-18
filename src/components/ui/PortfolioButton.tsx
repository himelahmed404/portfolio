"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from "framer-motion";

const VARIANT_CLASSES = {
  primary:
    "bg-teal-500 border-teal-500 text-ink-100 shadow-[0_2px_8px_rgba(79,151,163,0.3)] hover:bg-teal-300 hover:border-teal-300 hover:text-ink-900 hover:shadow-[0_6px_22px_rgba(79,151,163,0.45)]",
  secondary:
    "bg-transparent border-ink-600 text-ink-100 hover:border-teal-400 hover:text-white hover:bg-ink-800/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]",
} as const;

const BASE =
  "group relative inline-flex items-center justify-center rounded-lg border px-5 py-3 text-base font-medium transition-[border-color,background-color,color,box-shadow] duration-200 select-none";

type Variant = keyof typeof VARIANT_CLASSES;

type LinkButtonProps = HTMLMotionProps<"a"> & {
  variant?: Variant;
  children: ReactNode;
};

export function LinkButton({ variant = "secondary", className = "", children, ...rest }: LinkButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 22 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.14));
    const deltaY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.14));
    rawX.set(deltaX);
    rawY.set(deltaY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : x,
        y: shouldReduceMotion ? 0 : y,
        zIndex: isHovered ? 25 : 1,
      }}
      whileTap={{ scale: 0.96 }}
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${isHovered ? "z-25" : "z-1"} ${className}`}
      {...rest}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "secondary", className = "", children, ...rest }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 22 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.14));
    const deltaY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.14));
    rawX.set(deltaX);
    rawY.set(deltaY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : x,
        y: shouldReduceMotion ? 0 : y,
        zIndex: isHovered ? 25 : 1,
      }}
      whileTap={{ scale: 0.96 }}
      className={`${BASE} ${VARIANT_CLASSES[variant]} cursor-pointer ${isHovered ? "z-25" : "z-1"} ${className}`}
      {...rest}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </span>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

type GhostButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

export function GhostButton({ className = "", children, ...rest }: GhostButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1, zIndex: 10 }}
      className={`cursor-pointer appearance-none rounded-md border border-ink-600 bg-transparent px-3.5 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-100 transition-[border-color,background-color,color] duration-200 hover:border-teal-400 hover:text-teal-200 hover:bg-ink-800/60 ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
