/**
 * PrioritySlider – horizontal 0–100 slider.
 * 0 = Max Waste Reduction   |   100 = Max Profit
 */
export default function PrioritySlider({ value, onChange, disabled }) {
  const pct = value

  // Compute gradient fill colour: blue (waste) → green (profit)
  const trackStyle = {
    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
  }

  const label =
    pct <= 20  ? 'Strongly favouring waste reduction'
    : pct <= 40 ? 'Favouring waste reduction'
    : pct <= 60 ? 'Balanced trade-off'
    : pct <= 80 ? 'Favouring profit'
    : 'Strongly favouring profit'

  return (
    <div className="card p-6 animate-fade-in">
      {/* Title row */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3
                 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0
                 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5
                 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
        </div>
        <h2 className="font-semibold text-slate-700">Purchasing Priority</h2>
        <span className="ml-auto text-sm font-semibold text-brand-700 bg-brand-50
                         px-3 py-1 rounded-full border border-brand-100">
          {pct} / 100
        </span>
      </div>

      {/* Slider track + thumb */}
      <div className="px-1">
        <input
          id="priority-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          style={trackStyle}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Purchasing priority slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={label}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">♻️</span>
          <div>
            <p className="text-xs font-semibold text-blue-600">Waste Reduction</p>
            <p className="text-xs text-slate-400">Minimise spoilage</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-right">
          <div>
            <p className="text-xs font-semibold text-accent-600">Profit</p>
            <p className="text-xs text-slate-400">Maximise revenue</p>
          </div>
          <span className="text-lg">💰</span>
        </div>
      </div>

      {/* Current label */}
      <div className="mt-4 text-center">
        <span className="text-xs font-medium text-slate-500 bg-slate-100
                         px-3 py-1 rounded-full">
          {label}
        </span>
      </div>

      {disabled && (
        <p className="text-xs text-slate-400 text-center mt-3 animate-pulse-soft">
          Generating strategies…
        </p>
      )}
    </div>
  )
}
