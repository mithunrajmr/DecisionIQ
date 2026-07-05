import { useState, useEffect } from 'react'
import { fetchExplanation } from '../services/explanationApi'

/**
 * ExplanationPanel – expandable panel that fetches and shows Gemini's explanation
 * for the selected scenario. Grounded in BigQuery inventory data.
 */
export default function ExplanationPanel({ selectedScenario, priority }) {
  const [isOpen, setIsOpen]       = useState(false)
  const [explanation, setExp]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [lastFetched, setFetched] = useState(null)   // scenario name of last fetch

  // Auto-open when a scenario is chosen for the first time
  useEffect(() => {
    if (selectedScenario && !isOpen) setIsOpen(true)
  }, [selectedScenario])  // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch explanation when panel opens or scenario / priority changes
  useEffect(() => {
    if (!isOpen || !selectedScenario) return
    if (lastFetched === `${selectedScenario}-${priority}`) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchExplanation(selectedScenario, priority)
        setExp(result.explanation || '')
        setFetched(`${selectedScenario}-${priority}`)
      } catch {
        setError('Unable to load explanation. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, selectedScenario, priority])  // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => setIsOpen(o => !o)

  return (
    <div className="card border border-brand-100 animate-slide-up overflow-hidden">
      {/* Header / toggle */}
      <button
        id="explanation-panel-toggle"
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 hover:bg-brand-50/40
                   transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700
                          flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25
                   12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5
                   0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-slate-800">
              AI Explanation
              {selectedScenario && (
                <span className="ml-2 text-brand-600 font-normal text-sm">
                  — {selectedScenario}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Why Gemini recommends this strategy, grounded in your inventory data
            </p>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300
            ${isOpen ? 'rotate-180' : ''} group-hover:text-brand-500`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable body */}
      <div className={`panel-enter ${isOpen ? 'panel-open' : ''}`}>
        <div className="px-5 pb-6 border-t border-slate-100">

          {/* No scenario chosen yet */}
          {!selectedScenario && (
            <div className="py-8 text-center">
              <span className="text-4xl">👆</span>
              <p className="text-sm text-slate-400 mt-3">
                Select a strategy card above to see Gemini's explanation.
              </p>
            </div>
          )}

          {/* Loading */}
          {selectedScenario && loading && (
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 text-brand-600 text-sm font-medium mb-4 mt-3">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
                       0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0
                       0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Gemini is analysing your inventory data…
              </div>
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          )}

          {/* Error */}
          {selectedScenario && !loading && error && (
            <div className="py-4">
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
              <button
                onClick={() => setFetched(null)}
                className="mt-3 text-xs text-brand-600 underline hover:text-brand-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {selectedScenario && !loading && !error && explanation && (
            <div className="mt-4 animate-fade-in">
              {/* Data source badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="badge bg-accent-100 text-accent-700 text-xs">
                  📊 Grounded in BigQuery data
                </span>
                <span className="badge bg-brand-50 text-brand-600 border border-brand-100 text-xs">
                  ✨ Gemini 2.5 Flash
                </span>
              </div>

              {/* Explanation paragraphs – handles \n\n prose and \n bullet lines */}
              <div className="space-y-3">
                {explanation.split('\n\n').map((block, i) => {
                  if (!block.trim()) return null
                  const lines = block.split('\n').filter(l => l.trim())
                  const isBulletBlock = lines.every(l => l.trim().startsWith('-'))
                  if (isBulletBlock) {
                    return (
                      <ul key={i} className="space-y-1.5 pl-1">
                        {lines.map((line, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-brand-400 mt-1 flex-shrink-0">•</span>
                            <span dangerouslySetInnerHTML={{
                              __html: line.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                         .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 rounded text-xs font-mono">$1</code>')
                            }} />
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={i} className="text-sm text-slate-600 leading-relaxed"
                       dangerouslySetInnerHTML={{
                         __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 rounded text-xs font-mono">$1</code>')
                                      .replace(/\n/g, ' ')
                       }}
                    />
                  )
                })}
              </div>

              {/* Disclaimer */}
              <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-slate-50
                              border border-slate-100">
                <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75
                       0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-xs text-slate-400">
                  All figures cited above are derived directly from your BigQuery inventory table.
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
