import { usePersistentState } from './lib/storage'
import PlateBingo from './components/PlateBingo'
import Alphabet from './components/Alphabet'
import ObjectBingo from './components/ObjectBingo'
import SlugBug from './components/SlugBug'
import Scavenger from './components/Scavenger'
import Trivia from './components/Trivia'
import WouldYouRather from './components/WouldYouRather'
import MadLibs from './components/MadLibs'
import Farkle from './components/Farkle'
import TicTacToe from './components/TicTacToe'
import GuessArrival from './components/GuessArrival'
import TripLog from './components/TripLog'

const TABS = [
  { id: 'plates', label: 'Plates', glyph: '🚗', el: <PlateBingo /> },
  { id: 'alphabet', label: 'A–Z', glyph: '🔤', el: <Alphabet /> },
  { id: 'bingo', label: 'Bingo', glyph: '🎱', el: <ObjectBingo /> },
  { id: 'slugbug', label: 'Slug Bug', glyph: '🐞', el: <SlugBug /> },
  { id: 'hunt', label: 'Hunt', glyph: '🔭', el: <Scavenger /> },
  { id: 'trivia', label: 'Trivia', glyph: '❓', el: <Trivia /> },
  { id: 'wyr', label: 'Rather', glyph: '🤔', el: <WouldYouRather /> },
  { id: 'madlibs', label: 'Mad Libs', glyph: '📝', el: <MadLibs /> },
  { id: 'farkle', label: 'Farkle', glyph: '🎲', el: <Farkle /> },
  { id: 'ttt', label: 'Tic-Tac', glyph: '⭕', el: <TicTacToe /> },
  { id: 'guess', label: 'Guess', glyph: '🎯', el: <GuessArrival /> },
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
