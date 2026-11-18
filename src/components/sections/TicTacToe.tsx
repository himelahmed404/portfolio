"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMPTY_BOARD, bestMove, cellLabel, openingMove, outcome, type Board, type Outcome } from "@/lib/tictactoe";
import { GhostButton } from "@/components/ui/PortfolioButton";

const DEFAULT_FIRST: "you" | "bot" = "bot";
const BOT_THINK_MS = 400;

type Side = "you" | "bot";

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [result, setResult] = useState<Outcome | null>(null);
  const [thinking, setThinking] = useState(() => DEFAULT_FIRST === "bot");
  const [first, setFirstState] = useState<Side | "">("");
  const [score, setScore] = useState({ w: 0, d: 0, l: 0 });
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const lastOpenRef = useRef(-1);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => () => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
  }, []);

  const firstSide = useCallback((): Side => (first || DEFAULT_FIRST) as Side, [first]);

  const finish = useCallback((b: Board, r: Outcome) => {
    setBoard(b);
    setResult(r);
    setThinking(false);
    setScore((s) => ({
      w: s.w + (r.mark === "x" ? 1 : 0),
      d: s.d + (r.mark === "draw" ? 1 : 0),
      l: s.l + (r.mark === "o" ? 1 : 0),
    }));
  }, []);

  const botMove = useCallback(
    (currentBoard: Board) => {
      const b = currentBoard.slice();
      let m: number;
      if (b.join("") === "") {
        m = openingMove(lastOpenRef.current);
        lastOpenRef.current = m;
      } else {
        m = bestMove(b, "o");
      }
      if (m < 0) return;
      b[m] = "o";
      const r = outcome(b);
      if (r) {
        finish(b, r);
      } else {
        setBoard(b);
        setThinking(false);
      }
    },
    [finish]
  );

  const think = useCallback(
    (nextBoard: Board) => {
      const wait = reducedRef.current ? 0 : BOT_THINK_MS;
      setBoard(nextBoard);
      setThinking(true);
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      botTimerRef.current = setTimeout(() => botMove(nextBoard), wait);
    },
    [botMove]
  );

  const play = useCallback(
    (i: number) => {
      if (result || thinking || board[i]) return;
      const b = board.slice();
      b[i] = "x";
      const r = outcome(b);
      if (r) {
        finish(b, r);
        return;
      }
      think(b);
    },
    [board, result, thinking, finish, think]
  );

  const resetGame = useCallback(
    (side?: Side) => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
      const empty = [...EMPTY_BOARD];
      const who = side || firstSide();
      setBoard(empty);
      setResult(null);
      setThinking(false);
      setFirstState(who);
      if (who === "bot") think(empty);
    },
    [firstSide, think]
  );

  const setFirst = useCallback(
    (side: Side) => {
      if (firstSide() === side && !board.some(Boolean)) return;
      resetGame(side);
    },
    [board, firstSide, resetGame]
  );

  useEffect(() => {
    if (firstSide() !== "bot") return;
    const wait = reducedRef.current ? 0 : BOT_THINK_MS;
    const timer = setTimeout(() => botMove(EMPTY_BOARD), wait);
    botTimerRef.current = timer;
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const line = result?.line ?? [];
  let statusKind: "turn" | "win" | "lose" | "draw" = "turn";
  let statusText = "YOUR MOVE — YOU ARE X";
  if (thinking) statusText = "THINKING…";
  if (result) {
    if (result.mark === "x") {
      statusKind = "win";
      statusText = "YOU WIN — EMAIL ME";
    } else if (result.mark === "o") {
      statusKind = "lose";
      statusText = "BOT WINS — TRY THE CENTRE";
    } else {
      statusKind = "draw";
      statusText = "DRAW — THE CORRECT RESULT";
    }
  }
  const statusColor = {
    turn: "text-teal-400",
    win: "text-teal-300 font-semibold",
    lose: "text-ink-300",
    draw: "text-ink-300",
  }[statusKind];

  const side = firstSide();

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="mb-3.5 flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-teal-400">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(79,151,163,0.8)]" />
        <span>WHILE YOU&apos;RE HERE</span>
      </div>
      <h2 className="m-0 mb-2.5 font-display text-2xl font-semibold tracking-[-0.01em] text-ink-100">
        Beat the bot.
      </h2>
      <p className="m-0 mb-5 text-sm leading-[1.55] text-ink-300 text-pretty">
        It plays perfectly, so a draw is the best result that exists. Find a win and you&rsquo;ve found a bug &mdash;
        email me, I&rsquo;ll want the repro.
      </p>

      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <span className="mr-0.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400">FIRST MOVE</span>
        {(["you", "bot"] as const).map((s) => (
          <motion.button
            key={s}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFirst(s)}
            className={`cursor-pointer rounded-md border px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] transition-all duration-200 ${
              side === s
                ? "cursor-default border-teal-500 bg-ink-700 text-ink-100 shadow-[0_0_10px_rgba(79,151,163,0.3)]"
                : "border-ink-600 bg-transparent text-ink-400 hover:border-teal-500/70 hover:text-ink-200"
            }`}
          >
            {s.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Tic-tac-toe board">
        {board.map((mark, i) => {
          const isWin = line.includes(i);
          const locked = Boolean(mark || result || thinking);
          const isHovered = hoveredCell === i && !locked;

          return (
            <motion.button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => play(i)}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
              whileHover={locked ? {} : { scale: 1.04, y: -2, zIndex: 10 }}
              whileTap={locked ? {} : { scale: 0.94 }}
              aria-label={cellLabel(i, mark)}
              className={`group relative flex aspect-square appearance-none items-center justify-center rounded-xl border font-display text-[clamp(26px,7vw,34px)] font-semibold leading-none transition-all duration-200 ${
                isHovered ? "z-10" : "z-1"
              } ${
                isWin
                  ? "border-teal-400 bg-teal-500 text-ink-900 shadow-[0_0_20px_rgba(79,151,163,0.7)]"
                  : mark === "x"
                    ? "cursor-default border-teal-500/50 bg-ink-700 text-teal-400 shadow-[0_0_12px_rgba(79,151,163,0.2)]"
                    : mark === "o"
                      ? "cursor-default border-ink-600 bg-ink-700 text-ink-100"
                      : "cursor-pointer border-ink-600/80 bg-ink-700/60 hover:border-teal-400/80 hover:bg-ink-700 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
              }`}
            >
              {/* Ghost preview of X on hover */}
              {!mark && isHovered && (
                <span className="pointer-events-none absolute font-display text-[clamp(26px,7vw,34px)] font-semibold text-teal-400/40 select-none">
                  X
                </span>
              )}

              <AnimatePresence>
                {mark && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.3, rotate: mark === "x" ? -12 : 12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  >
                    {mark.toUpperCase()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-[18px] flex flex-wrap items-center justify-between gap-2.5">
        <span className={`font-mono text-[11px] font-medium tracking-[0.14em] ${statusColor}`} aria-live="polite">
          {statusText}
        </span>
        <GhostButton onClick={() => resetGame()}>NEW GAME</GhostButton>
      </div>

      <div className="mt-3.5 border-t border-ink-600/80 pt-3.5 font-mono text-[11px] font-medium tracking-[0.14em] text-ink-400 tabular-nums">
        WINS{" "}
        <motion.span
          key={`w-${score.w}`}
          initial={{ scale: 1.4, color: "#4f97a3" }}
          animate={{ scale: 1, color: "#e7e5e2" }}
          className="inline-block font-semibold"
        >
          {score.w}
        </motion.span>{" "}
        &nbsp;&middot;&nbsp; DRAWS{" "}
        <motion.span
          key={`d-${score.d}`}
          initial={{ scale: 1.4, color: "#4f97a3" }}
          animate={{ scale: 1, color: "#e7e5e2" }}
          className="inline-block font-semibold"
        >
          {score.d}
        </motion.span>{" "}
        &nbsp;&middot;&nbsp; LOSSES{" "}
        <motion.span
          key={`l-${score.l}`}
          initial={{ scale: 1.4, color: "#c2a165" }}
          animate={{ scale: 1, color: "#e7e5e2" }}
          className="inline-block font-semibold"
        >
          {score.l}
        </motion.span>
      </div>
    </div>
  );
}
