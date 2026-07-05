/**
 * EventCard – displays whether a local event is happening tomorrow.
 */
export default function EventCard({ event }) {
  if (!event) return null

  const hasEvent = event.has_event

  return (
    <div className={`card p-5 animate-fade-in border
      ${hasEvent
        ? 'bg-gradient-to-br from-accent-50 to-emerald-50 border-accent-100'
        : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
      }`}>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Local Event
        </p>
        <span className={`badge font-semibold ${
          hasEvent ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {hasEvent ? '● Active' : '○ None'}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <span className="text-4xl leading-none" role="img"
              aria-label={hasEvent ? 'Event happening' : 'No event'}>
          {hasEvent ? '🎉' : '🏪'}
        </span>
        <div>
          <p className="font-bold text-slate-800 text-base leading-tight">
            {hasEvent ? event.event_name : 'No Events Tomorrow'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {hasEvent ? 'Nearby' : 'Regular trading day'}
          </p>
        </div>
      </div>

      {hasEvent && event.event_description && (
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          {event.event_description}
        </p>
      )}

      <div className="mt-3">
        <span className={`badge text-xs ${
          hasEvent ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {hasEvent ? '↑ Expect higher foot traffic' : 'Standard demand expected'}
        </span>
      </div>
    </div>
  )
}
