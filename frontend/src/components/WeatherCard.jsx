const WEATHER_CONFIG = {
  Sunny:          { emoji: '☀️',  bg: 'from-amber-50 to-yellow-50',  border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' },
  Rainy:          { emoji: '🌧️', bg: 'from-blue-50 to-slate-50',    border: 'border-blue-100',  badge: 'bg-blue-100 text-blue-700'  },
  Cloudy:         { emoji: '☁️',  bg: 'from-slate-50 to-slate-100',  border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600' },
  Stormy:         { emoji: '⛈️',  bg: 'from-indigo-50 to-slate-50',  border: 'border-indigo-100',badge: 'bg-indigo-100 text-indigo-700'},
  'Partly Cloudy':{ emoji: '⛅',  bg: 'from-sky-50 to-amber-50',     border: 'border-sky-100',   badge: 'bg-sky-100 text-sky-700'    },
}

const DEFAULT = { emoji: '🌤️', bg: 'from-slate-50 to-slate-100', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600' }

/**
 * WeatherCard – displays tomorrow's weather forecast.
 */
export default function WeatherCard({ weather, date }) {
  if (!weather) return null

  const cfg = WEATHER_CONFIG[weather.condition] ?? DEFAULT

  return (
    <div className={`card p-5 bg-gradient-to-br ${cfg.bg} border ${cfg.border} animate-fade-in`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Tomorrow's Weather
        </p>
        {date && (
          <span className="text-xs text-slate-400">
            {new Date(date + 'T00:00:00').toLocaleDateString('en-AU', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-5xl leading-none" role="img" aria-label={weather.condition}>
          {cfg.emoji}
        </span>
        <div>
          <p className="text-2xl font-bold text-slate-800">{weather.condition}</p>
          <p className="text-sm text-slate-500 mt-0.5">{weather.temperature_c}°C</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">{weather.description}</p>

      <div className="mt-3">
        <span className={`badge ${cfg.badge} text-xs`}>
          Affecting weather-sensitive stock
        </span>
      </div>
    </div>
  )
}
