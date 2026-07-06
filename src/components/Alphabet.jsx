import { usePersistentState } from '../lib/storage'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Alphabet() {
  // index of the next letter to find (0..26). 26 = finished.
  const [idx, setIdx] = usePersistentState('rt.alphabet', 0)

  const done = idx >= 26
  const target = LETTERS[idx]
  const pct = Math.round((idx / 26) * 100)

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>The Alphabet Game</h2>
          <span className="odometer">{idx}/26</span>
        </div>
        <div className="progress" aria-label={`${pct}% complete`}>
          <div style={{ width: `${pct}%` }} />
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          Find each letter <strong>in order</strong> on signs, plates, and billboards. First
          to spot it calls it out — then tap to move on.
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        {done ? (
          <>
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>🏁</div>
            <h2 style={{ marginTop: 8 }}>You made it to Z!</h2>
            <p className="hint" style={{ marginBottom: 12 }}>
              Whole alphabet spotted. Play it again on the next leg.
            </p>
            <button className="btn btn-green" onClick={() => setIdx(0)}>
              Start over
            </button>
          </>
        ) : (
          <>
            <p className="hint" style={{ marginBottom: 4 }}>Now hunting for</p>
            <div className="alpha-target">{target}</div>
            <button
              className="btn btn-green"
              style={{ width: '100%', marginTop: 12 }}
              onClick={() => setIdx((i) => i + 1)}
            >
              Spotted {target} →
            </button>
          </>
        )}
      </div>

      <div className="alpha-grid" aria-hidden="true">
        {LETTERS.map((L, i) => (
          <span
            key={L}
            className={`alpha-cell${i < idx ? ' got' : ''}${i === idx ? ' now' : ''}`}
          >
            {L}
          </span>
        ))}
      </div>

      {idx > 0 && !done && (
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setIdx((i) => Math.max(0, i - 1))}>
            Undo
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={() => confirm('Restart from A?') && setIdx(0)}
          >
            Restart
          </button>
        </div>
      )}
    </>
  )
}
