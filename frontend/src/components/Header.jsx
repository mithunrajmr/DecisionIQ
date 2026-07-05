import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700
                            flex items-center justify-center shadow-md
                            group-hover:shadow-brand-200 transition-shadow duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                         l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                         003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                Decision<span className="text-brand-600">IQ</span>
              </span>
              <p className="text-xs text-slate-400 font-medium -mt-0.5 hidden sm:block">
                AI Inventory Intelligence
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" label="Dashboard" active={pathname === '/'} />
            <NavLink to="/about" label="About" active={pathname === '/about'} />
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
      {label}
    </Link>
  )
}
