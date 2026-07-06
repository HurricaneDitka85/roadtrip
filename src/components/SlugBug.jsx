import { useState } from 'react'
import { usePersistentState } from '../lib/storage'

export default function SlugBug() {
  const [players, setPlayers] = usePersistentState('rt.slugbug', [])
  const [newName, setNewName] = useState('')

  const addPlayer = () => {
    const name = newName.trim()
    if (!name) return
    setPlayers((p) => [...p, { id: Date.now(), name, count: 0 }])
    setNewName('')
  }

  const bump = (id, d) =>
    setPlayers((ps) =>
      ps.map((p) => (p.id === id ? { ...p, count: Math.max(0, p.count + d) } : p))
    )

  const removePlayer = (id) => setPlayers((ps) => ps.filter((p) => p.id !== id))

  const top = Math.max(0, ...players.map((p) => p.count))

  return (
    <>
      <div className="card">
        <h2>Slug Bug Counter</h2>
        <p className="hint">
          Spot a VW Beetle? Tap your button and call it — “Slug Bug, no bug-backs!” One point
          each. (House rule: Padiddles — a car with one headlight at night — count too.)
        </p>
      </div>

      {players.length === 0 && (
        <div className="card">
          <p className="hint">Add each player to start keeping score.</p>
        </div>
      )}

      {players.map((p) => (
        <div key={p.id} className={`bug-row${p.count === top && top > 0 ? ' leader' : ''}`}>
          <button
            className="bug-minus"
            onClick={() => bump(p.id, -1)}
            aria-label={`Subtract one from ${p.name}`}
          >
            −
          </button>
          <div className="bug-info">
            <div className="bug-name">{p.name}</div>
            <div className="bug-count">{p.count}</div>
          </div>
          <button
            className="bug-plus"
            onClick={() => bump(p.id, 1)}
            aria-label={`Add one for ${p.name}`}
          >
            🐞 +1
          </button>
          <button
            className="btn btn-ghost bug-remove"
            onClick={() => confirm(`Remove ${p.name}?`) && removePlayer(p.id)}
            aria-label={`Remove ${p.name}`}
          >
            ✕
          </button>
        </div>
      ))}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row">
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
        {players.length > 0 && (
          <button
            className="btn btn-danger"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() =>
              confirm('Reset everyone to zero?') &&
              setPlayers((ps) => ps.map((p) => ({ ...p, count: 0 })))
            }
          >
            Reset all counts
          </button>
        )}
      </div>
    </>
  )
}
