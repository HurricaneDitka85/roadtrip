import { useMemo, useState } from 'react'
import { WYR } from '../data'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WouldYouRather() {
  const [round, setRound] = useState(0)
  const deck = useMemo(() => shuffle(WYR), [round])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)

  const card = deck[idx % deck.length]

  const next = () => {
    setPicked(null)
    setIdx((i) => {
      const n = i + 1
      if (n % deck.length === 0) setRound((r) => r + 1) // reshuffle after a full pass
      return n
    })
  }

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Would You Rather</h2>
          <span className="odometer">#{idx + 1}</span>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          Read it out loud, then everyone picks. Tap the one you'd choose — no wrong answers,
          just great arguments.
        </p>
      </div>

      <div className="card wyr-card">
        <div className="wyr-q">Would you rather…</div>

        <button
          className={`wyr-option a${picked === 'a' ? ' chosen' : ''}`}
          onClick={() => setPicked('a')}
        >
          {card[0]}
        </button>

        <div className="wyr-or">OR</div>

        <button
          className={`wyr-option b${picked === 'b' ? ' chosen' : ''}`}
          onClick={() => setPicked('b')}
        >
          {card[1]}
        </button>
      </div>

      <button className="btn btn-blue" style={{ width: '100%' }} onClick={next}>
        Next question →
      </button>
    </>
  )
}
