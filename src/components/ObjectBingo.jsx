import { useEffect } from 'react'
import { usePersistentState } from '../lib/storage'
import { BINGO_ITEMS } from '../data'

const LINES = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
]

function makeCard() {
  const pool = [...BINGO_ITEMS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picks = pool.slice(0, 24)
  picks.splice(12, 0, 'FREE') // center free space
  return picks
}

export default function ObjectBingo() {
  const [card, setCard] = usePersistentState('rt.bingo.card', [])
  const [marked, setMarked] = usePersistentState('rt.bingo.marked', [12])

  // Generate a card on first ever load.
  useEffect(() => {
    if (card.length !== 25) {
      setCard(makeCard())
      setMarked([12])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (i) => {
    if (i === 12) return // free space stays
    setMarked((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))
  }

  const bingoLines = LINES.filter((ln) => ln.every((i) => marked.includes(i)))
  const hasBingo = bingoLines.length > 0
  const hotCells = new Set(bingoLines.flat())

  const newCard = () => {
    setCard(makeCard())
    setMarked([12])
  }

  if (card.length !== 25) return null

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Object Bingo</h2>
          <span className="odometer">{marked.length - 1} spotted</span>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          Spot something on your card and tap it. Get five in a row — across, down, or
          diagonal — and shout <strong>BINGO!</strong>
        </p>
      </div>

      {hasBingo && (
        <div className="card bingo-win">
          🎉 BINGO! {bingoLines.length > 1 ? `${bingoLines.length} lines!` : 'You got a line!'}
        </div>
      )}

      <div className="bingo-card">
        {card.map((label, i) => {
          const free = i === 12
          const on = marked.includes(i)
          return (
            <button
              key={i}
              className={`bingo-cell${on ? ' on' : ''}${free ? ' free' : ''}${
                hotCells.has(i) ? ' hot' : ''
              }`}
              onClick={() => toggle(i)}
              aria-pressed={on}
            >
              {free ? '★ FREE' : label}
            </button>
          )
        })}
      </div>

      <button className="btn btn-danger" style={{ width: '100%', marginTop: 14 }} onClick={() =>
        confirm('Deal a fresh card?') && newCard()
      }>
        New card
      </button>
    </>
  )
}
