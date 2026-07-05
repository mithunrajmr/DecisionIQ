export default function EventCard({ event }) {
  if (!event) return null

  const hasEvent = event.has_event

  return (
    <div className="card p-5 animate-fade-in"
         style={{
           background: hasEvent ? '#dcfce7' : '#f5f5f4',
           borderColor: '#0a0a0a',
         }}>

      <div className="flex items-center justify-between mb-3">
        <p className="section-heading mb-0">Local Event</p>
        <span className="badge font-bold text-xs"
              style={{
                color:       hasEvent ? '#15803d' : '#78716c',
                borderColor: hasEvent ? '#15803d' : '#a8a29e',
                background:  hasEvent ? '#f0fdf4'  : '#e7e5e4',
              }}>
          {hasEvent ? '● Active' : '○ None'}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-4xl leading-none" role="img"
              aria-label={hasEvent ? 'Event' : 'No event'}>
          {hasEvent ? '🎉' : '🏪'}
        </span>
        <div>
          <p className="font-black text-ink text-base leading-tight">
            {hasEvent ? event.event_name : 'No Events Tomorrow'}
          </p>
          <p className="text-xs font-medium text-stone-500 mt-0.5">
            {hasEvent ? 'Nearby · Higher foot traffic' : 'Regular trading day'}
          </p>
        </div>
      </div>

      {hasEvent && event.event_description && (
        <p className="text-xs font-medium text-stone-500 mt-3 leading-relaxed">
          {event.event_description}
        </p>
      )}

      <div className="mt-3">
        <span className="badge text-xs font-bold"
              style={{
                color:       hasEvent ? '#15803d' : '#78716c',
                borderColor: hasEvent ? '#15803d' : '#a8a29e',
                background:  'rgba(255,255,255,0.6)',
              }}>
          {hasEvent ? '↑ Expect higher demand' : 'Standard demand expected'}
        </span>
      </div>
    </div>
  )
}
