import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const TECH_STACK = [
  {
    category: 'Frontend',
    accent: '#2563eb', bg: '#dbeafe',
    icon: (
      <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      { name: 'React 18',     desc: 'Component-based UI framework' },
      { name: 'Vite',         desc: 'Lightning-fast dev build tool' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
      { name: 'React Router', desc: 'Client-side routing' },
    ],
  },
  {
    category: 'Backend',
    accent: '#16a34a', bg: '#dcfce7',
    icon: (
      <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: [
      { name: 'FastAPI',     desc: 'High-performance Python API' },
      { name: 'Pydantic v2', desc: 'Request/response validation' },
      { name: 'Python 3.11', desc: 'Runtime language' },
      { name: 'Uvicorn',     desc: 'ASGI server' },
    ],
  },
  {
    category: 'Google Cloud',
    accent: '#d97706', bg: '#fef3c7',
    icon: (
      <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    items: [
      { name: 'Vertex AI',        desc: 'Managed AI platform' },
      { name: 'Gemini 2.5 Flash', desc: 'LLM for scenario generation' },
      { name: 'BigQuery',         desc: 'Inventory data warehouse' },
      { name: 'Cloud Run',        desc: 'Serverless container runtime' },
    ],
  },
]

const FLOW_STEPS = [
  { step: '1', label: 'Load Data',       desc: 'Inventory metrics are pulled directly from BigQuery on startup.' },
  { step: '2', label: 'Set Priority',    desc: 'Drag the slider to define your purchasing priority targets (Profit vs. Waste).' },
  { step: '3', label: 'Gemini Analysis', desc: 'Backend formats inventory columns & priority constraints for Gemini evaluation.' },
  { step: '4', label: 'Rank Scenarios',  desc: 'Gemini models 3 strategies: Conservative, Aggressive, and the AI Recommended choice.' },
  { step: '5', label: 'Compare Metrics', desc: 'Examine detailed fit scores, estimated profit, and projected stock waste on card faces.' },
  { step: '6', label: 'AI Explanation',  desc: "Expand the explanation panel to read Gemini's grounding analysis and actions." },
  { step: '7', label: 'Confirm Decision',desc: 'Confirm the strategy to archive it in your localized Decision History log.' },
]

const PRODUCT_HIGHLIGHTS = [
  { icon: '🗄️', title: 'Live BigQuery Integration',        desc: 'All inventory data is read and written in real-time against a live Google BigQuery dataset.' },
  { icon: '🤖', title: 'AI Decision Intelligence',          desc: 'Gemini 2.5 Flash evaluates inventory data and generates three ranked purchasing strategies.' },
  { icon: '🔍', title: 'Explainable AI',                   desc: 'Every recommendation is accompanied by a structured, data-grounded explanation with four sections.' },
  { icon: '📊', title: 'Inventory Analytics',              desc: 'Dedicated analytics dashboard showing stock health, waste risk, and category distributions.' },
  { icon: '⚖️', title: 'Strategy Comparison',              desc: 'Side-by-side comparison of Conservative, Aggressive, and AI Recommended strategies.' },
  { icon: '☁️', title: 'Google Cloud Native Architecture', desc: 'Built on Vertex AI, BigQuery, and Cloud Run — fully managed, serverless, and production-ready.' },
]

const USE_CASES = [
  { icon: '🛒', label: 'Grocery Stores' },
  { icon: '🏪', label: 'Retail Chains' },
  { icon: '🏬', label: 'Supermarkets' },
  { icon: '🏭', label: 'Warehouse Managers' },
  { icon: '🚚', label: 'Supply Chain Teams' },
]

const ROADMAP = [
  { icon: '🔗', title: 'ERP Integration',              desc: 'Sync decision outputs directly with SAP, Oracle, and other ERP platforms.' },
  { icon: '🛍️', title: 'Supplier APIs',                desc: 'Connect with wholesale supplier APIs to auto-generate purchase orders.' },
  { icon: '🤖', title: 'Autonomous Purchasing Agent',  desc: 'AI agent that executes approved decisions and monitors order fulfilment.' },
  { icon: '📈', title: 'Demand Forecasting',           desc: 'Time-series models predicting weekly demand shifts by product and season.' },
  { icon: '🏪', title: 'Multi-store Optimization',     desc: 'Coordinate inventory allocation across multiple retail locations centrally.' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f4' }}>
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <div className="mb-10 text-left">
          <div className="inline-block mb-3">
            <span className="px-3 py-1 rounded-lg border-2 border-ink text-xs font-black uppercase tracking-widest bg-amber-300"
                  style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
              Google Gen AI Academy APAC · Cohort 2
            </span>
          </div>
          <h1 className="text-4xl font-black text-ink tracking-tight mb-3">
            DecisionIQ Overview
          </h1>
          <p className="text-stone-700 text-base font-bold leading-relaxed max-w-3xl border-l-4 border-brand-500 pl-4 bg-brand-50/50 py-2 rounded-r-xl">
            DecisionIQ is an enterprise AI decision intelligence platform that simulates grocery inventory purchasing scenarios, balancing profit margins against spoilage risk using Vertex AI Gemini and live BigQuery data.
          </p>
        </div>

        {/* ── Product Highlights ───────────────────────────────────── */}
        <div className="mb-10">
          <p className="section-heading">Product Highlights</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRODUCT_HIGHLIGHTS.map(h => (
              <div key={h.title} className="card p-4 flex gap-3">
                <span className="text-2xl flex-shrink-0">{h.icon}</span>
                <div>
                  <p className="font-black text-ink text-sm mb-1">{h.title}</p>
                  <p className="text-xs font-medium text-stone-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Core Product Capabilities ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="card p-5"
               style={{ background: '#dcfce7', borderColor: '#16a34a', boxShadow: '3px 3px 0 0 #16a34a' }}>
            <p className="section-heading mb-3" style={{ color: '#15803d' }}>Platform Scope &amp; Purpose</p>
            <ul className="space-y-2">
              {[
                'Simulates purchasing trade-offs for perishable groceries',
                'Integrates with Google BigQuery data warehouse pipelines',
                'Applies structured Gemini models to forecast demand targets',
                'Visualizes estimated profits vs. food waste risks in real-time',
                'Maintains a localized confirmed decision ledger',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs font-black text-stone-700">
                  <span className="text-accent-700 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5"
               style={{ background: '#ffedd5', borderColor: '#ea580c', boxShadow: '3px 3px 0 0 #ea580c' }}>
            <p className="section-heading mb-3" style={{ color: '#c2410c' }}>Out of Scope Constraints</p>
            <ul className="space-y-2">
              {[
                'Does not execute live inventory modifications directly',
                'Does not place orders with wholesalers or transfer capital',
                'Does not manage customer signups, passwords, or authentication',
                'All predictions are modeling suggestions, not audited accounting guidance',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs font-black text-stone-700">
                  <span className="text-orange-700 font-bold">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Real-world Use Cases ──────────────────────────────────── */}
        <div className="mb-10">
          <p className="section-heading">Real-world Use Cases</p>
          <div className="flex flex-wrap gap-3">
            {USE_CASES.map(u => (
              <div key={u.label}
                   className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-ink bg-white font-black text-sm"
                   style={{ boxShadow: '3px 3px 0 0 #0a0a0a' }}>
                <span className="text-lg">{u.icon}</span>
                {u.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Decision Pipeline ────────────────────────────────────── */}
        <div className="mb-10">
          <p className="section-heading">Platform Decision Pipeline</p>
          <div className="card p-5">
            <div className="grid grid-cols-1 gap-2.5">
              {FLOW_STEPS.map((step) => (
                <div key={step.step} className="flex items-center gap-4 p-3 rounded-lg border border-stone-200 bg-stone-50">
                  <div className="w-8 h-8 rounded-lg border-2 border-ink flex items-center justify-center bg-amber-300 text-ink font-black text-sm flex-shrink-0"
                       style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    {step.step}
                  </div>
                  <div>
                    <p className="text-sm font-black text-ink">{step.label}</p>
                    <p className="text-xs font-medium text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Architecture & Stack ──────────────────────────────────── */}
        <div className="mb-10">
          <p className="section-heading">Architecture &amp; System Integration</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TECH_STACK.map((stack) => (
              <div key={stack.category} className="card p-5"
                   style={{ background: stack.bg, borderColor: stack.accent, boxShadow: `3px 3px 0 0 ${stack.accent}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg border-2 border-ink flex items-center justify-center bg-white"
                       style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    {stack.icon}
                  </div>
                  <p className="font-black text-ink text-sm">{stack.category}</p>
                </div>
                <div className="space-y-2">
                  {stack.items.map((item) => (
                    <div key={item.name} className="flex items-start gap-1.5">
                      <span className="text-ink font-bold text-xs select-none">•</span>
                      <div>
                        <p className="text-xs font-black text-ink leading-tight">{item.name}</p>
                        <p className="text-[10px] font-bold text-stone-500 mt-0.5 leading-none">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Data Auditing Disclaimer ──────────────────────────────── */}
        <div className="mb-10">
          <div className="card p-5"
               style={{ background: '#fef3c7', borderColor: '#d97706', boxShadow: '3px 3px 0 0 #d97706' }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg border-2 border-ink bg-white flex items-center justify-center flex-shrink-0"
                   style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="font-black text-ink mb-1.5 text-sm">Data Auditing &amp; Transparency</p>
                <p className="text-xs font-semibold text-stone-700 leading-relaxed">
                  Every metric referenced by Gemini is dynamically audited against corresponding schemas in the BigQuery{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-bold">inventory_data</code>{' '}
                  table. Calculations are audited dynamically; no metrics are synthesized or hallucinated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── About the Developer ───────────────────────────────────── */}
        <div className="mb-10">
          <p className="section-heading">About the Developer</p>
          <div className="card p-6"
               style={{ background: '#f0f9ff', borderColor: '#0ea5e9', boxShadow: '4px 4px 0 0 #0ea5e9' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-xl border-2 border-ink flex items-center justify-center text-3xl bg-white flex-shrink-0"
                   style={{ boxShadow: '3px 3px 0 0 #0a0a0a' }}>
                👨‍💻
              </div>
              <div className="flex-1">
                <p className="text-xl font-black text-ink mb-0.5">Mithun Raj M R</p>
                <p className="text-sm font-bold text-stone-600 mb-1">Software Engineer · Wipro</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg border-2 border-amber-400 bg-amber-300 text-xs font-black text-ink"
                        style={{ boxShadow: '1px 1px 0 0 #0a0a0a' }}>
                    Google Gen AI Academy APAC
                  </span>
                  <span className="px-2.5 py-1 rounded-lg border-2 border-ink bg-white text-xs font-black text-ink">
                    Cohort 2
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href="https://mithunrajmr.netlify.app" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-ink bg-ink text-white text-xs font-black hover:bg-stone-800 transition-colors"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    🌐 Portfolio
                  </a>
                  <a href="https://github.com/mithunrajmr" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-ink bg-white text-ink text-xs font-black hover:bg-stone-50 transition-colors"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/mithunrajmr" target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-blue-600 bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-colors"
                     style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Future Roadmap ────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="section-heading mb-0">Future Capabilities</p>
            <span className="px-2.5 py-1 rounded-lg border-2 border-stone-300 text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-100">
              Roadmap
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROADMAP.map(r => (
              <div key={r.title} className="card p-4 border-dashed"
                   style={{ borderStyle: 'dashed', borderColor: '#d6d3d1', boxShadow: 'none', background: '#fafaf9' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{r.icon}</span>
                  <p className="font-black text-sm text-stone-600">{r.title}</p>
                </div>
                <p className="text-xs font-medium text-stone-400 leading-relaxed">{r.desc}</p>
                <span className="inline-block mt-3 px-2 py-0.5 rounded border border-stone-200 text-[9px] font-black uppercase tracking-widest text-stone-400 bg-white">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Open Dashboard
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
