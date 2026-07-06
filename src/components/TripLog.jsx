import { useState } from 'react'
import { usePersistentState } from '../lib/storage'

export default function TripLog() {
  const [stops, setStops] = usePersistentState('rt.stops', [])
  const [expenses, setExpenses] = usePersistentState('rt.expenses', [])
  const [odo, setOdo] = usePersistentState('rt.odo', { start: '', current: '' })

  const [stopName, setStopName] = useState('')
  const [expDesc, setExpDesc] = useState('')
  const [expAmt, setExpAmt] = useState('')

  const addStop = () => {
    const name = stopName.trim()
    if (!name) return
    setStops((s) => [
      ...s,
      { id: Date.now(), name, at: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) },
    ])
    setStopName('')
  }

  const addExpense = () => {
    const amt = parseFloat(expAmt)
    if (!expDesc.trim() || isNaN(amt)) return
    setExpenses((e) => [...e, { id: Date.now(), desc: expDesc.trim(), amt }])
    setExpDesc('')
    setExpAmt('')
  }

  const miles =
    odo.start !== '' && odo.current !== ''
      ? Math.max(0, Number(odo.current) - Number(odo.start))
      : null
  const spent = expenses.reduce((s, e) => s + e.amt, 0)

  return (
    <>
      <div className="stat-strip">
        <div className="stat">
          <div className="v">{miles !== null ? miles.toLocaleString() : '——'}</div>
          <div className="l">Miles</div>
        </div>
        <div className="stat">
          <div className="v">{stops.length}</div>
          <div className="l">Stops</div>
        </div>
        <div className="stat">
          <div className="v">${spent.toFixed(0)}</div>
          <div className="l">Spent</div>
        </div>
      </div>

      <div className="card">
        <h2>Odometer</h2>
        <div className="row">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Start"
            value={odo.start}
            onChange={(e) => setOdo({ ...odo, start: e.target.value })}
            aria-label="Odometer at start"
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Current"
            value={odo.current}
            onChange={(e) => setOdo({ ...odo, current: e.target.value })}
            aria-label="Odometer now"
          />
        </div>
      </div>

      <div className="card">
        <h2>Stops</h2>
        {stops.length === 0 && <p className="hint">Log rest stops, diners, and detours worth remembering.</p>}
        {stops.map((s) => (
          <div key={s.id} className="log-item">
            <strong>{s.name}</strong>
            <div className="meta">{s.at}</div>
          </div>
        ))}
        <div className="row" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Where'd you stop?"
            value={stopName}
            onChange={(e) => setStopName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addStop()}
          />
          <button className="btn btn-green" onClick={addStop}>
            Log
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Expenses</h2>
        {expenses.map((e) => (
          <div key={e.id} className="log-item row" style={{ justifyContent: 'space-between' }}>
            <span>{e.desc}</span>
            <span className="odometer">${e.amt.toFixed(2)}</span>
          </div>
        ))}
        <div className="row" style={{ marginTop: 10 }}>
          <input
            type="text"
            placeholder="Gas, snacks…"
            value={expDesc}
            onChange={(e) => setExpDesc(e.target.value)}
          />
          <input
            type="number"
            inputMode="decimal"
            placeholder="$"
            style={{ maxWidth: 100 }}
            value={expAmt}
            onChange={(e) => setExpAmt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExpense()}
          />
          <button className="btn btn-blue" onClick={addExpense}>
            Add
          </button>
        </div>
      </div>

      {(stops.length > 0 || expenses.length > 0) && (
        <button
          className="btn btn-danger"
          style={{ width: '100%' }}
          onClick={() => {
            if (confirm('Clear stops, expenses, and odometer for a new trip?')) {
              setStops([])
              setExpenses([])
              setOdo({ start: '', current: '' })
            }
          }}
        >
          Start a new trip
        </button>
      )}
    </>
  )
}
