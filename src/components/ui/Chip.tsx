export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-ink-800 px-2 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300">
      {children}
    </span>
  );
}

type StatusKind = "live" | "shipped" | "wip";

const DOT_COLOR: Record<StatusKind, string> = {
  live: "bg-verified",
  shipped: "bg-verified",
  wip: "bg-wip",
};

export function StatusChip({ status, children }: { status: StatusKind; children: React.ReactNode }) {
  return (
    <span className="ml-auto inline-flex items-center gap-1.5 rounded bg-ink-800 px-2 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-300">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[status]}`} />
      {children}
    </span>
  );
}
