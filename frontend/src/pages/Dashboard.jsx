import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import InventorySummaryCard from '../components/InventorySummaryCard'
import WeatherCard from '../components/WeatherCard'
import EventCard from '../components/EventCard'
import PrioritySlider from '../components/PrioritySlider'
import StrategyCard from '../components/StrategyCard'
import ExplanationPanel from '../components/ExplanationPanel'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorBanner from '../components/ErrorBanner'
import { useFetch } from '../hooks/useFetch'
import { useDashboard } from '../hooks/useDashboard'
import { fetchInventory } from '../services/inventoryApi'
import { fetchContext } from '../services/contextApi'

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

  const [dismissedErrors, setDismissed] = useState({})
  const dismiss = (key) => setDismissed(p => ({ ...p, [key]: true }))

  const dataReady = !invLoading && !ctxLoading

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory Decision Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Compare purchasing strategies powered by Gemini AI — adjust the slider to reprioritise instantly.
          </p>
        </div>

        {/* ── Global error banners ────────────────────────────────────────── */}
        <div className="space-y-3 mb-6">
          {invError && !dismissedErrors.inv && (
            <ErrorBanner
              message={`Inventory load failed: ${invError}`}
              onDismiss={() => dismiss('inv')}
            />
          )}
          {ctxError && !dismissedErrors.ctx && (
            <ErrorBanner
              message={`Context load failed: ${ctxError}`}
              onDismiss={() => dismiss('ctx')}
            />
          )}
          {scenarioError && !dismissedErrors.scen && (
            <ErrorBanner
              message={scenarioError}
              onDismiss={() => dismiss('scen')}
            />
          )}
        </div>

        {/* ── Section 1: Context row ──────────────────────────────────────── */}
        <section aria-label="Context information" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Inventory summary */}
            {invLoading
              ? <LoadingSkeleton type="card" />
              : <InventorySummaryCard data={inventory} />
            }

            {/* Weather */}
            {ctxLoading
              ? <LoadingSkeleton type="context" />
              : <WeatherCard weather={context?.weather} date={context?.date} />
            }

            {/* Event */}
            {ctxLoading
              ? <LoadingSkeleton type="context" />
              : <EventCard event={context?.event} />
            }
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
            <h2 className="section-heading mb-0">Purchasing Strategies</h2>
            {loadingScenarios && (
              <div className="flex items-center gap-2 text-xs text-brand-600 font-medium">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993
                       0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0
                       0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Gemini is thinking…
              </div>
            )}
          </div>

          {/* Loading skeletons */}
          {loadingScenarios && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LoadingSkeleton type="scenario" count={3} />
            </div>
          )}

          {/* Strategy cards — sorted by rank */}
          {!loadingScenarios && scenarios.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <StrategyCard
                  key={scenario.name}
                  scenario={scenario}
                  isSelected={selectedScenario === scenario.name}
                  onSelect={handleSelectScenario}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loadingScenarios && scenarios.length === 0 && !scenarioError && dataReady && (
            <div className="card p-10 text-center text-slate-400">
              <span className="text-4xl mb-3 block">🤔</span>
              <p className="font-medium">No strategies generated yet.</p>
              <p className="text-sm mt-1">Move the priority slider to generate scenarios.</p>
            </div>
          )}
        </section>

        {/* ── Section 4: Explanation panel ────────────────────────────────── */}
        <section aria-label="AI Explanation">
          <h2 className="section-heading">AI Explanation</h2>
          <ExplanationPanel
            selectedScenario={selectedScenario}
            priority={priority}
          />
        </section>

        {/* ── How it works callout ────────────────────────────────────────── */}
        <section className="mt-10">
          <div className="card p-5 bg-gradient-to-r from-brand-50 to-accent-50 border border-brand-100">
            <div className="flex flex-wrap gap-6 justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">How DecisionIQ works</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adjust the slider → Gemini reads your BigQuery inventory → generates 3 strategies → explains the best fit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['BigQuery', 'Vertex AI', 'Gemini 2.5 Flash', 'Cloud Run'].map(tech => (
                  <span key={tech}
                        className="badge bg-white border border-brand-100 text-brand-600 text-xs">
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
