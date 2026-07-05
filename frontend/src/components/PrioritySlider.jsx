/**
 * PrioritySlider – 0 = Max Waste Reduction | 100 = Max Profit
 */
export default function PrioritySlider({ value, onChange, disabled }) {
  const pct = value

  const trackStyle = {
    background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e7e5e4 ${pct}%, #e7e5e4 100%)`,
  }

  const label =
    pct <= 20  ? 'Strongly favouring waste reduction'
    : pct <= 40 ? 'Favouring waste reduction'
    : pct <= 60 ? 'Balanced trade-off'
    : pct <= 80 ? 'Favouring profit'
    : 'Strongly favouring profit'

  // Color shifts from blue → green as value increases
  const valueColor = pct < 40 ? '#2563eb' : pct < 60 ? '#92400e' : '#15803d'

  return (
    <div className="card p-6 animate-fade-in">
      {/* Title row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="section-heading mb-0">Purchasing Priority</p>
          <p className="text-xs font-medium text-stone-400 mt-0.5">
            Drag to balance waste reduction vs. profit
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-ink bg-white"
             style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
          <span className="text-2xl font-black tabular-nums"
                style={{ color: valueColor }}>
            {pct}
          </span>
          <span className="text-xs font-bold text-stone-400">/ 100</span>
        </div>
      </div>

      {/* Slider */}
      <div className="px-1">
        <input
          id="priority-slider"
          type="range"
          min={0} max={100} step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          style={trackStyle}
          className="w-full disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Purchasing priority slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={label}
        />
      </div>

      {/* Endpoint labels */}
      <div className="flex justify-between mt-4 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">♻️</span>
          <div>
            <p className="text-xs font-black text-brand-700 uppercase tracking-wide">Waste Reduction</p>
            <p className="text-xs font-medium text-stone-400">Minimise spoilage</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-right">
          <div>
            <p className="text-xs font-black text-accent-700 uppercase tracking-wide">Profit</p>
            <p className="text-xs font-medium text-stone-400">Maximise revenue</p>
          </div>
          <span className="text-lg">💰</span>
        </div>
      </div>

      {/* Status label */}
      <div className="mt-4">
        <div className="flex items-center justify-center">
          <span className="px-4 py-1.5 rounded-lg text-xs font-bold border-2 border-ink bg-white"
                style={{ boxShadow: '2px 2px 0 0 #0a0a0a', color: valueColor }}>
            {label}
          </span>
        </div>
      </div>

      {disabled && (
        <p className="text-xs font-bold text-stone-400 text-center mt-3 animate-pulse-soft uppercase tracking-wide">
          Generating strategies…
        </p>
      )}
    </div>
  )
}
