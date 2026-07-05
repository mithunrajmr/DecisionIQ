/**
 * ActionSuggestions – displays 3 data-grounded next-action suggestions
 * returned by the explanation endpoint. Includes a disabled "Auto Execute" button
 * demonstrating future agent capability.
 */
export default function ActionSuggestions({ actions, scenarioName }) {
  if (!actions || actions.length === 0) return null

  const ACTION_ICONS = [
    // Icon 1: Refresh/Loop (Outlined)
    <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
    </svg>,
    // Icon 2: Clock (Outlined)
    <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // Icon 3: Search/Eye (Outlined)
    <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ]

  return (
    <div className="card animate-slide-up overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border-2 border-ink flex items-center
                            justify-center bg-amber-300"
                 style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-black text-ink">AI Suggested Next Actions</p>
              <p className="text-xs font-medium text-stone-400 mt-0.5">
                Based on {scenarioName} — grounded in your inventory data
              </p>
            </div>
          </div>
          {/* Future tag */}
          <span className="badge text-xs"
                style={{ color: '#92400e', borderColor: '#d97706', background: '#fef3c7' }}>
            AI-Generated
          </span>
        </div>

        {/* Action items */}
        <div className="space-y-3">
          {actions.map((action, i) => (
            <div key={i}
                 className="flex items-start gap-3 p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
              <div className="w-8 h-8 rounded-lg border-2 border-ink flex items-center
                              justify-center flex-shrink-0 bg-white"
                   style={{ boxShadow: '1px 1px 0 0 #0a0a0a' }}>
                {ACTION_ICONS[i] ?? '→'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-ink leading-snug">{action.action}</p>
                {action.product && (
                  <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md
                                   border-2 border-stone-200 bg-white text-stone-500">
                    {action.product}
                  </span>
                )}
                <p className="text-xs font-medium text-stone-400 mt-1.5 leading-relaxed">
                  {action.reason}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-stone-100 mt-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-stone-500 uppercase tracking-wide">
                Autonomous Execution
              </p>
              <p className="text-xs font-medium text-stone-400 mt-0.5">
                Future capability — actions will execute automatically when enabled.
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black
                         border-2 border-stone-200 bg-stone-100 text-stone-400
                         cursor-not-allowed select-none"
              title="Autonomous execution is not yet available"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Auto Execute
              <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-stone-200
                               text-stone-500 border border-stone-300">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
