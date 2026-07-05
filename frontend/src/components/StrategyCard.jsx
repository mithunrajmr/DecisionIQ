/**
 * StrategyCard – displays one purchasing scenario.
 * onConfirm is called when the user confirms (saves to history).
 */

const CARD_CONFIG = {
  'Conservative': {
    icon:      '🛡️',
    accentBg:  '#dbeafe',
    accentBorder: '#2563eb',
    scoreColor: '#1d4ed8',
    barColor:  '#2563eb',
    rankBg:    '#0a0a0a',
    rankText:  '#ffffff',
  },
  'Aggressive': {
    icon:      '🚀',
    accentBg:  '#ffedd5',
    accentBorder: '#ea580c',
    scoreColor: '#c2410c',
    barColor:  '#f97316',
    rankBg:    '#ea580c',
    rankText:  '#ffffff',
  },
  'AI Recommended': {
    icon:      '✨',
    accentBg:  '#dcfce7',
    accentBorder: '#16a34a',
    scoreColor: '#15803d',
    barColor:  '#22c55e',
    rankBg:    '#2563eb',
    rankText:  '#ffffff',
  },
}

const DEFAULT_CFG = {
  icon: '📋',
  accentBg: '#f5f5f4',
  accentBorder: '#a8a29e',
  scoreColor: '#57534e',
  barColor: '#a8a29e',
  rankBg: '#0a0a0a',
  rankText: '#ffffff',
}

