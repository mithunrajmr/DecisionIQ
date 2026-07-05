import { useState, useCallback } from 'react'

const STORAGE_KEY = 'decisioniq_history'

/**
 * useDecisionHistory – persists confirmed strategy decisions to localStorage.
 * Stores ALL entries (no slice). Display truncation handled in component.
 * 
 * Entry shape:
 *   id, timestamp, scenarioName, priority, score,
 *   weather, event, topProducts [{name, qty}], reason
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
      // Prevent duplicate consecutive entries
      if (prev.length > 0) {
        const latest = prev[0]
        if (latest.scenarioName === entry.scenarioName && latest.priority === entry.priority) {
          return prev
        }
      }
      const next = [
        {
          id:           Date.now(),
          timestamp:    new Date().toISOString(),
          scenarioName: entry.scenarioName,
          priority:     entry.priority,
          score:        entry.score,
          weather:      entry.weather   ?? null,
          event:        entry.event     ?? null,
          topProducts:  entry.topProducts ?? [],
          reason:       entry.reason    ?? null,
        },
        ...prev,
      ]
      // Keep all — no slice limit
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
