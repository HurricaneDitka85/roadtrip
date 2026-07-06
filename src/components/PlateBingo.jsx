import { usePersistentState } from '../lib/storage'
import { STATES } from '../data'

export default function PlateBingo() {
  const [spotted, setSpotted] = usePersistentState('rt.plates', [])

  const toggle = (abbr) =>
    setSpotted((s) => (s.includes(abbr) ? s.filter((x) => x !== abbr) : [...s, abbr]))

  const pct = Math.round((spotted.length / STATES.length) * 100)

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>License Plate Bingo</h2>
          <span className="odometer">
            {String(spotted.length).padStart(2, '0')}/{STATES.length}
          </span>
        </div>
        <div className="progress" aria-label={`${pct}% of plates spotted`}>
          <div style={{ width: `${pct}%` }} />
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          Tap a state when you spot its plate. Progress saves automatically — one running
          list for the whole summer.
        </p>
      </div>

      <div className="plate-grid">
        {STATES.map(([abbr, name]) => {
          const on = spotted.includes(abbr)
          return (
            <button
              key={abbr}
              className={`plate${on ? ' spotted' : ''}`}
              onClick={() => toggle(abbr)}
              aria-pressed={on}
            >
              <span className="abbr">{abbr}</span>
              {name}
            </button>
          )
        })}
      </div>

      {spotted.length > 0 && (
        <button
          className="btn btn-danger"
          style={{ marginTop: 14, width: '100%' }}
          onClick={() => {
            if (confirm('Clear all spotted plates?')) setSpotted([])
          }}
        >
          Reset the board
        </button>
      )}
    </>
  )
}
