import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-teal-500 border-teal-500 text-ink-100 shadow-[0_2px_8px_rgba(79,151,163,0.3)] hover:bg-teal-300 hover:border-teal-300 hover:text-ink-900 hover:shadow-[0_6px_20px_rgba(79,151,163,0.45)]",
  secondary:
    "bg-transparent border-ink-600 text-ink-100 hover:border-teal-400 hover:text-white hover:bg-ink-800/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
} as const;

const BASE =
  "inline-flex items-center justify-center rounded-lg border px-5 py-3 text-base font-medium transition-all duration-200 active:scale-[0.98]";

type Variant = keyof typeof VARIANT_CLASSES;

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function LinkButton({ variant = "secondary", className = "", children, ...rest }: LinkButtonProps) {
  return (
    <a className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "secondary", className = "", children, ...rest }: ButtonProps) {
  return (
    <button className={`${BASE} ${VARIANT_CLASSES[variant]} cursor-pointer ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function GhostButton({
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`cursor-pointer appearance-none rounded-md border border-ink-600 bg-transparent px-3.5 py-2 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-100 transition-all duration-200 hover:border-teal-400 hover:text-teal-200 hover:bg-ink-800/40 active:scale-[0.98] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
