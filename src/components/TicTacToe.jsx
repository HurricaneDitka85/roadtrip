import { useState } from 'react'
import { usePersistentState } from '../lib/storage'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winnerOf(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] }
    }
  }
  return null
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xNext, setXNext] = useState(true)
  const [score, setScore] = usePersistentState('rt.ttt', { X: 0, O: 0, tie: 0 })

  const win = winnerOf(board)
  const full = board.every(Boolean)
  const over = win || full

  const play = (i) => {
    if (board[i] || over) return
    const nb = board.slice()
    nb[i] = xNext ? 'X' : 'O'
    const w = winnerOf(nb)
    if (w) setScore((s) => ({ ...s, [w.mark]: s[w.mark] + 1 }))
    else if (nb.every(Boolean)) setScore((s) => ({ ...s, tie: s.tie + 1 }))
    setBoard(nb)
    setXNext((v) => !v)
  }

  const newRound = () => {
    setBoard(Array(9).fill(null))
    setXNext(true)
  }

  const status = win
    ? `${win.mark} wins!`
    : full
    ? "Cat's game — it's a tie"
    : `${xNext ? 'X' : 'O'}'s turn`

  return (
    <>
      <div className="card">
        <h2>Tic-Tac-Toe</h2>
        <p className="hint">Pass the phone back and forth. X goes first.</p>
        <div className="ttt-score">
          <div className="ttt-tally x">
            <div className="v">{score.X}</div>
            <div className="l">X wins</div>
          </div>
          <div className="ttt-tally tie">
            <div className="v">{score.tie}</div>
            <div className="l">Ties</div>
          </div>
          <div className="ttt-tally o">
            <div className="v">{score.O}</div>
            <div className="l">O wins</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className={`ttt-status${win ? ' win' : ''}`}>{status}</div>
        <div className="ttt-board">
          {board.map((cell, i) => (
            <button
              key={i}
              className={`ttt-cell${cell ? ` ${cell.toLowerCase()}` : ''}${
                win && win.line.includes(i) ? ' hot' : ''
              }`}
              onClick={() => play(i)}
              disabled={!!cell || over}
              aria-label={cell ? `${cell} at square ${i + 1}` : `Empty square ${i + 1}`}
            >
              {cell}
            </button>
          ))}
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn btn-green" style={{ flex: 1 }} onClick={newRound}>
            {over ? 'Play again' : 'Restart round'}
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={() =>
              confirm('Reset the win tally?') && (setScore({ X: 0, O: 0, tie: 0 }), newRound())
            }
          >
            Reset score
          </button>
        </div>
      </div>
    </>
  )
}
