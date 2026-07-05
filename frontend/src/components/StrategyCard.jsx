/**
 * StrategyCard – displays one purchasing scenario.
 * Animates on rank change via CSS transition.
 */

const CARD_CONFIG = {
  'Conservative': {
    icon: '🛡️',
    accent: 'border-blue-200 bg-gradient-to-br from-white to-blue-50',
    rankColor: 'bg-blue-600 text-white',
    scoreColor: 'bg-blue-100 text-blue-700',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-100',
    scoreBar: 'bg-blue-500',
  },
  'Aggressive': {
    icon: '🚀',
    accent: 'border-orange-200 bg-gradient-to-br from-white to-orange-50',
    rankColor: 'bg-orange-500 text-white',
    scoreColor: 'bg-orange-100 text-orange-700',
    badgeColor: 'bg-orange-50 text-orange-600 border-orange-100',
    scoreBar: 'bg-orange-400',
  },
  'AI Recommended': {
    icon: '✨',
    accent: 'border-brand-200 bg-gradient-to-br from-white to-brand-50',
    rankColor: 'bg-brand-600 text-white',
    scoreColor: 'bg-brand-100 text-brand-700',
    badgeColor: 'bg-brand-50 text-brand-700 border-brand-100',
    scoreBar: 'bg-brand-500',
  },
}

const DEFAULT_CFG = {
  icon: '📋',
  accent: 'border-slate-200 bg-white',
  rankColor: 'bg-slate-400 text-white',
  scoreColor: 'bg-slate-100 text-slate-600',
  badgeColor: 'bg-slate-50 text-slate-600 border-slate-200',
  scoreBar: 'bg-slate-400',
}

export default function StrategyCard({ scenario, isSelected, onSelect }) {
  if (!scenario) return null

  const cfg = CARD_CONFIG[scenario.name] ?? DEFAULT_CFG
  const isRecommended = scenario.name === 'AI Recommended'
  const topOrder = Object.entries(scenario.suggested_order || {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <div
      className={`scenario-card card border-2 cursor-pointer
        ${cfg.accent}
        ${isSelected ? 'ring-2 ring-brand-400 ring-offset-2 shadow-card-hover -translate-y-1' : 'hover:shadow-card-hover hover:-translate-y-0.5'}
        ${isRecommended ? 'relative' : ''}
      `}
      onClick={() => onSelect(scenario.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(scenario.name)}
      aria-pressed={isSelected}
      aria-label={`${scenario.name} strategy, rank ${scenario.rank}`}
    >
      {/* "Best Match" ribbon for AI Recommended when rank 1 */}
      {isRecommended && scenario.rank === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1
                           rounded-full shadow-md whitespace-nowrap">
            ✨ Best Match
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{cfg.icon}</span>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">{scenario.name}</h3>
              <div className={`badge mt-1 border ${cfg.badgeColor}`}>
                Rank #{scenario.rank}
              </div>
            </div>
          </div>
          {/* Score circle */}
          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${cfg.scoreColor}`}>
            <span className="text-lg font-black leading-none">
              {Math.round(scenario.score)}
            </span>
            <span className="text-xs font-medium opacity-70">score</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Priority fit</span>
            <span>{Math.round(scenario.score)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.scoreBar}`}
              style={{ width: `${scenario.score}%` }}
            />
          </div>
        </div>

        {/* Profit / Waste stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-white border border-slate-100">
            <p className="text-xs text-slate-400 mb-1 font-medium">Est. Profit</p>
            <p className="text-sm font-bold text-accent-700">{scenario.estimated_profit}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-100">
            <p className="text-xs text-slate-400 mb-1 font-medium">Est. Waste</p>
            <p className="text-sm font-bold text-orange-600">{scenario.estimated_waste}</p>
          </div>
        </div>

        {/* Top order items */}
        {topOrder.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Suggested Order (top items)</p>
            <div className="space-y-1">
              {topOrder.map(([name, qty]) => (
                <div key={name} className="flex justify-between items-center
                                           text-xs bg-white border border-slate-100 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-600 truncate pr-2">{name}</span>
                  <span className="font-bold text-slate-800 flex-shrink-0">{qty} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Benefits</p>
          <ul className="space-y-1">
            {(scenario.benefits || []).slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                <span className="text-accent-500 mt-0.5 flex-shrink-0">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Risks</p>
          <ul className="space-y-1">
            {(scenario.risks || []).slice(0, 2).map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">⚠</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Select button */}
        <button
          className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${isSelected
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
          onClick={(e) => { e.stopPropagation(); onSelect(scenario.name) }}
        >
          {isSelected ? '✓ Strategy Selected' : 'Select This Strategy'}
        </button>
      </div>
    </div>
  )
}
