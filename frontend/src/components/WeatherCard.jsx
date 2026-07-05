const WEATHER_CONFIG = {
  Sunny:           { emoji: '☀️',  accent: '#d97706', bg: '#fef3c7', border: '#f59e0b' },
  Rainy:           { emoji: '🌧️', accent: '#2563eb', bg: '#dbeafe', border: '#3b82f6' },
  Cloudy:          { emoji: '☁️',  accent: '#57534e', bg: '#e7e5e4', border: '#a8a29e' },
  Stormy:          { emoji: '⛈️',  accent: '#4338ca', bg: '#e0e7ff', border: '#6366f1' },
  'Partly Cloudy': { emoji: '⛅',  accent: '#0284c7', bg: '#e0f2fe', border: '#38bdf8' },
}

const DEFAULT = { emoji: '🌤️', accent: '#57534e', bg: '#e7e5e4', border: '#a8a29e' }

export default function WeatherCard({ weather, date }) {
  if (!weather) return null

  const cfg = WEATHER_CONFIG[weather.condition] ?? DEFAULT

  return (
    <div className="card p-5 animate-fade-in"
         style={{ background: cfg.bg, borderColor: '#0a0a0a' }}>

      <div className="flex items-center justify-between mb-3">
        <p className="section-heading mb-0">Tomorrow's Weather</p>
        {date && (
          <span className="text-xs font-bold text-stone-500">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <span className="text-5xl leading-none" role="img" aria-label={weather.condition}>
          {cfg.emoji}
        </span>
        <div>
          <p className="text-2xl font-black text-ink leading-none">{weather.condition}</p>
          <p className="text-sm font-bold mt-1" style={{ color: cfg.accent }}>
            {weather.temperature_c}°C
          </p>
        </div>
      </div>

      <p className="text-xs font-medium text-stone-500 mt-3 leading-relaxed">
        {weather.description}
      </p>

      <div className="mt-3">
        <span className="badge text-xs font-bold"
              style={{ color: cfg.accent, borderColor: cfg.accent, background: 'rgba(255,255,255,0.6)' }}>
          ↑ Affects weather-sensitive stock
        </span>
      </div>
    </div>
  )
}
