import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const TECH_STACK = [
  {
    category: 'Frontend',
    accent:   '#2563eb',
    bg:       '#dbeafe',
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
    accent:   '#16a34a',
    bg:       '#dcfce7',
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
    accent:   '#d97706',
    bg:       '#fef3c7',
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
  {
    step: '1',
    label: 'Load Data',
    desc: 'Inventory metrics are pulled directly from BigQuery on startup.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7h16M4 12h16" />
      </svg>
    )
  },
  {
    step: '2',
    label: 'Set Priority',
    desc: 'Drag the slider to define your purchasing priority targets (Profit vs. Waste).',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    )
  },
  {
    step: '3',
    label: 'Gemini Analysis',
    desc: 'Backend formats inventory columns & priority constraints for Gemini evaluation.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    )
  },
  {
    step: '4',
    label: 'Rank Scenarios',
    desc: 'Gemini models 3 strategies: Conservative, Aggressive, and the AI Recommended choice.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    )
  },
  {
    step: '5',
    label: 'Compare Metrics',
    desc: 'Examine detailed fit scores, estimated profit, and projected stock waste on card faces.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    step: '6',
    label: 'AI Explanation',
    desc: 'Expand the explanation panel to read Gemini\'s grounding analysis and actions.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    step: '7',
    label: 'Confirm Decision',
    desc: 'Confirm the strategy to archive it in your localized Decision History log drawer.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f4' }}>
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Banner */}
        <div className="mb-10 text-left">
          <div className="inline-block mb-3">
            <span className="px-3 py-1 rounded-lg border-2 border-ink text-xs font-black
                             uppercase tracking-widest bg-amber-300"
                  style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
              Google Gen AI Academy APAC · Cohort 2
            </span>
          </div>
          <h1 className="text-4xl font-black text-ink tracking-tight mb-3">
            DecisionIQ Overview
          </h1>
          {/* positioning statement */}
          <p className="text-stone-700 text-base font-bold leading-relaxed max-w-3xl border-l-4 border-brand-500 pl-4 bg-brand-50/50 py-2 rounded-r-xl">
            DecisionIQ is an enterprise AI decision intelligence platform that simulates grocery inventory purchasing scenarios, balancing profit margins against spoilage risk using Vertex AI Gemini and live BigQuery data.
          </p>
        </div>

        {/* Core Product Capabilities */}
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
                'Operates entirely in-browser without database server writes',
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

        {/* Stepper Timeline */}
        <div className="mb-10">
          <p className="section-heading">Platform Decision Pipeline</p>
          <div className="card p-5">
            <div className="grid grid-cols-1 gap-2.5">
              {FLOW_STEPS.map((step) => (
                <div key={step.step} className="flex items-center gap-4 p-3 rounded-lg border border-stone-200 bg-stone-50">
                  {/* Icon badge */}
                  <div className="w-10 h-10 rounded-lg border-2 border-ink flex items-center justify-center
                                  bg-white text-ink flex-shrink-0"
                       style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-400 uppercase tracking-wide">Step {step.step}</p>
                    <p className="text-sm font-black text-ink">{step.label}</p>
                    <p className="text-xs font-medium text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SaaS Tech Stack */}
        <div className="mb-10">
          <p className="section-heading">Architecture &amp; System Integration</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TECH_STACK.map((stack) => (
              <div key={stack.category} className="card p-5"
                   style={{ background: stack.bg, borderColor: stack.accent,
                            boxShadow: `3px 3px 0 0 ${stack.accent}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg border-2 border-ink flex items-center
                                  justify-center bg-white"
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

        {/* Data Grounding Disclaimer */}
        <div className="mb-10">
          <div className="card p-5"
               style={{ background: '#fef3c7', borderColor: '#d97706', boxShadow: '3px 3px 0 0 #d97706' }}>
            <div className="flex items-start gap-3">
              {/* outlined magnifier */}
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
                  <code className="bg-white px-1 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-bold">
                    inventory_data
                  </code>{' '}
                  table (specifically target column attributes:{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-bold">
                    avg_weekly_sales_units
                  </code>
                  ,{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-bold">
                    current_stock_units
                  </code>
                  , and{' '}
                  <code className="bg-white px-1 py-0.5 rounded border border-stone-300 text-[10px] font-mono font-bold">
                    shelf_life_days
                  </code>
                  ). Calculations are audited dynamically; no metrics are synthesized or hallucinated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
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
