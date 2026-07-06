import { useMemo, useState } from 'react'
import { MADLIBS } from '../data'

function fill(text, words) {
  return text.replace(/%(\d+)/g, (_, n) => words[n - 1] || `____`)
}

export default function MadLibs() {
  const [storyIdx, setStoryIdx] = useState(0)
  const story = MADLIBS[storyIdx]
  const [words, setWords] = useState({})
  const [revealed, setRevealed] = useState(false)

  const filledCount = story.blanks.filter((_, i) => (words[i] || '').trim()).length
  const ready = filledCount === story.blanks.length

  const finalText = useMemo(
    () => (revealed ? fill(story.text, story.blanks.map((_, i) => words[i])) : ''),
    [revealed, story, words]
  )

  const reset = (nextIdx = storyIdx) => {
    setStoryIdx(nextIdx)
    setWords({})
    setRevealed(false)
  }

  const nextStory = () => reset((storyIdx + 1) % MADLIBS.length)

  return (
    <>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Mad Libs</h2>
          <span className="odometer">
            {filledCount}/{story.blanks.length}
          </span>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          One person asks for each word <em>without</em> showing the story. Fill them all in,
          then read the silly result out loud.
        </p>
        <div className="row" style={{ marginTop: 10 }}>
          <strong style={{ flex: 1 }}>{story.title}</strong>
          <button className="btn btn-ghost" onClick={nextStory}>
            Different story →
          </button>
        </div>
      </div>

      {!revealed ? (
        <div className="card">
          {story.blanks.map((label, i) => (
            <label key={i} className="madlib-field">
              <span className="madlib-label">{label}</span>
              <input
                type="text"
                placeholder={`a ${label}…`}
                value={words[i] || ''}
                onChange={(e) => setWords((w) => ({ ...w, [i]: e.target.value }))}
              />
            </label>
          ))}
          <button
            className="btn btn-green"
            style={{ width: '100%', marginTop: 6 }}
            disabled={!ready}
            onClick={() => setRevealed(true)}
          >
            {ready ? 'Tell the story!' : `Fill in ${story.blanks.length - filledCount} more`}
          </button>
        </div>
      ) : (
        <div className="card">
          <p className="madlib-story">{finalText}</p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setRevealed(false)}>
              Edit words
            </button>
            <button className="btn btn-green" style={{ flex: 1 }} onClick={() => reset()}>
              New words
            </button>
          </div>
        </div>
      )}
    </>
  )
}
