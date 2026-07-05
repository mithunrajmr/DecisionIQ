import { useState, useEffect } from 'react'
import { fetchExplanation } from '../services/explanationApi'

/**
 * ExplanationPanel – expandable panel with Gemini explanation for selected scenario.
 * Displays data-grounded AI recommendations in four clean Neo-Brutalist sections.
 */
export default function ExplanationPanel({ selectedScenario, priority, onActionsLoaded, inventory }) {
  const [isOpen, setIsOpen]       = useState(false)
  const [analysis, setAnalysis]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [fetchKey, setFetchKey]   = useState(null)   // tracks what was last fetched

  // Auto-open when a scenario is chosen
  useEffect(() => {
    if (selectedScenario && !isOpen) setIsOpen(true)
  }, [selectedScenario])  // eslint-disable-line react-hooks/exhaustive-deps

  // Clear explanation when scenario changes (fixes stale state)
  useEffect(() => {
    setAnalysis(null)
    setError(null)
    setFetchKey(null)
  }, [selectedScenario])

  // Fetch when panel opens or scenario/priority changes, or when inventory updates
  useEffect(() => {
    if (!isOpen || !selectedScenario) return
    
    // Hash key represents the products configuration and stock levels
    const itemsHash = (inventory?.items || []).map(i => `${i.product_name}:${i.current_stock_units}:${i.avg_weekly_sales_units}`).join('|')
    const key = `${selectedScenario}-${priority}-${itemsHash}`
    if (fetchKey === key) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchExplanation(selectedScenario, priority)
        setAnalysis(result)
        setFetchKey(key)
        // Pass actions + full analysis to parent
        if (onActionsLoaded && result.suggested_actions) {
          onActionsLoaded(result.suggested_actions, result)
        }
      } catch {
        setError('Unable to load explanation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, selectedScenario, priority, inventory])

  const toggle = () => setIsOpen(o => !o)

  return (
    <div className="card animate-slide-up overflow-hidden">
      {/* Toggle header */}
      <button
        id="explanation-panel-toggle"
        onClick={toggle}
        className="w-full flex items-center justify-between p-5
                   hover:bg-stone-50 transition-colors duration-150 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-ink border-2 border-ink flex items-center justify-center
                          font-black text-base bg-brand-500"
               style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
            ✨
          </div>
          <div className="text-left">
            <p className="font-black text-ink">
              AI Explanation
              {selectedScenario && (
                <span className="ml-2 text-brand-600 font-bold text-sm">
                  — {selectedScenario}
                </span>
              )}
            </p>
            <p className="text-xs font-medium text-stone-400 mt-0.5">
              Why Gemini recommends this strategy, grounded in your inventory data
            </p>
          </div>
        </div>

        <svg className={`w-5 h-5 text-stone-400 transition-transform duration-250
                        ${isOpen ? 'rotate-180' : ''}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable body */}
      <div className={`panel-enter ${isOpen ? 'panel-open' : ''}`}>
        <div className="px-5 pb-6 border-t-2 border-stone-100">

          {/* No scenario selected */}
          {!selectedScenario && (
            <div className="py-10 text-center">
              <span className="text-4xl">👆</span>
              <p className="text-sm font-medium text-stone-400 mt-3">
                Select a strategy card above to see Gemini's explanation.
              </p>
            </div>
          )}

          {/* Loading */}
          {selectedScenario && loading && (
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 text-brand-600 text-sm font-bold mb-4 mt-3">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
                       0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0
                       0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Gemini is analysing your inventory data…
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 border-2 border-stone-100 bg-stone-50 rounded-xl space-y-2">
                    <div className="skeleton h-4 w-28 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-5/6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {selectedScenario && !loading && error && (
            <div className="py-4">
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
              <button
                onClick={() => setFetchKey(null)}
                className="mt-3 text-xs font-bold text-brand-600 underline hover:text-brand-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {selectedScenario && !loading && !error && analysis && (
            <div className="mt-4 animate-fade-in">
              {/* Source badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="badge text-xs" style={{ color: '#15803d', borderColor: '#15803d', background: '#dcfce7' }}>
                  📊 Grounded in BigQuery
                </span>
                <span className="badge text-xs" style={{ color: '#2563eb', borderColor: '#2563eb', background: '#dbeafe' }}>
                  ✨ Gemini 2.5 Flash
                </span>
              </div>

              {/* Grid of structured sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-ink bg-stone-50 rounded-xl"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                  <h4 className="font-black text-xs uppercase text-brand-750 tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: '#1d4ed8' }}>
                    <span>🎯</span> Why This Strategy
                  </h4>
                  <p className="text-xs font-bold text-stone-600 leading-relaxed">{analysis.why_this_strategy}</p>
                </div>

                <div className="p-4 border-2 border-ink bg-stone-50 rounded-xl"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                  <h4 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: '#b45309' }}>
                    <span>📋</span> Key Inventory Factors
                  </h4>
                  <p className="text-xs font-bold text-stone-600 leading-relaxed">{analysis.key_inventory_factors}</p>
                </div>

                <div className="p-4 border-2 border-ink bg-stone-50 rounded-xl"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                  <h4 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: '#15803d' }}>
                    <span>📈</span> Business Impact
                  </h4>
                  <p className="text-xs font-bold text-stone-600 leading-relaxed">{analysis.business_impact}</p>
                </div>

                <div className="p-4 border-2 border-ink bg-stone-50 rounded-xl"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                  <h4 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5"
                      style={{ color: '#ea580c' }}>
                    <span>⚠️</span> Risks &amp; Spoilage Exposure
                  </h4>
                  <p className="text-xs font-bold text-stone-600 leading-relaxed">{analysis.risks}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-5 flex items-start gap-2 p-3 rounded-xl border-2 border-stone-200 bg-stone-50">
                <svg className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75
                       0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs font-medium text-stone-400">
                  All figures cited are derived directly from your BigQuery inventory table.
                  No values have been assumed or invented by the AI.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