export default function StrategyCard({ scenario, isSelected, onSelect, onConfirm, priority = 50, isConfirmed = false }) {
  if (!scenario) return null

  const cfg = CARD_CONFIG[scenario.name] ?? DEFAULT_CFG
  const isRecommended = scenario.name === 'AI Recommended'
  const topOrder = Object.entries(scenario.suggested_order || {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  const handleConfirm = (e) => {
    e.stopPropagation()
    if (onConfirm && !isConfirmed) onConfirm(scenario)
  }

  // Dynamic explanation of ranking compared to other strategies
  const getRankingReason = (name, rank, p) => {
    if (rank === 1) {
      if (p < 40) return "🏆 Ranked #1: Strongest protection against inventory waste & spoilage."
      if (p > 60) return "🏆 Ranked #1: Maximizes revenue capture for weather & event demand."
      return "🏆 Ranked #1: Optimal balanced trade-off between profit & waste."
    }
    if (name === 'Conservative') {
      return `Ranked #${rank}: Safer from spoilage but risks stockouts on high-demand lines.`
    }
    if (name === 'Aggressive') {
      return `Ranked #${rank}: Higher revenue upside but carries high shelf-life risk.`
    }
    return `Ranked #${rank}: Balanced alternative configuration.`
  }

  // Fit metric based on score range
  const fitMetric = scenario.score >= 80 ? 'Optimal' : scenario.score >= 65 ? 'High' : 'Moderate'
  const fitColor = scenario.score >= 80 ? '#15803d' : scenario.score >= 65 ? '#1d4ed8' : '#78716c'

  return (
    <div
      className="scenario-card cursor-pointer"
      style={{
        background: '#ffffff',
        border: isSelected ? `2px solid ${cfg.accentBorder}` : '2px solid #0a0a0a',
        borderRadius: '14px',
        boxShadow: isSelected
          ? `4px 4px 0 0 ${cfg.accentBorder}`
          : '3px 3px 0 0 #0a0a0a',
        transform: isSelected ? 'translate(-1px, -1px)' : undefined,
        position: 'relative',
      }}
      onClick={() => onSelect(scenario.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(scenario.name)}
      aria-pressed={isSelected}
      aria-label={`${scenario.name} strategy, rank ${scenario.rank}`}
    >
      {/* Best match ribbon */}
      {isRecommended && scenario.rank === 1 && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1
                           rounded-full border-2 border-ink whitespace-nowrap"
                style={{ background: '#fef3c7', color: '#0a0a0a', boxShadow: '2px 2px 0 0 #0a0a0a' }}>
            ✨ Best Match
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 mt-1">
          <div className="flex items-center gap-2.5">
            {/* Rank badge */}
            <div className="rank-badge"
                 style={{ background: cfg.rankBg, color: cfg.rankText, borderColor: '#0a0a0a' }}>
              {scenario.rank}
            </div>
            <div>
              <h3 className="font-black text-ink text-base leading-tight">{scenario.name}</h3>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
                Strategy
              </span>
            </div>
          </div>

          {/* Score & Fit */}
          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 border-ink"
               style={{ background: cfg.accentBg, boxShadow: '2px 2px 0 0 #0a0a0a' }}>
            <span className="text-xl font-black leading-none" style={{ color: cfg.scoreColor }}>
              {Math.round(scenario.score)}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wide mt-0.5 leading-none"
                  style={{ color: fitColor }}>
              {fitMetric}
            </span>
          </div>
        </div>

        {/* Dynamic Rank Explanation */}
        <p className="text-xs font-bold text-stone-600 mb-4 bg-stone-50 border border-stone-200 p-2 rounded-lg">
          {getRankingReason(scenario.name, scenario.rank, priority)}
        </p>

        {/* Score bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-stone-400 mb-1.5">
            <span className="uppercase tracking-wide">Priority Fit</span>
            <span>{Math.round(scenario.score)}%</span>
          </div>
          <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${scenario.score}%`, background: cfg.barColor }}
            />
          </div>
        </div>

        {/* Profit / Waste */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
            <p className="text-xs font-black text-stone-400 uppercase tracking-wide mb-1">Est. Profit</p>
            <p className="text-sm font-black" style={{ color: '#15803d' }}>
              {scenario.estimated_profit}
            </p>
          </div>
          <div className="p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
            <p className="text-xs font-black text-stone-400 uppercase tracking-wide mb-1">Est. Waste</p>
            <p className="text-sm font-black" style={{ color: '#c2410c' }}>
              {scenario.estimated_waste}
            </p>
          </div>
        </div>

        {/* Top order items */}
        {topOrder.length > 0 && (
          <div className="mb-4">
            <p className="section-heading">Suggested Order</p>
            <div className="space-y-1.5">
              {topOrder.map(([name, qty]) => (
                <div key={name}
                     className="flex justify-between items-center text-xs
                                bg-white border-2 border-stone-100 rounded-lg px-3 py-1.5">
                  <span className="text-stone-600 truncate pr-2 font-medium">{name}</span>
                  <span className="font-black text-ink flex-shrink-0">{qty} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mb-3">
          <p className="section-heading">Benefits</p>
          <ul className="space-y-1.5">
            {(scenario.benefits || []).slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="font-black mt-0.5 flex-shrink-0" style={{ color: '#16a34a' }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="mb-4">
          <p className="section-heading">Risks</p>
          <ul className="space-y-1.5">
            {(scenario.risks || []).slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-500">
                <span className="font-black mt-0.5 flex-shrink-0" style={{ color: '#ea580c' }}>⚠</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          {/* Select/deselect */}
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-150 border-2"
            style={isSelected
              ? { background: '#0a0a0a', color: '#fff', borderColor: '#0a0a0a', boxShadow: '2px 2px 0 0 #0a0a0a' }
              : { background: '#fff', color: '#0a0a0a', borderColor: '#0a0a0a', boxShadow: '2px 2px 0 0 #0a0a0a' }
            }
            onClick={(e) => { e.stopPropagation(); onSelect(scenario.name) }}
          >
            {isSelected ? '✓ Selected' : 'Select Strategy'}
          </button>

          {/* Confirm → saves to history */}
          {/* Confirm → saves to history */}
          {isSelected && (
            <button
              disabled={isConfirmed}
              className={`px-4 py-2.5 rounded-xl text-sm font-black border-2 transition-all duration-150 ${isConfirmed ? 'cursor-not-allowed opacity-60 bg-stone-100 border-stone-200 shadow-none text-stone-400' : ''}`}
              style={isConfirmed ? {} : { background: cfg.accentBg, color: cfg.scoreColor, borderColor: cfg.accentBorder,
                       boxShadow: `2px 2px 0 0 ${cfg.accentBorder}` }}
              onClick={handleConfirm}
              title={isConfirmed ? "Decision already confirmed" : "Save this decision to history"}
            >
              {isConfirmed ? '✓ Confirmed' : 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
