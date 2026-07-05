import { useState } from 'react'

const SCENARIO_COLORS = {
  'Conservative':   { bg: '#dbeafe', border: '#2563eb', text: '#1d4ed8' },
  'Aggressive':     { bg: '#ffedd5', border: '#ea580c', text: '#c2410c' },
  'AI Recommended': { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
}

function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'Just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

/**
 * DecisionHistory – collapsible panel showing last 5 confirmed decisions.
 */
export default function DecisionHistory({ history, onClear }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="card animate-slide-up overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between p-5
                   hover:bg-stone-50 transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center
                          bg-amber-300"
               style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
            <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-black text-ink">Decision History</p>
            <p className="text-xs font-medium text-stone-400 mt-0.5">
              {history.length === 0
                ? 'No confirmed decisions yet'
                : `${history.length} of 5 decision${history.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg border-2 border-ink text-xs font-black bg-amber-300"
                  style={{ boxShadow: '1px 1px 0 0 #0a0a0a' }}>
              {history.length}
            </span>
          )}
          <svg className={`w-5 h-5 text-stone-400 transition-transform duration-200
                          ${isOpen ? 'rotate-180' : ''}`}
               fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Body */}
      <div className={`panel-enter ${isOpen ? 'panel-open' : ''}`}>
        <div className="px-5 pb-5 border-t-2 border-stone-100">

          {/* Empty state */}
          {history.length === 0 && (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl border-2 border-stone-200 bg-stone-50 flex items-center justify-center text-stone-400 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm font-bold text-stone-400">No decisions confirmed yet.</p>
              <p className="text-xs font-medium text-stone-350 mt-1">
                Select a strategy and click <strong>Confirm</strong> to save it here.
              </p>
            </div>
          )}

          {/* Decision timeline */}
          {history.length > 0 && (
            <div className="mt-4 space-y-3">
              {history.map((entry, i) => {
                const colors = SCENARIO_COLORS[entry.scenarioName] ?? {
                  bg: '#f5f5f4', border: '#a8a29e', text: '#57534e'
                }
                return (
                  <div key={entry.id}
                       className="flex items-center gap-3 p-3 rounded-xl border-2 bg-white"
                       style={{ borderColor: i === 0 ? colors.border : '#e7e5e4' }}>

                    {/* Index dot */}
                    <div className="w-7 h-7 rounded-lg border-2 border-ink flex items-center
                                    justify-center text-xs font-black flex-shrink-0"
                         style={{ background: colors.bg, color: colors.text,
                                  boxShadow: '1px 1px 0 0 #0a0a0a' }}>
                      {i + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-ink truncate">
                          {entry.scenarioName}
                        </span>
                        <span className="badge text-xs"
                              style={{ color: colors.text, borderColor: colors.border,
                                       background: colors.bg }}>
                          Score {Math.round(entry.score)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-stone-400 mt-0.5">
                        Priority {entry.priority}/100 · {formatRelativeTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Clear button */}
              <div className="pt-2">
                <button
                  onClick={onClear}
                  className="text-xs font-bold text-stone-400 hover:text-red-600
                             border-2 border-stone-200 hover:border-red-300
                             px-3 py-1.5 rounded-lg transition-colors duration-150"
                >
                  Clear History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
