import { useEffect, useState } from 'react'

/**
 * useState that survives page reloads via localStorage.
 * Safe against corrupt/missing values.
 */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — app still works for the session
    }
  }, [key, value])

  return [value, setValue]
}
