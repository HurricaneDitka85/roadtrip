import { usePersistentState } from './lib/storage'
import PlateBingo from './components/PlateBingo'
import Farkle from './components/Farkle'
import Trivia from './components/Trivia'
import Scavenger from './components/Scavenger'
import TripLog from './components/TripLog'

const TABS = [
  { id: 'plates', label: 'Plates', glyph: '🚗', el: <PlateBingo /> },
  { id: 'farkle', label: 'Farkle', glyph: '🎲', el: <Farkle /> },
  { id: 'trivia', label: 'Trivia', glyph: '❓', el: <Trivia /> },
  { id: 'hunt', label: 'Hunt', glyph: '🔭', el: <Scavenger /> },
  { id: 'trip', label: 'Trip', glyph: '🗺️', el: <TripLog /> },
]

export default function App() {
  const [tab, setTab] = usePersistentState('rt.tab', 'plates')
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]

  return (
    <div className="app">
      <header className="guide-sign">
        <h1>Road Trip HQ</h1>
        <div className="sub">Next services: fun · 0 miles</div>
      </header>

      <main>{active.el}</main>

      <nav className="roadbar" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === active.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
            aria-current={t.id === active.id ? 'page' : undefined}
          >
            <span className="glyph" aria-hidden="true">
              {t.glyph}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
