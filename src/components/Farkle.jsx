import { useState } from 'react'
import { usePersistentState } from '../lib/storage'

const GOAL = 10000

export default function Farkle() {
  const [players, setPlayers] = usePersistentState('rt.farkle.players', [])
  const [history, setHistory] = usePersistentState('rt.farkle.history', [])
  const [newName, setNewName] = useState('')
  const [entry, setEntry] = useState({}) // playerId -> string
  const [showRef, setShowRef] = useState(false)

  const addPlayer = () => {
    const name = newName.trim()
    if (!name) return
    setPlayers((p) => [...p, { id: Date.now(), name, score: 0 }])
    setNewName('')
  }

  const bank = (id) => {
    const pts = parseInt(entry[id], 10)
    if (isNaN(pts)) return
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, score: p.score + pts } : p)))
    setHistory((h) => [...h, { id, pts }])
    setEntry((e) => ({ ...e, [id]: '' }))
  }

  const undo = () => {
    const last = history[history.length - 1]
    if (!last) return
    setPlayers((ps) =>
      ps.map((p) => (p.id === last.id ? { ...p, score: p.score - last.pts } : p))
    )
    setHistory((h) => h.slice(0, -1))
  }

  const removePlayer = (id) => {
    setPlayers((ps) => ps.filter((p) => p.id !== id))
    setHistory((h) => h.filter((x) => x.id !== id))
  }

  const top = Math.max(0, ...players.map((p) => p.score))
  const winner = players.find((p) => p.score >= GOAL)

  return (
    <>
      {winner && (
        <div className="card" style={{ background: 'var(--gold)', border: 'none' }}>
          <h2 style={{ marginBottom: 2 }}>🏆 {winner.name} wins!</h2>
          <p className="hint" style={{ color: 'var(--asphalt)' }}>
            First to {GOAL.toLocaleString()}. Everyone else gets one last turn — house
            rules apply.
          </p>
        </div>
      )}

      <div className="card">
        <h2>Farkle Scoreboard</h2>
        {players.length === 0 && (
          <p className="hint">Add players to start. First to 10,000 wins.</p>
        )}
        {players.map((p) => (
          <div key={p.id} className={`player-row${p.score === top && top > 0 ? ' leader' : ''}`}>
            <span className="player-name">{p.name}</span>
            <span className="odometer">{p.score.toLocaleString()}</span>
            <span className="row score-entry">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Turn pts"
                value={entry[p.id] ?? ''}
                onChange={(e) => setEntry((s) => ({ ...s, [p.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && bank(p.id)}
                aria-label={`Turn points for ${p.name}`}
              />
              <button className="btn btn-green" onClick={() => bank(p.id)}>
                Bank
              </button>
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => confirm(`Remove ${p.name}?`) && removePlayer(p.id)}
              aria-label={`Remove ${p.name}`}
            >
              ✕
            </button>
          </div>
        ))}

        <div className="row" style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="New player name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button className="btn btn-blue" onClick={addPlayer}>
            Add
          </button>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" onClick={undo} disabled={history.length === 0}>
            Undo last bank
          </button>
          <button
            className="btn btn-danger"
            disabled={players.length === 0}
            onClick={() =>
              confirm('Reset all scores to zero?') &&
              (setPlayers((ps) => ps.map((p) => ({ ...p, score: 0 }))), setHistory([]))
            }
          >
            New game
          </button>
        </div>
      </div>

      <div className="card">
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setShowRef(!showRef)}>
          {showRef ? 'Hide' : 'Show'} scoring reference
        </button>
        {showRef && (
          <table className="score-ref" style={{ marginTop: 10 }}>
            <tbody>
              <tr><td>Single 1</td><td>100</td></tr>
              <tr><td>Single 5</td><td>50</td></tr>
              <tr><td>Three 1s</td><td>1,000</td></tr>
              <tr><td>Three of a kind (2–6)</td><td>face × 100</td></tr>
              <tr><td>Four of a kind</td><td>1,000</td></tr>
              <tr><td>Five of a kind</td><td>2,000</td></tr>
              <tr><td>Six of a kind</td><td>3,000</td></tr>
              <tr><td>Straight 1–6</td><td>1,500</td></tr>
              <tr><td>Three pairs</td><td>1,500</td></tr>
              <tr><td>No scoring dice = Farkle</td><td>lose turn pts</td></tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
