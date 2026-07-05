import { useState, useEffect, useCallback, useRef } from 'react'
import { generateScenarios } from '../services/decisionApi'

const DEBOUNCE_MS = 600

/**
 * useDashboard — manages all Dashboard state:
 *   inventory, context, priority slider, scenarios, explanation visibility.
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
      // Sort by rank ascending so rank-1 is first
      const sorted = [...(result.scenarios || [])].sort((a, b) => a.rank - b.rank)
      setScenarios(sorted)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load scenarios. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load and whenever inventory/context are ready
  useEffect(() => {
    if (inventory && context) {
      fetchScenarios(priority)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, context])

  // Debounced re-fetch on slider change
  const handlePriorityChange = useCallback((value) => {
    setPriority(value)
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
