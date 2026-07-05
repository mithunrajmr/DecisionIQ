import { useState } from 'react'
import Header              from '../components/Header'
import Footer              from '../components/Footer'
import InventorySummaryCard from '../components/InventorySummaryCard'
import WeatherCard          from '../components/WeatherCard'
import EventCard            from '../components/EventCard'
import PrioritySlider       from '../components/PrioritySlider'
import StrategyCard         from '../components/StrategyCard'
import ExplanationPanel     from '../components/ExplanationPanel'
import ActionSuggestions    from '../components/ActionSuggestions'
import DecisionHistory      from '../components/DecisionHistory'
import LoadingSkeleton      from '../components/LoadingSkeleton'
import ErrorBanner          from '../components/ErrorBanner'
import { useFetch }         from '../hooks/useFetch'
import { useDashboard }     from '../hooks/useDashboard'
import { useDecisionHistory } from '../hooks/useDecisionHistory'
import { fetchInventory }   from '../services/inventoryApi'
import { fetchContext }     from '../services/contextApi'

export default function Dashboard() {
  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: inventory, loading: invLoading, error: invError } = useFetch(fetchInventory, [])
  const { data: context,   loading: ctxLoading, error: ctxError  } = useFetch(fetchContext, [])

  // ── Scenario orchestration ─────────────────────────────────────────────────
  const {
    priority,
    scenarios,
    loadingScenarios,
    scenarioError,
    selectedScenario,
    handlePriorityChange,
    handleSelectScenario,
  } = useDashboard(inventory, context)

  // ── Decision History ───────────────────────────────────────────────────────
  const { history, addEntry, clearHistory } = useDecisionHistory()

  // ── Suggested Actions (from explanation endpoint) ──────────────────────────
  const [suggestedActions, setSuggestedActions] = useState([])

  // ── Error dismissal ────────────────────────────────────────────────────────
  const [dismissedErrors, setDismissed] = useState({})
  const dismiss = (key) => setDismissed(p => ({ ...p, [key]: true }))

  const dataReady = !invLoading && !ctxLoading

  // Find the currently selected scenario object
  const selectedScenarioObj = scenarios.find(s => s.name === selectedScenario) ?? null

  // Confirm handler — saves to history
  const handleConfirm = (scenario) => {
    addEntry({
      scenarioName: scenario.name,
      priority,
      score:        scenario.score,
    })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f4' }}>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink tracking-tight">
            Inventory Decision Dashboard
          </h1>
          <p className="text-stone-500 mt-1.5 text-sm font-medium">
            Compare purchasing strategies powered by Gemini AI — adjust the slider to reprioritise instantly.
          </p>
        </div>

        {/* ── Error banners ────────────────────────────────────────────────── */}
        <div className="space-y-3 mb-6">
          {invError    && !dismissedErrors.inv  && <ErrorBanner message={`Inventory load failed: ${invError}`}  onDismiss={() => dismiss('inv')}  />}
          {ctxError    && !dismissedErrors.ctx  && <ErrorBanner message={`Context load failed: ${ctxError}`}    onDismiss={() => dismiss('ctx')}  />}
          {scenarioError && !dismissedErrors.scen && <ErrorBanner message={scenarioError}                        onDismiss={() => dismiss('scen')} />}
        </div>

        {/* ── Section 1: Context row ──────────────────────────────────────── */}
        <section aria-label="Context information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {invLoading ? <LoadingSkeleton type="card"    /> : <InventorySummaryCard data={inventory} />}
            {ctxLoading ? <LoadingSkeleton type="context" /> : <WeatherCard weather={context?.weather} date={context?.date} />}
            {ctxLoading ? <LoadingSkeleton type="context" /> : <EventCard   event={context?.event} />}
          </div>
        </section>

        {/* ── Section 2: Priority slider ──────────────────────────────────── */}
        <section aria-label="Priority slider" className="mb-8">
          <PrioritySlider
            value={priority}
            onChange={handlePriorityChange}
            disabled={loadingScenarios || !dataReady}
          />
        </section>

        {/* ── Section 3: Strategy cards ───────────────────────────────────── */}
        <section aria-label="Purchasing strategies" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="section-heading mb-0">Purchasing Strategies</p>
            {loadingScenarios && (
              <div className="flex items-center gap-2 text-xs font-black text-brand-600 uppercase tracking-wide">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
                       0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0
                       0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Gemini thinking…
              </div>
            )}
          </div>

          {loadingScenarios && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LoadingSkeleton type="scenario" count={3} />
            </div>
          )}

          {!loadingScenarios && scenarios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <StrategyCard
                  key={scenario.name}
                  scenario={scenario}
                  isSelected={selectedScenario === scenario.name}
                  onSelect={handleSelectScenario}
                  onConfirm={handleConfirm}
                  priority={priority}
                />
              ))}
            </div>
          )}

          {!loadingScenarios && scenarios.length === 0 && !scenarioError && dataReady && (
            <div className="card p-10 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-xl border-2 border-stone-200 bg-stone-50 flex items-center justify-center text-stone-400 mb-3"
                   style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-black text-ink">No strategies generated yet.</p>
              <p className="text-sm font-medium text-stone-400 mt-1">Move the priority slider to generate scenarios.</p>
            </div>
          )}
        </section>

        {/* ── Section 4: AI Explanation ───────────────────────────────────── */}
        <section aria-label="AI Explanation" className="mb-4">
          <p className="section-heading">AI Explanation &amp; Next Actions</p>
          <ExplanationPanel
            selectedScenario={selectedScenario}
            priority={priority}
            onActionsLoaded={setSuggestedActions}
          />
        </section>

        {/* ── Section 5: Action Suggestions ──────────────────────────────── */}
        {suggestedActions.length > 0 && selectedScenario && (
          <section aria-label="Suggested actions" className="mb-4">
            <ActionSuggestions
              actions={suggestedActions}
              scenarioName={selectedScenario}
            />
          </section>
        )}

        {/* ── Section 6: Decision History ─────────────────────────────────── */}
        <section aria-label="Decision history" className="mb-8">
          <DecisionHistory history={history} onClear={clearHistory} />
        </section>

        {/* ── Tech callout ─────────────────────────────────────────────────── */}
        <section>
          <div className="card p-5"
               style={{ background: '#dbeafe', borderColor: '#2563eb',
                        boxShadow: '3px 3px 0 0 #2563eb' }}>
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border-2 border-brand-600 bg-white flex items-center justify-center flex-shrink-0"
                     style={{ boxShadow: '2px 2px 0 0 #2563eb' }}>
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-ink text-sm">How DecisionIQ works</p>
                  <p className="text-xs font-medium text-stone-600 mt-0.5">
                    Slider → BigQuery inventory → Gemini 2.5 Flash → 3 ranked strategies → AI explanation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['BigQuery', 'Vertex AI', 'Gemini 2.5 Flash', 'Cloud Run'].map(tech => (
                  <span key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-black border-2 border-brand-600 bg-white text-brand-700"
                        style={{ boxShadow: '2px 2px 0 0 #2563eb' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
