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
import { fetchExplanation } from '../services/explanationApi'

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

  // ── Explanation payload storage (for metadata on confirm) ─────────────────
  const [suggestedActions, setSuggestedActions]   = useState([])
  const [lastExplanation,  setLastExplanation]    = useState(null)

  // ── Confirm state validation & Toast feedback ──────────────────────────────
  const [lastConfirmedKey, setLastConfirmedKey] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // ── Error dismissal ────────────────────────────────────────────────────────
  const [dismissedErrors, setDismissed] = useState({})
  const dismiss = (key) => setDismissed(p => ({ ...p, [key]: true }))

  const dataReady = !invLoading && !ctxLoading

  // Find the currently selected scenario object
  const selectedScenarioObj = scenarios.find(s => s.name === selectedScenario) ?? null

  // Handle explanation loaded — capture for history metadata
  const handleActionsLoaded = (actions, explanation) => {
    setSuggestedActions(actions)
    if (explanation) setLastExplanation(explanation)
  }

  // Confirm handler — saves expanded metadata to history
  const handleConfirm = async (scenario) => {
    const key = `${scenario.name}-${priority}`
    if (lastConfirmedKey === key) return

    let aiReason = null
    // If the last loaded explanation matches this scenario, use it
    if (lastExplanation && lastExplanation.scenarioName === scenario.name) {
      aiReason = lastExplanation.why_this_strategy
    } else {
      // Otherwise, fetch it on the fly
      try {
        const res = await fetchExplanation(scenario.name, priority)
        aiReason = res.why_this_strategy
      } catch (err) {
        console.error("Failed to fetch explanation for history:", err)
      }
    }

    // Build top 3 products from suggested_order (highest quantity first)
    const orderEntries = Object.entries(scenario.suggested_order || {})
    const top3 = orderEntries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, qty]) => ({ name, qty }))

    addEntry({
      scenarioName: scenario.name,
      priority,
      score:        scenario.score,
      weather:      context?.weather ?? null,
      event:        context?.event ?? null,
      topProducts:  top3,
      reason:       aiReason,
    })
    setLastConfirmedKey(key)
    showToast(`Confirmed ${scenario.name} strategy at priority ${priority}/100!`)
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
                  isConfirmed={lastConfirmedKey === `${scenario.name}-${priority}`}
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
            onActionsLoaded={handleActionsLoaded}
            inventory={inventory}
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

      </main>

      <Footer />

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 p-4 border-2 border-ink bg-amber-300 text-ink font-black text-sm rounded-xl"
             style={{ boxShadow: '4px 4px 0 0 #0a0a0a', animation: 'slide-up 0.2s ease-out' }}>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  )
}
