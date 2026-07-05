import { useState } from 'react'

const SCENARIO_COLORS = {
  'Conservative':   { bg: '#dbeafe', border: '#2563eb', text: '#1d4ed8' },
  'Aggressive':     { bg: '#ffedd5', border: '#ea580c', text: '#c2410c' },
  'AI Recommended': { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
}

function formatRelativeTime(isoString) {
  const diff  = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'Just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatWeather(weather) {
  if (!weather) return ''
  if (typeof weather === 'string') return weather
  if (typeof weather === 'object') {
    if (weather.condition && weather.temperature_c !== undefined) {
      return `${weather.condition} (${weather.temperature_c}°C)`
    }
    return weather.condition || ''
  }
  return String(weather)
}

function formatEvent(event) {
  if (!event) return ''
  if (typeof event === 'string') return event
  if (typeof event === 'object') {
    if (event.has_event) {
      return event.event_name || 'Event'
    }
    return 'None'
  }
  return String(event)
}

// ─────────────────────────────────────────────
// Detail Modal — shows full metadata for one entry
// ─────────────────────────────────────────────
function DetailModal({ entry, onClose }) {
  if (!entry) return null
  const colors = SCENARIO_COLORS[entry.scenarioName] ?? { bg: '#f5f5f4', border: '#a8a29e', text: '#57534e' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(10,10,10,0.55)' }}
         onClick={onClose}>
      <div className="bg-white border-2 border-ink rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
           style={{ boxShadow: '6px 6px 0 0 #0a0a0a' }}
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center"
                 style={{ background: colors.bg, boxShadow: '2px 2px 0 0 #0a0a0a' }}>
              <span className="text-sm">📋</span>
            </div>
            <div>
              <p className="font-black text-ink">{entry.scenarioName}</p>
              <p className="text-[10px] font-bold text-stone-400">{formatDateTime(entry.timestamp)}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-stone-200 flex items-center justify-center text-stone-400 hover:border-ink hover:text-ink transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
              <p className="text-[10px] font-black uppercase text-stone-400 mb-1">Fit Score</p>
              <p className="text-xl font-black text-ink">{Math.round(entry.score)}</p>
            </div>
            <div className="p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
              <p className="text-[10px] font-black uppercase text-stone-400 mb-1">Priority</p>
              <p className="text-xl font-black text-ink">{entry.priority}/100</p>
            </div>
          </div>

          {/* Context */}
          {(entry.weather || entry.event) && (
            <div>
              <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Decision Context</p>
              <div className="flex gap-2 flex-wrap">
                {entry.weather && (
                  <span className="px-2 py-1 rounded-lg border-2 border-blue-200 bg-blue-50 text-xs font-black text-blue-700">
                    🌦️ {formatWeather(entry.weather)}
                  </span>
                )}
                {entry.event && (
                  <span className="px-2 py-1 rounded-lg border-2 border-green-200 bg-green-50 text-xs font-black text-green-700">
                    🎪 {formatEvent(entry.event)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Top 3 products */}
          {entry.topProducts && entry.topProducts.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase text-stone-400 mb-2">Top Ordered Products</p>
              <div className="space-y-2">
                {entry.topProducts.map((p, idx) => (
                  <div key={p.name} className="flex items-center justify-between p-2.5 rounded-lg border-2 border-stone-100 bg-stone-50">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded border-2 border-ink flex items-center justify-center text-[10px] font-black bg-amber-300">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-ink">{p.name}</span>
                    </div>
                    <span className="text-xs font-black text-stone-500">{p.qty} units</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Reason */}
          {entry.reason && (
            <div>
              <p className="text-[10px] font-black uppercase text-stone-400 mb-2">AI Reasoning</p>
              <div className="p-3 rounded-xl border-2 border-brand-200 bg-blue-50">
                <p className="text-xs font-semibold text-stone-700 leading-relaxed">{entry.reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// View All Modal — shows complete history list
// ─────────────────────────────────────────────
function ViewAllModal({ history, onClose, onSelectEntry }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(10,10,10,0.55)' }}
         onClick={onClose}>
      <div className="bg-white border-2 border-ink rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
           style={{ boxShadow: '6px 6px 0 0 #0a0a0a' }}
           onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between p-5 border-b-2 border-stone-100 flex-shrink-0">
          <div>
            <p className="font-black text-ink">Complete Decision History</p>
            <p className="text-xs font-medium text-stone-400">{history.length} total decision{history.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-stone-200 flex items-center justify-center text-stone-400 hover:border-ink hover:text-ink transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-2">
          {history.map((entry, i) => {
            const colors = SCENARIO_COLORS[entry.scenarioName] ?? { bg: '#f5f5f4', border: '#a8a29e', text: '#57534e' }
            return (
              <button key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 bg-white hover:bg-stone-50 transition-colors"
                style={{ borderColor: i === 0 ? colors.border : '#e7e5e4' }}>
                <div className="w-7 h-7 rounded-lg border-2 border-ink flex items-center justify-center text-xs font-black flex-shrink-0"
                     style={{ background: colors.bg, color: colors.text, boxShadow: '1px 1px 0 0 #0a0a0a' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-ink truncate">{entry.scenarioName}</span>
                    <span className="badge text-xs" style={{ color: colors.text, borderColor: colors.border, background: colors.bg }}>
                      Score {Math.round(entry.score)}
                    </span>
                    {entry.weather && <span className="text-[9px] font-black text-blue-600 border border-blue-200 rounded px-1 bg-blue-50">🌦️ {formatWeather(entry.weather)}</span>}
                  </div>
                  <p className="text-xs font-medium text-stone-400 mt-0.5">
                    Priority {entry.priority}/100 · {formatDateTime(entry.timestamp)}
                  </p>
                </div>
                <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function DecisionHistory({ history, onClear }) {
  const [isOpen,       setIsOpen]       = useState(false)
  const [showAll,      setShowAll]      = useState(false)
  const [detailEntry,  setDetailEntry]  = useState(null)

  const displayed = history.slice(0, 5)

  return (
    <>
      <div className="card animate-slide-up overflow-hidden">
        {/* Toggle header */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors duration-150"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center bg-amber-300"
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
                  : `${history.length} decision${history.length !== 1 ? 's' : ''} saved · showing latest 5`}
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
            <svg className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Body */}
        <div className={`panel-enter ${isOpen ? 'panel-open' : ''}`}>
          <div className="px-5 pb-5 border-t-2 border-stone-100">

            {/* Empty */}
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

            {/* Latest 5 entries */}
            {history.length > 0 && (
              <div className="mt-4 space-y-2">
                {displayed.map((entry, i) => {
                  const colors = SCENARIO_COLORS[entry.scenarioName] ?? { bg: '#f5f5f4', border: '#a8a29e', text: '#57534e' }
                  return (
                    <button key={entry.id}
                      onClick={() => setDetailEntry(entry)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 bg-white hover:bg-stone-50 transition-colors"
                      style={{ borderColor: i === 0 ? colors.border : '#e7e5e4' }}>
                      <div className="w-7 h-7 rounded-lg border-2 border-ink flex items-center justify-center text-xs font-black flex-shrink-0"
                           style={{ background: colors.bg, color: colors.text, boxShadow: '1px 1px 0 0 #0a0a0a' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm text-ink">{entry.scenarioName}</span>
                          <span className="badge text-xs" style={{ color: colors.text, borderColor: colors.border, background: colors.bg }}>
                            Score {Math.round(entry.score)}
                          </span>
                          {entry.weather && (
                            <span className="text-[9px] font-black text-blue-600 border border-blue-200 rounded px-1 bg-blue-50">
                              🌦️ {formatWeather(entry.weather)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-stone-400 mt-0.5">
                          Priority {entry.priority}/100 · {formatRelativeTime(entry.timestamp)}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )
                })}

                {/* Footer actions */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex gap-2">
                    {history.length > 5 && (
                      <button
                        onClick={() => setShowAll(true)}
                        className="text-xs font-black text-brand-600 border-2 border-brand-200 hover:border-brand-500 px-3 py-1.5 rounded-lg transition-colors bg-blue-50 hover:bg-blue-100"
                      >
                        View All ({history.length})
                      </button>
                    )}
                  </div>
                  <button
                    onClick={onClear}
                    className="text-xs font-bold text-stone-400 hover:text-red-600 border-2 border-stone-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View All Modal */}
      {showAll && (
        <ViewAllModal
          history={history}
          onClose={() => setShowAll(false)}
          onSelectEntry={(entry) => { setShowAll(false); setDetailEntry(entry) }}
        />
      )}

      {/* Detail Modal */}
      {detailEntry && (
        <DetailModal
          entry={detailEntry}
          onClose={() => setDetailEntry(null)}
        />
      )}
    </>
  )
}
