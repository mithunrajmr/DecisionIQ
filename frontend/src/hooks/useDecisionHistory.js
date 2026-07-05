import { useState, useCallback } from 'react'

const STORAGE_KEY = 'decisioniq_history'
const MAX_ENTRIES = 5

/**
 * useDecisionHistory – persists confirmed strategy decisions to localStorage.
 * Keeps only the latest MAX_ENTRIES decisions.
 */
export function useDecisionHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const addEntry = useCallback((entry) => {
    setHistory(prev => {
      const next = [
        {
          id:           Date.now(),
          timestamp:    new Date().toISOString(),
          scenarioName: entry.scenarioName,
          priority:     entry.priority,
          score:        entry.score,
        },
        ...prev,
      ].slice(0, MAX_ENTRIES)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { history, addEntry, clearHistory }
}
