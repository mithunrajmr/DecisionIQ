import { useState, useEffect, useCallback, useRef } from 'react'
import { generateScenarios } from '../services/decisionApi'

const DEBOUNCE_MS = 600

/**
 * useDashboard — manages all Dashboard state:
 *   priority slider, scenario fetching, scenario selection.
 *
 * Bug fix: selectedScenario is reset to null whenever the slider moves
 * (new fetch invalidates the previous selection).
 */
export function useDashboard(inventory, context) {
  const [priority, setPriority]         = useState(50)
  const [scenarios, setScenarios]       = useState([])
  const [loadingScenarios, setLoading]  = useState(false)
  const [scenarioError, setError]       = useState(null)
  const [selectedScenario, setSelected] = useState(null)

  const debounceRef = useRef(null)

  const fetchScenarios = useCallback(async (p) => {
    setLoading(true)
    setError(null)
    try {
      const result = await generateScenarios(p)
      // Sort by rank ascending (rank 1 first)
      const sorted = [...(result.scenarios || [])].sort((a, b) => a.rank - b.rank)
      setScenarios(sorted)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load scenarios. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch once inventory + context are ready
  useEffect(() => {
    if (inventory && context) {
      fetchScenarios(priority)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, context])

  // Debounced re-fetch on slider change; ALSO clear selection (avoids stale state)
  const handlePriorityChange = useCallback((value) => {
    setPriority(value)
    setSelected(null)   // ← fix: clear stale selection on every slider move
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchScenarios(value)
    }, DEBOUNCE_MS)
  }, [fetchScenarios])

  const handleSelectScenario = useCallback((name) => {
    setSelected(prev => prev === name ? null : name)
  }, [])

  return {
    priority,
    scenarios,
    loadingScenarios,
    scenarioError,
    selectedScenario,
    handlePriorityChange,
    handleSelectScenario,
  }
}
