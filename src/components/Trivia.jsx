import { useMemo, useState } from 'react'
import { TRIVIA } from '../data'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Trivia() {
  const [round, setRound] = useState(0) // reshuffle key
  const deck = useMemo(() => shuffle(TRIVIA), [round])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  const q = deck[idx]
  const done = idx >= deck.length

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.c) setScore((s) => s + 1)
  }

  const next = () => {
    setPicked(null)
    setIdx((i) => i + 1)
  }

  const restart = () => {
    setRound((r) => r + 1)
    setIdx(0)
    setPicked(null)
    setScore(0)
  }

  if (done) {
    return (
      <div className="card">
        <h2>Deck complete</h2>
        <p style={{ fontSize: '1.1rem', margin: '8px 0' }}>
          Final score: <span className="odometer">{score}/{deck.length}</span>
        </p>
        <button className="btn btn-green" onClick={restart}>
          Shuffle and play again
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Road Trivia</h2>
          <span className="odometer">
            {score} pts · Q{idx + 1}/{deck.length}
          </span>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 700, fontSize: '1.02rem', marginBottom: 12 }}>{q.q}</p>
        {q.a.map((opt, i) => {
          let cls = 'trivia-option'
          if (picked !== null) {
            if (i === q.c) cls += ' correct'
            else if (i === picked) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} disabled={picked !== null} onClick={() => pick(i)}>
              {opt}
            </button>
          )
        })}
        {picked !== null && (
          <button className="btn btn-blue" style={{ width: '100%', marginTop: 6 }} onClick={next}>
            Next question →
          </button>
        )}
      </div>

      <p className="hint" style={{ padding: '0 4px' }}>
        Pass the phone around the car — reader asks, everyone shouts, reader taps the
        answer the group agreed on.
      </p>
    </>
  )
}
