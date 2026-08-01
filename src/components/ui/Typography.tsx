import type { ElementType, ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "teal",
  className = "",
}: {
  children: ReactNode;
  tone?: "teal" | "muted" | "dim" | "brass";
  className?: string;
}) {
  const toneClass = {
    teal: "text-teal-500",
    muted: "text-ink-400",
    dim: "text-ink-300",
    brass: "text-brass-500",
  }[tone];
  return (
    <div className={`font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${toneClass} ${className}`}>
      {children}
    </div>
  );
}

type HeadingSize = "xl" | "l" | "m" | "title";

const SIZE_CLASSES: Record<HeadingSize, string> = {
  xl: "font-display font-semibold text-[clamp(40px,6.4vw,72px)] leading-[1.02] tracking-[-0.02em] text-ink-100",
  l: "font-display font-semibold text-[clamp(30px,4.4vw,44px)] leading-[1.08] tracking-[-0.02em] text-ink-100",
  m: "font-display font-semibold text-[clamp(24px,3.4vw,30px)] leading-[1.15] tracking-[-0.02em] text-ink-100",
  title: "font-display font-medium text-[21px] leading-[1.3] tracking-[-0.01em] text-ink-100",
};

export function Heading({
  as,
  size,
  className = "",
  children,
}: {
  as?: ElementType;
  size: HeadingSize;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? "h2";
  return <Tag className={`m-0 ${SIZE_CLASSES[size]} ${className}`}>{children}</Tag>;
}

export function BodyL({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-lg leading-[1.6] text-ink-100 text-pretty ${className}`}>{children}</p>;
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-base leading-[1.65] text-ink-300 text-pretty ${className}`}>{children}</p>;
}

export function Small({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-sm leading-[1.5] text-ink-300 ${className}`}>{children}</p>;
}
