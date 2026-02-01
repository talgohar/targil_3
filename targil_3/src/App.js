import { useMemo, useState } from "react";
import "./App.css";

import blank from "./symbols/blank.png";
import xImg from "./symbols/x.png";
import oImg from "./symbols/o.png";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getOutcome(cells) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = cells[a];
    if (v && v === cells[b] && v === cells[c]) {
      return { winner: v, winningLine: line, isDraw: false };
    }
  }
  const isDraw = cells.every(Boolean);
  return { winner: null, winningLine: null, isDraw };
}

function symbolToImage(symbol) {
  if (symbol === "X") return xImg;
  if (symbol === "O") return oImg;
  return blank;
}

function Square({ value, onPick, highlight }) {
  return (
    <button
      type="button"
      className={`cell ${highlight ? "cell--win" : ""}`}
      onClick={onPick}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      <img className="cell__img" src={symbolToImage(value)} alt={value ?? ""} />
    </button>
  );
}

export default function App() {
  const [cells, setCells] = useState(() => Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);

  const outcome = useMemo(() => getOutcome(cells), [cells]);
  const isGameOver = Boolean(outcome.winner) || outcome.isDraw;

  const statusText = useMemo(() => {
    if (outcome.winner) return `Winner: ${outcome.winner}`;
    if (outcome.isDraw) return "Draw!";
    return `Next turn: ${xTurn ? "X" : "O"}`;
  }, [outcome.winner, outcome.isDraw, xTurn]);

  function handlePick(index) {
    if (isGameOver) return;
    if (cells[index]) return;

    setCells((prev) => {
      const next = prev.slice();
      next[index] = xTurn ? "X" : "O";
      return next;
    });
    setXTurn((t) => !t);
  }

  function restart() {
    setCells(Array(9).fill(null));
    setXTurn(true);
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Tic-Tac-Toe</h1>
        <p className="status" role="status" aria-live="polite">
          {statusText}
        </p>
      </header>

      <main className="board" aria-label="Tic tac toe board">
        {cells.map((val, idx) => (
          <Square
            key={idx}
            value={val}
            onPick={() => handlePick(idx)}
            highlight={outcome.winningLine?.includes(idx) ?? false}
          />
        ))}
      </main>

      <div className="actions">
        <button className="btn" type="button" onClick={restart}>
          Restart / New Game
        </button>
      </div>
    </div>
  );
}
