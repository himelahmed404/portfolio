export type Mark = "x" | "o" | "";
export type Board = Mark[];

export interface Outcome {
  mark: Mark | "draw";
  line: number[] | null;
}

export const EMPTY_BOARD: Board = ["", "", "", "", "", "", "", "", ""];

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function outcome(b: Board): Outcome | null {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { mark: b[a], line };
  }
  return b.indexOf("") === -1 ? { mark: "draw", line: null } : null;
}

// Full minimax — 9 cells, so no pruning needed. The depth term prefers the
// fastest win and the slowest loss, which is what makes a perfect player
// feel like it's playing you instead of just refusing to lose.
export function bestMove(board: Board, me: "x" | "o"): number {
  const foe: "x" | "o" = me === "o" ? "x" : "o";

  function walk(b: Board, depth: number, turn: "x" | "o"): number {
    const r = outcome(b);
    if (r) return r.mark === "draw" ? 0 : r.mark === me ? 10 - depth : depth - 10;
    let out = turn === me ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = turn;
      const v = walk(b, depth + 1, turn === me ? foe : me);
      b[i] = "";
      out = turn === me ? Math.max(out, v) : Math.min(out, v);
    }
    return out;
  }

  const b = board.slice();
  let bestV = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = me;
    const v = walk(b, 1, foe);
    b[i] = "";
    if (v > bestV) {
      bestV = v;
      move = i;
    }
  }
  return move;
}

// Vary the opening: centre and corners all hold at least a draw, so the bot
// stays perfect while never playing the same first move twice running.
export function openingMove(avoid: number): number {
  const opens = [0, 2, 4, 6, 8].filter((i) => i !== avoid);
  return opens[Math.floor(Math.random() * opens.length)];
}

export function cellLabel(index: number, mark: Mark): string {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  return `Row ${row}, column ${col}${mark ? ", " + mark.toUpperCase() : ", empty"}`;
}
