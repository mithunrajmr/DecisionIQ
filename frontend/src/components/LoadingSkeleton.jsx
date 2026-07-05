/**
 * LoadingSkeleton – shimmer placeholders while data is loading.
 * type: 'card' | 'context' | 'scenario'
 */
export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} type={type} />
      ))}
    </>
  )
}

function SkeletonItem({ type }) {
  if (type === 'context') {
    return (
      <div className="card p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded" style={{ marginBottom: '0.75rem' }} />
        <div className="flex items-center gap-3">
          <div className="skeleton w-12 h-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    )
  }

  if (type === 'scenario') {
    return (
      <div className="card p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="skeleton w-8 h-8 rounded-lg" />
            <div className="skeleton h-5 w-28 rounded" />
          </div>
          <div className="skeleton w-14 h-14 rounded-xl" />
        </div>
        {/* Score bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-3 w-8 rounded" />
          </div>
          <div className="skeleton h-2.5 w-full rounded-full" />
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
        </div>
        {/* Order items */}
        <div className="space-y-1.5">
          {[100, 85, 70, 55].map((w, i) => (
            <div key={i} className="skeleton h-8 rounded-lg" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Button */}
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    )
  }

  // Default 'card'
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="flex gap-3">
        <div className="skeleton w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="skeleton h-14 rounded-xl" />
        <div className="skeleton h-14 rounded-xl" />
      </div>
    </div>
  )
}
