import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const TECH_STACK = [
  {
    category: 'Frontend',
    color: 'from-blue-50 to-indigo-50 border-blue-100',
    iconColor: 'text-blue-600 bg-blue-100',
    icon: '🖥️',
    items: [
      { name: 'React 18',      desc: 'Component-based UI framework' },
      { name: 'Vite',          desc: 'Lightning-fast dev build tool' },
      { name: 'Tailwind CSS',  desc: 'Utility-first styling' },
      { name: 'React Router',  desc: 'Client-side routing' },
      { name: 'Axios',         desc: 'HTTP request handling' },
    ],
  },
  {
    category: 'Backend',
    color: 'from-green-50 to-emerald-50 border-green-100',
    iconColor: 'text-green-600 bg-green-100',
    icon: '⚙️',
    items: [
      { name: 'FastAPI',       desc: 'High-performance Python API' },
      { name: 'Pydantic v2',   desc: 'Request/response validation' },
      { name: 'Python 3.11',   desc: 'Runtime language' },
      { name: 'Uvicorn',       desc: 'ASGI server' },
    ],
  },
  {
    category: 'Google Cloud',
    color: 'from-brand-50 to-sky-50 border-brand-100',
    iconColor: 'text-brand-600 bg-brand-100',
    icon: '☁️',
    items: [
      { name: 'Vertex AI',           desc: 'Managed AI platform' },
      { name: 'Gemini 2.5 Flash',    desc: 'LLM for scenario generation' },
      { name: 'BigQuery',            desc: 'Inventory data warehouse' },
      { name: 'Cloud Run',           desc: 'Serverless container runtime' },
    ],
  },
]

const FLOW_STEPS = [
  { step: '1', label: 'Load Data',       desc: 'Inventory loaded from BigQuery on startup',                icon: '🗄️' },
  { step: '2', label: 'Set Priority',    desc: 'User moves the Profit ↔ Waste slider',                    icon: '🎚️' },
  { step: '3', label: 'Gemini Analysis', desc: 'Backend sends inventory + slider value to Gemini',         icon: '✨' },
  { step: '4', label: '3 Strategies',    desc: 'Conservative, Aggressive, AI Recommended generated',       icon: '📊' },
  { step: '5', label: 'Live Re-rank',    desc: 'Cards re-rank instantly as the slider moves',              icon: '🔄' },
  { step: '6', label: 'Explanation',     desc: 'Gemini explains reasoning with real inventory numbers',    icon: '💬' },
  { step: '7', label: 'Decide',          desc: 'Owner selects the best strategy and places the order',    icon: '✅' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12
                   l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0
                   003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            About Decision<span className="text-brand-600">IQ</span>
          </h1>
          <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto leading-relaxed">
            An AI Decision Intelligence platform that helps small grocery store owners
            simulate multiple inventory purchasing strategies and choose the best one
            before placing an order — powered by Google Gemini and BigQuery.
          </p>
          <div className="mt-4">
            <span className="badge bg-brand-100 text-brand-700 text-sm px-4 py-1.5">
              Google Gen AI Academy APAC Hackathon · Problem Statement 1
            </span>
          </div>
        </div>

        {/* ── Problem statement ─────────────────────────────────────────────── */}
        <div className="card p-7 mb-8 animate-slide-up">
          <h2 className="text-xl font-bold text-slate-800 mb-3">The Problem</h2>
          <p className="text-slate-600 leading-relaxed">
            Every night, a small grocery store owner must decide how much to order for
            tomorrow. Order too little — you lose sales. Order too much — you waste food
            and money. Traditional approaches rely on gut-feel and spreadsheets, with no
            way to model the impact of weather, local events, or changing priorities
            before committing to an order.
          </p>
        </div>

        {/* ── What it is / is not ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-up">
          <div className="card p-6 border-l-4 border-accent-400">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-accent-500">✓</span> What DecisionIQ IS
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {['A decision simulator', 'A strategy comparator', 'An AI explanation engine',
                'A data-grounded recommendation tool'].map(it => (
                <li key={it} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border-l-4 border-red-300">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-red-400">✗</span> What DecisionIQ is NOT
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {['A chatbot', 'A forecasting dashboard', 'An analytics tool',
                'A system that invents numbers'].map(it => (
                <li key={it} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-300 flex-shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Decision flow ──────────────────────────────────────────────────── */}
        <div className="card p-7 mb-8 animate-slide-up">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Decision Flow</h2>
          <div className="space-y-3">
            {FLOW_STEPS.map((s, i) => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 border-2 border-brand-100
                                  flex items-center justify-center text-lg flex-shrink-0">
                    {s.icon}
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="w-0.5 h-5 bg-slate-200 my-1" />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className="text-sm font-semibold text-slate-700">{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech stack ────────────────────────────────────────────────────── */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Architecture & Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TECH_STACK.map((stack) => (
              <div key={stack.category}
                   className={`card p-5 bg-gradient-to-br border ${stack.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{stack.icon}</span>
                  <h3 className="font-bold text-slate-700">{stack.category}</h3>
                </div>
                <ul className="space-y-2.5">
                  {stack.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-2">
                      <span className={`badge mt-0.5 text-xs font-bold ${stack.iconColor}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-500">{item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Data transparency ──────────────────────────────────────────────── */}
        <div className="card p-7 mb-8 bg-gradient-to-br from-amber-50 to-yellow-50
                        border border-amber-100 animate-slide-up">
          <h2 className="text-xl font-bold text-slate-800 mb-3">
            🔍 Data Transparency Commitment
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Every number Gemini states in its explanation traces directly back to a column
            in the BigQuery <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-800
            text-xs font-mono">inventory_data</code> table — specifically{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs font-mono">avg_weekly_sales_units</code>,{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs font-mono">current_stock_units</code>,{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs font-mono">shelf_life_days</code>,{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs font-mono">unit_cost</code>, and{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-800 text-xs font-mono">unit_price</code>.
            No percentages or dollar amounts are invented by the AI.
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="text-center animate-fade-in">
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1
                   1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1
                   1 0 001 1m-6 0h6" />
            </svg>
            Open the Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
