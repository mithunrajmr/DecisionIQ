import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-ink mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ink border-2 border-ink flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                         l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                         003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight text-ink">
              Decision<span className="text-brand-600">IQ</span>
            </span>
          </div>

          {/* Centre */}
          <p className="text-xs text-stone-400 text-center font-medium">
            Built with{' '}
            <span className="text-brand-600 font-bold">Vertex AI Gemini</span> ·{' '}
            <span className="text-brand-600 font-bold">BigQuery</span> ·{' '}
            <span className="text-brand-600 font-bold">Cloud Run</span>
            {' '}— Google Gen AI Academy APAC 2025
          </p>

          {/* Nav */}
          <nav className="flex gap-4 text-xs font-bold text-stone-400">
            <Link to="/"          className="hover:text-ink transition-colors">Dashboard</Link>
            <Link to="/inventory" className="hover:text-ink transition-colors">Inventory</Link>
            <Link to="/about"     className="hover:text-ink transition-colors">About</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
