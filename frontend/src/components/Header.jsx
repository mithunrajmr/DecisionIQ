import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b-2 border-ink sticky top-0 z-40"
            style={{ boxShadow: '0 3px 0 0 #0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center
                            border-2 border-ink shadow-neo group-hover:shadow-neo-blue
                            transition-shadow duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                         l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                         003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-ink">
                Decision<span className="text-brand-600">IQ</span>
              </span>
              <p className="text-xs text-stone-400 font-semibold -mt-0.5 hidden sm:block tracking-wide">
                AI INVENTORY INTELLIGENCE
              </p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <NavLink to="/"          label="Dashboard" active={pathname === '/'} />
            <NavLink to="/inventory" label="Inventory"  active={pathname === '/inventory'} />
            <NavLink to="/about"     label="About"      active={pathname === '/about'} />
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
      className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-150
        ${active
          ? 'bg-ink text-white border-2 border-ink'
          : 'text-stone-500 hover:text-ink border-2 border-transparent hover:border-stone-300 hover:bg-stone-50'
        }`}
    >
      {label}
    </Link>
  )
}
