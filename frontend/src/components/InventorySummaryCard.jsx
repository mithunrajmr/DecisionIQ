/**
 * InventorySummaryCard – displays aggregated inventory stats.
 */
export default function InventorySummaryCard({ data }) {
  if (!data) return null

  const stats = [
    {
      label: 'Products',
      value: data.total_products,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0
               01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504
               1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621
               0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      color: 'text-brand-600 bg-brand-50',
    },
    {
      label: 'Total Stock',
      value: `${data.total_stock_units?.toLocaleString()} units`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5
               0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5
               0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0
               0l-.5 1.5" />
        </svg>
      ),
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Avg Weekly Sales',
      value: `${data.avg_weekly_sales} units`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0
               0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Categories',
      value: data.categories?.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659
               1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0
               005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25
               2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      color: 'text-orange-600 bg-orange-50',
    },
  ]

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor"
               viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0
                 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504
                 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621
                 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h2 className="font-semibold text-slate-700">Inventory Summary</h2>
        <span className="ml-auto badge bg-accent-100 text-accent-700">Live from BigQuery</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label}
               className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category pills */}
      {data.categories?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.categories.map((cat) => (
            <span key={cat}
                  className="badge bg-slate-100 text-slate-600 border border-slate-200">
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
