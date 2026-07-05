import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  fetchInventory,
  addInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct,
} from '../services/inventoryApi'

// ─────────────────────────────────────────────
// Analytics helpers — pure computation from items
// ─────────────────────────────────────────────
function computeAnalytics(items) {
  if (!items || items.length === 0) return null

  const totalProducts    = items.length
  const totalUnits       = items.reduce((s, i) => s + (i.current_stock_units || 0), 0)
  const totalValue       = items.reduce((s, i) => s + (i.current_stock_units || 0) * (i.unit_cost || 0), 0)
  const avgWeeklySales   = Math.round(items.reduce((s, i) => s + (i.avg_weekly_sales_units || 0), 0) / items.length)
  const categories       = [...new Set(items.map(i => i.category))].sort()

  const lowStock         = items.filter(i => i.current_stock_units < i.avg_weekly_sales_units * 0.5)
  const highWasteRisk    = items.filter(i => i.shelf_life_days <= 3)
  const weatherSensitive = items.filter(i => i.weather_sensitivity === 'high')
  const eventSensitive   = items.filter(i => i.local_event_flag)

  // Category distribution
  const catDist = {}
  items.forEach(i => {
    catDist[i.category] = (catDist[i.category] || 0) + 1
  })

  // Stock distribution (low/medium/high buckets)
  const stockDist = {
    low:    items.filter(i => i.current_stock_units < 30).length,
    medium: items.filter(i => i.current_stock_units >= 30 && i.current_stock_units < 80).length,
    high:   items.filter(i => i.current_stock_units >= 80).length,
  }

  // Shelf-life distribution
  const shelfDist = {
    critical: items.filter(i => i.shelf_life_days <= 3).length,
    short:    items.filter(i => i.shelf_life_days > 3 && i.shelf_life_days <= 7).length,
    medium:   items.filter(i => i.shelf_life_days > 7 && i.shelf_life_days <= 14).length,
    long:     items.filter(i => i.shelf_life_days > 14).length,
  }

  return {
    totalProducts, totalUnits, totalValue, avgWeeklySales, categories,
    lowStock, highWasteRisk, weatherSensitive, eventSensitive,
    catDist, stockDist, shelfDist,
  }
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
function StatCard({ label, value, sub, accentBg, accentBorder, accentText, icon }) {
  return (
    <div className="card p-4 flex items-center gap-4"
         style={{ background: accentBg, borderColor: accentBorder, boxShadow: `3px 3px 0 0 ${accentBorder}` }}>
      <div className="w-10 h-10 rounded-lg border-2 border-ink bg-white flex items-center justify-center flex-shrink-0"
           style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: accentText }}>{value}</p>
        <p className="text-xs font-black text-ink">{label}</p>
        {sub && <p className="text-[10px] font-semibold text-stone-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Mini bar chart (pure CSS)
// ─────────────────────────────────────────────
function BarChart({ data, color }) {
  const max = Math.max(...Object.values(data), 1)
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([label, val]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-[10px] font-black text-stone-500 w-24 flex-shrink-0 uppercase tracking-wide truncate">{label}</span>
          <div className="flex-1 h-4 bg-stone-100 rounded-lg border border-stone-200 overflow-hidden">
            <div
              className="h-full rounded-lg transition-all duration-500"
              style={{ width: `${Math.round((val / max) * 100)}%`, background: color }}
            />
          </div>
          <span className="text-xs font-black text-ink w-6 text-right">{val}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Form default
// ─────────────────────────────────────────────
const EMPTY_FORM = {
  product_name: '', category: '', avg_weekly_sales_units: 50,
  current_stock_units: 20, shelf_life_days: 5, unit_cost: 1.0,
  unit_price: 2.0, weather_sensitivity: 'low', local_event_flag: false,
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function Inventory() {
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [lastSync, setLastSync]     = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Form state
  const [isEditing, setIsEditing]         = useState(false)
  const [editOriginalName, setEditName]   = useState('')
  const [form, setForm]                   = useState(EMPTY_FORM)
  const [formError, setFormError]         = useState(null)
  const [submitting, setSubmitting]       = useState(false)
  const [successMsg, setSuccessMsg]       = useState(null)

  // Section toggle
  const [showForm, setShowForm] = useState(false)

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  // ── Fetch (single fetch + cache) ──────────────────────────────────────────
  const doFetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    setError(null)
    try {
      const data = await fetchInventory()
      setItems(data?.items || [])
      setLastSync(new Date())
    } catch (err) {
      setError('Failed to load inventory from BigQuery.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])

  const analytics = computeAnalytics(items)

  // ── CRUD helpers — update local cache immediately ─────────────────────────
  const resetForm = () => {
    setForm(EMPTY_FORM)
    setIsEditing(false)
    setEditName('')
    setFormError(null)
    setShowForm(false)
  }

  const handleEditClick = (item) => {
    setIsEditing(true)
    setEditName(item.product_name)
    setForm({
      product_name: item.product_name, category: item.category,
      avg_weekly_sales_units: item.avg_weekly_sales_units,
      current_stock_units: item.current_stock_units,
      shelf_life_days: item.shelf_life_days,
      unit_cost: item.unit_cost, unit_price: item.unit_price,
      weather_sensitivity: item.weather_sensitivity,
      local_event_flag: item.local_event_flag,
    })
    setFormError(null)
    setShowForm(true)
    setTimeout(() => document.getElementById('inv-form-anchor')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleDeleteClick = async (productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return
    try {
      await deleteInventoryProduct(productName)
      // Optimistic cache update
      setItems(prev => prev.filter(i => i.product_name !== productName))
      setLastSync(new Date())
      showSuccess(`"${productName}" deleted.`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to delete product.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      if (isEditing) {
        await updateInventoryProduct(editOriginalName, form)
        // Optimistic cache update
        setItems(prev => prev.map(i => i.product_name === editOriginalName ? { ...form, product_name: editOriginalName } : i))
        showSuccess(`"${editOriginalName}" updated.`)
      } else {
        await addInventoryProduct(form)
        // Optimistic cache update
        setItems(prev => [...prev, form])
        showSuccess(`"${form.product_name}" added.`)
      }
      setLastSync(new Date())
      resetForm()
    } catch (err) {
      setFormError(err?.response?.data?.detail || 'Failed to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f5f4' }}>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page title ─────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink tracking-tight">Inventory Analytics</h1>
          <p className="text-stone-500 mt-1.5 text-sm font-medium">
            Live inventory data from Google BigQuery — manage products and view real-time analytics.
          </p>
        </div>

        {/* ── Connection Status Panel ────────────────────────────── */}
        <div className="card p-5 mb-6"
             style={{ background: '#f0fdf4', borderColor: '#16a34a', boxShadow: '3px 3px 0 0 #16a34a' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {/* BigQuery */}
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">BigQuery</p>
                  <p className="text-xs font-black text-green-700">Connected</p>
                </div>
              </div>
              {/* Vertex AI */}
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Vertex AI</p>
                  <p className="text-xs font-black text-blue-700">Active</p>
                </div>
              </div>
              {/* Dataset */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Dataset</p>
                <p className="text-xs font-black text-ink font-mono">decisioniq</p>
              </div>
              {/* Table */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Table</p>
                <p className="text-xs font-black text-ink font-mono">inventory_data</p>
              </div>
              {/* Product count */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Products</p>
                <p className="text-xs font-black text-ink">{loading ? '—' : items.length}</p>
              </div>
              {/* Last sync */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Last Synced</p>
                <p className="text-xs font-black text-ink">
                  {lastSync ? lastSync.toLocaleTimeString() : '—'}
                </p>
              </div>
            </div>

            <button
              onClick={() => doFetch(false)}
              disabled={loading || refreshing}
              className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-lg text-xs font-black bg-white hover:bg-stone-50 transition-colors"
              style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}
            >
              <svg className={`w-3.5 h-3.5 ${(loading || refreshing) ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh from BigQuery
            </button>
          </div>
        </div>

        {/* ── Loading state ──────────────────────────────────────── */}
        {loading && (
          <div className="card p-12 text-center mb-6">
            <svg className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <p className="text-sm font-black text-stone-400">Fetching inventory from BigQuery…</p>
          </div>
        )}

        {/* ── Error state ────────────────────────────────────────── */}
        {error && (
          <div className="card p-4 mb-6 border-red-600 bg-red-50" style={{ borderColor: '#dc2626' }}>
            <p className="text-sm font-black text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* ── Analytics section ──────────────────────────────────── */}
        {!loading && analytics && (
          <>
            {/* KPI cards row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatCard label="Total Products"     value={analytics.totalProducts}                              icon="📦" accentBg="#dbeafe" accentBorder="#2563eb" accentText="#1d4ed8" />
              <StatCard label="Total Units"        value={analytics.totalUnits.toLocaleString()}                icon="🏗️" accentBg="#dcfce7" accentBorder="#16a34a" accentText="#15803d" />
              <StatCard label="Categories"         value={analytics.categories.length}                          icon="🗂️" accentBg="#fef3c7" accentBorder="#d97706" accentText="#92400e" />
              <StatCard label="Avg Weekly Sales"   value={`${analytics.avgWeeklySales} u`}                      icon="📈" accentBg="#f3e8ff" accentBorder="#9333ea" accentText="#6b21a8" />
              <StatCard label="Inventory Value"    value={`$${analytics.totalValue.toFixed(0)}`} sub="At cost" icon="💰" accentBg="#ffedd5" accentBorder="#ea580c" accentText="#c2410c" />
            </div>

            {/* Alert metrics row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Low Stock Products"    value={analytics.lowStock.length}         sub="< 50% of weekly sales" icon="⚠️"  accentBg="#fef2f2" accentBorder="#ef4444" accentText="#b91c1c" />
              <StatCard label="High Waste Risk"       value={analytics.highWasteRisk.length}    sub="Shelf life ≤ 3 days"   icon="🔴"  accentBg="#fff7ed" accentBorder="#f97316" accentText="#c2410c" />
              <StatCard label="Weather Sensitive"     value={analytics.weatherSensitive.length} sub="High sensitivity"      icon="🌦️"  accentBg="#eff6ff" accentBorder="#3b82f6" accentText="#1d4ed8" />
              <StatCard label="Event Sensitive"       value={analytics.eventSensitive.length}   sub="Local event flagged"   icon="🎪"  accentBg="#f0fdf4" accentBorder="#22c55e" accentText="#15803d" />
            </div>

            {/* Distribution charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Category distribution */}
              <div className="card p-5">
                <p className="section-heading mb-4">Category Distribution</p>
                <BarChart data={analytics.catDist} color="#2563eb" />
              </div>

              {/* Stock distribution */}
              <div className="card p-5">
                <p className="section-heading mb-4">Stock Level Distribution</p>
                <BarChart
                  data={{ 'Low (< 30u)': analytics.stockDist.low, 'Medium (30–80u)': analytics.stockDist.medium, 'High (> 80u)': analytics.stockDist.high }}
                  color="#16a34a"
                />
                <div className="mt-4 pt-3 border-t-2 border-stone-100 space-y-1">
                  {analytics.lowStock.slice(0, 3).map(i => (
                    <div key={i.product_name} className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-red-600 truncate max-w-[140px]">{i.product_name}</span>
                      <span className="text-[10px] font-black text-stone-400">{i.current_stock_units}u</span>
                    </div>
                  ))}
                  {analytics.lowStock.length > 3 && (
                    <p className="text-[10px] font-bold text-stone-400">+{analytics.lowStock.length - 3} more low stock</p>
                  )}
                </div>
              </div>

              {/* Shelf life distribution */}
              <div className="card p-5">
                <p className="section-heading mb-4">Shelf-Life Distribution</p>
                <BarChart
                  data={{ 'Critical (≤3d)': analytics.shelfDist.critical, 'Short (4–7d)': analytics.shelfDist.short, 'Medium (8–14d)': analytics.shelfDist.medium, 'Long (>14d)': analytics.shelfDist.long }}
                  color="#ea580c"
                />
              </div>
            </div>
          </>
        )}

        {/* ── Add Product button ─────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="section-heading mb-0">Product Management</p>
            <button
              onClick={() => { resetForm(); setShowForm(f => !f) }}
              className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {showForm && !isEditing ? 'Cancel' : 'Add Product'}
            </button>
          </div>
        )}

        {/* ── Inline form (Add / Edit) ────────────────────────────── */}
        {!loading && showForm && (
          <div id="inv-form-anchor" className="card p-5 mb-6 animate-slide-up">
            <h4 className="font-black text-sm uppercase text-ink mb-4">
              {isEditing ? `Edit: ${editOriginalName}` : 'Add New Product'}
            </h4>
            {formError && (
              <p className="text-xs font-bold text-red-600 mb-3 bg-red-50 border border-red-200 p-2 rounded">
                ⚠️ {formError}
              </p>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Product Name</label>
                <input type="text" required disabled={isEditing} value={form.product_name}
                  onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg disabled:opacity-50"
                  placeholder="e.g. Greek Yogurt" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Category</label>
                <input type="text" required value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                  placeholder="e.g. Dairy" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Weather Sensitivity</label>
                <select value={form.weather_sensitivity}
                  onChange={e => setForm(p => ({ ...p, weather_sensitivity: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg bg-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Avg Weekly Sales (Units)</label>
                <input type="number" min="0" required value={form.avg_weekly_sales_units}
                  onChange={e => setForm(p => ({ ...p, avg_weekly_sales_units: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Current Stock (Units)</label>
                <input type="number" min="0" required value={form.current_stock_units}
                  onChange={e => setForm(p => ({ ...p, current_stock_units: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Shelf Life (Days)</label>
                <input type="number" min="1" required value={form.shelf_life_days}
                  onChange={e => setForm(p => ({ ...p, shelf_life_days: parseInt(e.target.value) || 1 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Unit Cost ($)</label>
                <input type="number" step="0.01" min="0" required value={form.unit_cost}
                  onChange={e => setForm(p => ({ ...p, unit_cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Unit Price ($)</label>
                <input type="number" step="0.01" min="0" required value={form.unit_price}
                  onChange={e => setForm(p => ({ ...p, unit_price: parseFloat(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input id="event-flag" type="checkbox" checked={form.local_event_flag}
                  onChange={e => setForm(p => ({ ...p, local_event_flag: e.target.checked }))}
                  className="w-4 h-4 rounded border-2 border-ink" />
                <label htmlFor="event-flag" className="text-xs font-bold text-ink uppercase select-none">Local Event Flag</label>
              </div>
              <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 border-2 border-ink rounded-lg text-xs font-black bg-white hover:bg-stone-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary text-xs py-2 px-5">
                  {submitting ? 'Saving…' : isEditing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Product Table ──────────────────────────────────────── */}
        {!loading && (
          <div className="card overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-ink text-left">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500">Product</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500">Category</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-right">Avg Sales</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-right">Stock</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-right">Shelf Life</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-right">Cost</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-right">Price</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500">Weather</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500">Event</th>
                    <th className="px-3 py-3 text-[10px] font-black uppercase text-stone-500 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-stone-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-3 py-12 text-center text-xs font-bold text-stone-400">
                        No products found. Add one above.
                      </td>
                    </tr>
                  ) : items.map(item => {
                    const isLowStock = item.current_stock_units < item.avg_weekly_sales_units * 0.5
                    const isHighWaste = item.shelf_life_days <= 3
                    return (
                      <tr key={item.product_name}
                          className={`hover:bg-stone-50 transition-colors ${isLowStock ? 'bg-red-50/40' : isHighWaste ? 'bg-orange-50/40' : ''}`}>
                        <td className="px-3 py-2.5 text-xs font-black text-ink">
                          <div className="flex items-center gap-1.5">
                            {item.product_name}
                            {isLowStock  && <span className="text-[9px] font-black text-red-600 border border-red-300 rounded px-1 bg-red-50">LOW</span>}
                            {isHighWaste && <span className="text-[9px] font-black text-orange-600 border border-orange-300 rounded px-1 bg-orange-50">RISK</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-xs font-bold text-stone-500">{item.category}</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.avg_weekly_sales_units}u</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.current_stock_units}u</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.shelf_life_days}d</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-stone-600 text-right">${item.unit_cost.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-xs font-bold text-stone-600 text-right">${item.unit_price.toFixed(2)}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[9px] font-black border rounded px-1.5 py-0.5 uppercase ${
                            item.weather_sensitivity === 'high' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            item.weather_sensitivity === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                            'bg-stone-50 text-stone-500 border-stone-200'}`}>
                            {item.weather_sensitivity}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {item.local_event_flag
                            ? <span className="badge text-[9px]" style={{ background: '#dcfce7', color: '#16a34a', borderColor: '#16a34a' }}>Yes</span>
                            : <span className="badge text-[9px]" style={{ background: '#f5f5f4', color: '#78716c', borderColor: '#d6d3d1' }}>No</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleEditClick(item)}
                              className="px-2 py-1 rounded border-2 border-ink text-[10px] font-black bg-stone-50 hover:bg-stone-100 transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteClick(item.product_name)}
                              className="px-2 py-1 rounded border-2 border-red-600 text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed bottom-5 right-5 z-50 p-4 border-2 border-ink bg-amber-300 text-ink font-black text-sm rounded-xl"
             style={{ boxShadow: '4px 4px 0 0 #0a0a0a', animation: 'slide-up 0.2s ease-out' }}>
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}
    </div>
  )
}
