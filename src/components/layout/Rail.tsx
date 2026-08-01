const TICKS = ["0.00", "0.20", "0.45", "0.60", "0.75", "0.90", "1.00"];
const LAYER_NAMES = ["Base", "Build", "Record", "Break", "Stack", "Operator", "Contact"];

export function Rail({
  z,
  active,
  onJump,
}: {
  z: number;
  active: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-y-0 left-0 z-[60] hidden w-[72px] flex-col items-center border-r border-ink-600 bg-ink-900 py-5 layout:flex"
    >
      <div className="font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">Z</div>
      <div className="mt-1 font-mono text-sm font-medium text-teal-500 tabular-nums">{z.toFixed(2)}</div>
      <div className="flex flex-1 flex-col justify-center gap-4 py-5">
        {TICKS.map((label, i) => (
          <button
            key={label}
            onClick={() => onJump(i)}
            aria-label={`Jump to 0${i} ${LAYER_NAMES[i]}`}
            className="flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent py-0.5"
          >
            <span className={`block w-6 ${active === i ? "h-0.5 bg-teal-500" : "h-px bg-ink-600"}`} />
            <span className={`font-mono text-[10px] leading-none ${active === i ? "text-ink-100" : "text-ink-400"}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
      <div
        className="font-mono text-[10px] font-medium tracking-[0.14em] text-ink-400"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        HIMELAHMED.DEV
      </div>
    </nav>
  );
}
