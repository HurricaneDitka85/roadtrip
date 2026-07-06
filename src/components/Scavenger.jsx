import { usePersistentState } from '../lib/storage'
import { SCAVENGER } from '../data'

export default function Scavenger() {
  const [found, setFound] = usePersistentState('rt.scavenger', [])

  const toggle = (i) =>
    setFound((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]))

  const points = found.reduce((sum, i) => sum + SCAVENGER[i].pts, 0)
  const maxPts = SCAVENGER.reduce((s, x) => s + x.pts, 0)

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>Scavenger Hunt</h2>
          <span className="odometer">
            {points}/{maxPts} pts
          </span>
        </div>
        <div className="progress">
          <div style={{ width: `${(points / maxPts) * 100}%` }} />
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          First person to call it gets it. Rarer sights, bigger points.
        </p>
      </div>

      {SCAVENGER.map((item, i) => {
        const on = found.includes(i)
        return (
          <button
            key={i}
            className={`scav-item${on ? ' found' : ''}`}
            onClick={() => toggle(i)}
            aria-pressed={on}
          >
            <span aria-hidden="true">{on ? '✅' : '⬜️'}</span>
            <span className="label">{item.label}</span>
            <span className="pts">{item.pts} pts</span>
          </button>
        )
      })}

      {found.length > 0 && (
        <button
          className="btn btn-danger"
          style={{ marginTop: 10, width: '100%' }}
          onClick={() => confirm('Start a fresh hunt?') && setFound([])}
        >
          Reset hunt
        </button>
      )}
    </>
  )
}
