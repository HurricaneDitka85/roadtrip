import { useState } from 'react'
import { usePersistentState } from '../lib/storage'

export default function GuessArrival() {
  const [players, setPlayers] = usePersistentState('rt.guess.players', [])
  const [actual, setActual] = usePersistentState('rt.guess.actual', '')
  const [newName, setNewName] = useState('')

  const addPlayer = () => {
    const name = newName.trim()
    if (!name) return
    setPlayers((p) => [...p, { id: Date.now(), name, guess: '' }])
    setNewName('')
  }

  const setGuess = (id, guess) =>
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, guess } : p)))

  const removePlayer = (id) => setPlayers((ps) => ps.filter((p) => p.id !== id))

  const actualNum = actual === '' ? null : Number(actual)
  const guessed = players.filter((p) => p.guess !== '' && !isNaN(Number(p.guess)))

  // Rank once the actual number is in.
  const ranked =
    actualNum !== null
      ? [...guessed]
          .map((p) => ({ ...p, diff: Math.abs(Number(p.guess) - actualNum) }))
          .sort((a, b) => a.diff - b.diff)
      : []
  const bestDiff = ranked.length ? ranked[0].diff : null

  return (
    <>
      <div className="card">
        <h2>Guess the Arrival</h2>
        <p className="hint">
          Before the next big leg, everyone guesses the <strong>final odometer reading</strong>{' '}
          (or arrival time as 24-hour, like 1530). Closest guess wins bragging rights.
        </p>
      </div>

      <div className="card">
        <h2>Players &amp; guesses</h2>
        {players.length === 0 && <p className="hint">Add each guesser below.</p>}
        {players.map((p) => {
          const isWinner = actualNum !== null && bestDiff !== null &&
            p.guess !== '' && Math.abs(Number(p.guess) - actualNum) === bestDiff
          return (
            <div key={p.id} className={`player-row${isWinner ? ' leader' : ''}`}>
              <span className="player-name">{p.name}</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Guess"
                style={{ maxWidth: 120 }}
                value={p.guess}
                onChange={(e) => setGuess(p.id, e.target.value)}
                aria-label={`Guess for ${p.name}`}
              />
              <button
                className="btn btn-ghost"
                onClick={() => confirm(`Remove ${p.name}?`) && removePlayer(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                ✕
              </button>
            </div>
          )
        })}
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
      </div>

      <div className="card">
        <h2>The actual number</h2>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Enter it when you arrive"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          aria-label="Actual arrival number"
        />

        {actualNum !== null && ranked.length > 0 && (
          <div className="guess-results">
            {ranked.map((p, i) => {
              const isWin = p.diff === bestDiff
              return (
                <div key={p.id} className={`guess-result${isWin ? ' win' : ''}`}>
                  <span>{isWin ? '🏆 ' : `${i + 1}. `}{p.name}</span>
                  <span className="hint" style={{ margin: 0 }}>
                    guessed {p.guess} · off by {p.diff}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {(players.length > 0 || actual !== '') && (
        <button
          className="btn btn-danger"
          style={{ width: '100%' }}
          onClick={() => {
            if (confirm('Clear players and start a new guess?')) {
              setPlayers([])
              setActual('')
            }
          }}
        >
          New round
        </button>
      )}
    </>
  )
}
