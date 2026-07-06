import { usePersistentState } from '../lib/storage'
import { STATES, PLATE_THEMES } from '../data'

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
          Plates start greyed out. Tap one when you spot it on the road and it lights up in
          its real colors. One running board for the whole summer.
        </p>
      </div>

      <div className="plate-grid">
        {STATES.map(([abbr, name]) => {
          const on = spotted.includes(abbr)
          const t =
            PLATE_THEMES[abbr] || { bg: '#fff', name: '#1a1a1a', num: '#1a1a1a', slogan: '' }
          return (
            <button
              key={abbr}
              className={`plate ${on ? 'spotted' : 'todo'}`}
              onClick={() => toggle(abbr)}
              aria-pressed={on}
              aria-label={`${name}${on ? ' — spotted' : ''}`}
              style={{ '--pbg': t.bg, '--pname': t.name, '--pnum': t.num }}
            >
              <span className="plate-bolt" aria-hidden="true" />
              <span className="plate-bolt r" aria-hidden="true" />
              {t.icon && (
                <span className="plate-icon" aria-hidden="true">
                  {t.icon}
                </span>
              )}
              <span className="plate-state">{name}</span>
              <span className="plate-num">{abbr}</span>
              {t.slogan && <span className="plate-slogan">{t.slogan}</span>}
              {on && (
                <span className="plate-check" aria-hidden="true">
                  ✓
                </span>
              )}
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
