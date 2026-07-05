import { useState } from 'react'
import {
  addInventoryProduct,
  updateInventoryProduct,
  deleteInventoryProduct
} from '../services/inventoryApi'

export default function InventoryPanel({ inventoryData, onInventoryChanged }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editOriginalName, setEditOriginalName] = useState('')
  const [form, setForm] = useState({
    product_name: '',
    category: '',
    avg_weekly_sales_units: 50,
    current_stock_units: 20,
    shelf_life_days: 5,
    unit_cost: 1.0,
    unit_price: 2.0,
    weather_sensitivity: 'low',
    local_event_flag: false,
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const items = inventoryData?.items || []

  const resetForm = () => {
    setForm({
      product_name: '',
      category: '',
      avg_weekly_sales_units: 50,
      current_stock_units: 20,
      shelf_life_days: 5,
      unit_cost: 1.0,
      unit_price: 2.0,
      weather_sensitivity: 'low',
      local_event_flag: false,
    })
    setIsEditing(false)
    setEditOriginalName('')
    setError(null)
  }

  const handleEditClick = (item) => {
    setIsEditing(true)
    setEditOriginalName(item.product_name)
    setForm({
      product_name: item.product_name,
      category: item.category,
      avg_weekly_sales_units: item.avg_weekly_sales_units,
      current_stock_units: item.current_stock_units,
      shelf_life_days: item.shelf_life_days,
      unit_cost: item.unit_cost,
      unit_price: item.unit_price,
      weather_sensitivity: item.weather_sensitivity,
      local_event_flag: item.local_event_flag,
    })
    setError(null)
    // Scroll form into view
    document.getElementById('inventory-form-start')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDeleteClick = async (productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return
    try {
      await deleteInventoryProduct(productName)
      onInventoryChanged()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to delete product.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isEditing) {
        await updateInventoryProduct(editOriginalName, form)
      } else {
        await addInventoryProduct(form)
      }
      resetForm()
      onInventoryChanged()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save product. Ensure name is unique.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card animate-slide-up overflow-hidden mb-6">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center bg-brand-500"
               style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-black text-ink">Manage Inventory</p>
            <p className="text-xs font-medium text-stone-400 mt-0.5">
              Add, update, or remove BigQuery products directly
            </p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
             fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel Body */}
      <div className={`panel-enter ${isOpen ? 'panel-open' : ''}`}>
        <div className="px-5 pb-6 border-t-2 border-stone-100">
          
          {/* Edit/Add Form */}
          <div id="inventory-form-start" className="mt-5 p-4 border-2 border-ink rounded-xl bg-stone-50 mb-6">
            <h4 className="font-black text-sm uppercase text-ink mb-3">
              {isEditing ? `Edit Product: ${editOriginalName}` : 'Add New Product'}
            </h4>
            
            {error && (
              <p className="text-xs font-bold text-red-600 mb-3 bg-red-50 border border-red-200 p-2 rounded">
                ⚠️ {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  disabled={isEditing} // Product name key remains immutable on edit
                  value={form.product_name}
                  onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg disabled:opacity-50"
                  placeholder="e.g. Greek Yogurt"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                  placeholder="e.g. Dairy"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Weather Sensitivity</label>
                <select
                  value={form.weather_sensitivity}
                  onChange={e => setForm(p => ({ ...p, weather_sensitivity: e.target.value }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg bg-white"
                >
                  <option value="low">Low Sensitivity</option>
                  <option value="medium">Medium Sensitivity</option>
                  <option value="high">High Sensitivity</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Avg Weekly Sales (Units)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.avg_weekly_sales_units}
                  onChange={e => setForm(p => ({ ...p, avg_weekly_sales_units: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Current Stock (Units)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={form.current_stock_units}
                  onChange={e => setForm(p => ({ ...p, current_stock_units: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Shelf Life (Days)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.shelf_life_days}
                  onChange={e => setForm(p => ({ ...p, shelf_life_days: parseInt(e.target.value) || 1 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Unit Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.unit_cost}
                  onChange={e => setForm(p => ({ ...p, unit_cost: parseFloat(e.target.value) || 0.0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-stone-400 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.unit_price}
                  onChange={e => setForm(p => ({ ...p, unit_price: parseFloat(e.target.value) || 0.0 }))}
                  className="w-full text-xs font-bold p-2 border-2 border-ink rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  id="event-flag"
                  type="checkbox"
                  checked={form.local_event_flag}
                  onChange={e => setForm(p => ({ ...p, local_event_flag: e.target.checked }))}
                  className="w-4 h-4 rounded border-2 border-ink focus:ring-0"
                />
                <label htmlFor="event-flag" className="text-xs font-bold text-ink uppercase select-none">
                  Local Event Flag
                </label>
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border-2 border-ink rounded-lg text-xs font-black bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2 px-5"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>

          {/* Products List Table */}
          <div className="overflow-x-auto border-2 border-ink rounded-xl">
            <table className="min-w-full divide-y-2 divide-ink text-left">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500">Product</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500">Category</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-right">Avg Sales</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-right">Stock</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-right">Shelf Life</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-right">Cost</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-right">Price</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500">Weather</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500">Event</th>
                  <th className="px-3 py-2 text-[10px] font-black uppercase text-stone-500 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-2 divide-stone-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-3 py-8 text-center text-xs font-bold text-stone-400">
                      No products found. Add a product above.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.product_name} className="hover:bg-stone-50 transition-colors">
                      <td className="px-3 py-2.5 text-xs font-black text-ink">{item.product_name}</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-stone-500">{item.category}</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.avg_weekly_sales_units} u</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.current_stock_units} u</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-ink text-right">{item.shelf_life_days}d</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-stone-600 text-right">${item.unit_cost.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-stone-600 text-right">${item.unit_price.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-stone-500 uppercase tracking-wide">{item.weather_sensitivity}</td>
                      <td className="px-3 py-2.5 text-xs font-bold text-stone-500">
                        {item.local_event_flag ? (
                          <span className="badge text-[9px]" style={{ background: '#dcfce7', color: '#16a34a', borderColor: '#16a34a' }}>Yes</span>
                        ) : (
                          <span className="badge text-[9px]" style={{ background: '#f5f5f4', color: '#78716c', borderColor: '#d6d3d1' }}>No</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="px-2 py-1 rounded border-2 border-ink text-[10px] font-black bg-stone-50 hover:bg-stone-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.product_name)}
                          className="px-2 py-1 rounded border-2 border-red-600 text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
