/**
 * InventorySummaryCard – aggregated inventory stats from BigQuery.
 */
export default function InventorySummaryCard({ data }) {
  if (!data) return null

  const stats = [
    {
      label: 'Products',
      value: data.total_products,
      icon: '📦',
      accent: 'bg-brand-600',
    },
    {
      label: 'Total Stock',
      value: `${data.total_stock_units?.toLocaleString()} units`,
      icon: '🗃️',
      accent: 'bg-accent-600',
    },
    {
      label: 'Avg Weekly Sales',
      value: `${data.avg_weekly_sales} u/wk`,
      icon: '📈',
      accent: 'bg-amber-500',
    },
    {
      label: 'Categories',
      value: data.categories?.length,
      icon: '🏷️',
      accent: 'bg-purple-600',
    },
  ]

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-heading">Inventory Summary</p>
        </div>
        <span className="badge text-accent-700" style={{ borderColor: '#16a34a', background: '#dcfce7' }}>
          ● Live BigQuery
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label}
               className="flex items-center gap-3 p-3 rounded-xl border-2 border-stone-100 bg-stone-50">
            <div className={`w-9 h-9 rounded-lg ${stat.accent} border-2 border-ink
                            flex items-center justify-center text-lg flex-shrink-0`}
                 style={{ boxShadow: '2px 2px 0 0 #0a0a0a' }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-base font-black text-ink mt-0.5 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category pills */}
      {data.categories?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {data.categories.map((cat) => (
            <span key={cat}
                  className="px-2 py-0.5 rounded-md text-xs font-bold bg-white
                             border-2 border-stone-200 text-stone-600">
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
